describe('Burger Constructor', () => {
  // Общие настройки
  const commonSetup = () => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Cannot call hover while not dragging')) {
        return false;
      }
      return true;
    });

    cy.intercept('GET', '**/api/ingredients**', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '**/api/orders**', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/');

    cy.window().then((win) => {
      const overlay = win.document.getElementById(
        'webpack-dev-server-client-overlay'
      );
      if (overlay) {
        overlay.remove();
      }
    });

    cy.wait('@getIngredients', { timeout: 10000 });
    cy.get('body').should('be.visible');
  };

  // Для авторизованных тестов
  const authSetup = () => {
    cy.intercept('GET', '**/api/auth/user**', { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.setCookie('accessToken', 'mock-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    commonSetup();
  };

  // Для неавторизованных тестов
  const unauthSetup = () => {
    cy.intercept('GET', '**/api/auth/user**', {
      statusCode: 401,
      body: { message: 'Not authorized' }
    }).as('getUserUnauth');

    cy.clearCookies();
    cy.clearLocalStorage();

    commonSetup();
  };

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Authorized tests', () => {
    beforeEach(() => {
      authSetup();
    });

    // Общие элементы для всех тестов
    const getConstructor = () => cy.get('[data-testid=constructor]');
    const getOrderButton = () => cy.contains('Оформить заказ');

    it('should load ingredients', () => {
      // Используем aliases для часто используемых элементов
      cy.contains('Краторная булка N-200i').as('bun');
      cy.contains('Биокотлета из марсианской Магнолии').as('main');
      cy.contains('Филе Люминесцентного тетраодонтимформа').as('sauce');

      cy.get('@bun').should('exist');
      cy.get('@main').should('exist');
      cy.get('@sauce').should('exist');
    });

    it('should add bun via add button', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .as('bunButton')
        .click({ force: true });

      getConstructor().contains('Краторная булка N-200i').should('exist');

      getOrderButton().should('be.enabled');
    });

    it('should add ingredient via add button', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .as('ingredientButton')
        .click({ force: true });

      getConstructor()
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });

    it('should add multiple ingredients and enable order button', () => {
      // Создаем aliases для всех ингредиентов
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .as('bunButton');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .as('mainButton');
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .as('sauceButton');

      cy.get('@bunButton').click({ force: true });
      cy.get('@mainButton').click({ force: true });
      cy.get('@sauceButton').click({ force: true });

      getOrderButton().should('be.enabled');
    });

    it('should open and close ingredient details modal', () => {
      cy.contains('Краторная булка N-200i')
        .as('ingredient')
        .click({ force: true });

      cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');

      // Проверяем модальное окно
      cy.contains('Детали ингредиента').as('modalTitle').should('exist');
      cy.get('@ingredient').should('exist');

      // Закрываем через ESC
      cy.get('body').type('{esc}');
      cy.url().should('eq', 'http://localhost:4000/');
    });

    it('should show correct ingredient data in modal', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .as('ingredient')
        .click({ force: true });

      cy.url().should('include', '/ingredients/');
      cy.get('@ingredient').should('exist');

      cy.get('body').type('{esc}');
    });

    it('should complete order process with proper modal checks', () => {
      // Создаем элементы один раз и переиспользуем
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .as('bunButton');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .as('mainButton');

      cy.get('@bunButton').click({ force: true });
      cy.get('@mainButton').click({ force: true });

      getConstructor()
        .should('contain', 'Краторная булка N-200i')
        .and('contain', 'Биокотлета из марсианской Магнолии');

      getOrderButton().should('be.enabled').click({ force: true });

      // Ждем и проверяем API вызов
      cy.wait('@createOrder').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body).to.have.property('order');
        expect(interception.response?.body.order).to.have.property('number');

        cy.fixture('order.json').then((orderFixture) => {
          expect(interception.response?.body.order.number).to.equal(
            orderFixture.order.number
          );
        });
      });

      // Проверяем модальное окно заказа
      cy.contains('идентификатор заказа').as('orderIdText').should('exist');

      cy.fixture('order.json').then((order) => {
        cy.contains(order.order.number.toString())
          .as('orderNumber')
          .should('exist');
      });

      cy.contains('Ваш заказ начали готовить')
        .as('orderStatus')
        .should('exist');

      cy.get('body').type('{esc}');
    });

    it('should create order successfully when authorized', () => {
      // Переиспользуем элементы через aliases
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .as('bunButton');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .as('mainButton');

      cy.get('@bunButton').click({ force: true });
      cy.get('@mainButton').click({ force: true });

      getOrderButton().should('be.enabled');

      getConstructor()
        .should('contain', 'Краторная булка N-200i')
        .and('contain', 'Биокотлета из марсианской Магнолии');

      getOrderButton().click({ force: true });

      cy.get('@createOrder.all').should('have.length', 1);

      cy.wait('@createOrder').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body).to.have.property('success');
        expect(interception.response?.body).to.have.property('order');
        expect(interception.response?.body.order).to.have.property('number');
        expect(interception.response?.body.order).to.have.property('name');
        expect(interception.response?.body.order).to.have.property('status');
      });
    });

    it('should show empty constructor state initially', () => {
      getConstructor()
        .should('contain', 'Выберите булки')
        .and('contain', 'Выберите начинку');

      getOrderButton().should('exist');
    });
  });

  describe('Unauthorized tests', () => {
    beforeEach(() => {
      unauthSetup();
    });

    it('should redirect to login when trying to create order without authorization', () => {
      // Создаем aliases для элементов конструктора
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .as('bunButton');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .as('mainButton');

      cy.get('@bunButton').click({ force: true });
      cy.get('@mainButton').click({ force: true });

      cy.contains('Оформить заказ')
        .as('orderButton')
        .should('be.enabled')
        .click({ force: true });

      cy.url().should('include', '/login');

      // Проверяем форму логина
      cy.get('form').as('loginForm').should('exist');
      cy.get('input[type=email]').as('emailInput').should('exist');
      cy.get('input[type=password]').as('passwordInput').should('exist');
      cy.contains('button', 'Войти').as('loginButton').should('exist');
    });

    it('should show ingredients and allow burger construction without authorization', () => {
      cy.contains('Краторная булка N-200i').as('bun');
      cy.contains('Биокотлета из марсианской Магнолии').as('main');

      cy.get('@bun').should('exist');
      cy.get('@main').should('exist');

      cy.get('@bun').parent().find('button').click({ force: true });

      cy.get('[data-testid=constructor]').should(
        'contain',
        'Краторная булка N-200i'
      );

      cy.contains('Оформить заказ').should('be.enabled');
    });

    it('should open ingredient details without authorization', () => {
      cy.contains('Краторная булка N-200i')
        .as('ingredient')
        .click({ force: true });

      cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
      cy.contains('Детали ингредиента').as('modalTitle').should('exist');

      cy.get('body').type('{esc}');
      cy.url().should('eq', 'http://localhost:4000/');
    });
  });
});
