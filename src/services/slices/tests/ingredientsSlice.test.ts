import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

describe('ingredients reducer', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should set loading true on fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toEqual(true);
  });

  it('should set ingredients and loading false on fetchIngredients.fulfilled', () => {
    const mockIngredients = [
      { _id: '1', name: 'Булка', type: 'bun', price: 100 }
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toEqual(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('should set error and loading false on fetchIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(errorMessage);
    expect(state.ingredients).toEqual([]);
  });
});
