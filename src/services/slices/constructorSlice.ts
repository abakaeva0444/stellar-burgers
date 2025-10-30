import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      return {
        ...state,
        bun: action.payload
      };
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        return state;
      }

      const newIngredient: TConstructorIngredient = {
        ...action.payload,
        id: `${action.payload._id}-${Date.now()}`
      };

      const currentIngredients = state.ingredients || [];

      return {
        ...state,
        ingredients: [...currentIngredients, newIngredient]
      };
    },
    clearConstructor: () => {
      return initialState;
    }
  }
});

export const { addBun, addIngredient, clearConstructor } =
  constructorSlice.actions;

export default constructorSlice.reducer;
