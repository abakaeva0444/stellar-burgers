describe('Burger Constructor', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('Cannot call hover while not dragging')) {
        return false;
      }
      return true;
    });

    cy.intercept('GET', '**/api/ingredients**', {
      success: true,
      data: [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-01-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa093e',
          name: 'Филе Люминесцентного тетраодонтимформа',
          type: 'main',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/meat-03.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-03-large.png',
          __v: 0
        }
      ]
    }).as('getIngredients');

    // Мок УСПЕШНОГО ответа пользователя
    cy.intercept('GET', '**/api/auth/user**', {
      success: true,
      user: {
        email: 'testuser@mail.ru',
        name: 'testname'
      }
    }).as('getUser');

    cy.visit('/');

    cy.window().then((win) => {
      const overlay = win.document.getElementById(
        'webpack-dev-server-client-overlay'
      );
      if (overlay) {
        overlay.remove();
      }
    });

    cy.setCookie('accessToken', 'mock-token');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients', { timeout: 10000 });
    cy.get('body').should('be.visible');
  });

  it('should load ingredients', () => {
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
  });

  it('should add bun via add button', () => {
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click({ force: true });

    cy.get('[data-testid=constructor]')
      .contains('Краторная булка N-200i')
      .should('exist');

    cy.contains('Оформить заказ').should('be.enabled');
  });

  it('should add ingredient via add button', () => {
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click({ force: true });

    cy.get('[data-testid=constructor]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('should add multiple ingredients and enable order button', () => {
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click({ force: true });

    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click({ force: true });

    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .find('button')
      .click({ force: true });

    cy.contains('Оформить заказ').should('be.enabled');
  });

  it('should open ingredient details page', () => {
    cy.contains('Краторная булка N-200i').click({ force: true });

    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Краторная булка N-200i').should('exist');

    cy.go('back');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('should show empty constructor state initially', () => {
    // Проверяем что конструктор изначально пуст
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');

    // Проверяем что кнопка "Оформить заказ" существует
    cy.contains('Оформить заказ').should('exist');
  });
});
