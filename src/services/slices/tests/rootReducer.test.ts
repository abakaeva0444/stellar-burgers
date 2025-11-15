import store from '../../store';

describe('rootReducer', () => {
  it('should initialize with correct state structure and initial values', () => {
    const state = store.getState();

    // Проверяем структуру
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructor');
    expect(state).toHaveProperty('orderBurger');
    expect(state).toHaveProperty('auth');

    // Проверяем начальные значения
    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(state.constructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.orderBurger).toEqual({
      order: null,
      loading: false
    });

    // auth может иметь разные начальные значения, проверяем структуру
    expect(state.auth).toHaveProperty('user');
    expect(state.auth).toHaveProperty('isAuthChecked');
    expect(state.auth).toHaveProperty('isLoading');
  });
});
