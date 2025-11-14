import store from '../../store';

describe('rootReducer', () => {
  it('should initialize with correct state structure', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructor');
    expect(state).toHaveProperty('orderBurger');
    expect(state).toHaveProperty('auth');
  });
});
