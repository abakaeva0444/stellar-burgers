import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient1: TIngredient = {
  _id: '2',
  name: 'Начинка 1',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient2: TIngredient = {
  _id: '3',
  name: 'Начинка 2',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 75,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockIngredient3: TIngredient = {
  _id: '4',
  name: 'Начинка 3',
  type: 'sauce',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 60,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('constructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('should handle initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle addBun', () => {
    const actual = constructorReducer(initialState, addBun(mockBun));
    expect(actual.bun).toEqual(mockBun);
    expect(actual.ingredients).toHaveLength(0);
  });

  it('should handle addIngredient', () => {
    const actual = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    expect(actual.ingredients).toHaveLength(1);
    expect(actual.ingredients[0].name).toEqual('Начинка 1');
    expect(actual.ingredients[0].id).toBeDefined();
  });

  it('should not add bun via addIngredient', () => {
    const actual = constructorReducer(initialState, addIngredient(mockBun));
    expect(actual.ingredients).toHaveLength(0);
  });

  it('should handle add multiple ingredients', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));
    state = constructorReducer(state, addIngredient(mockIngredient3));

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0].name).toEqual('Начинка 1');
    expect(state.ingredients[1].name).toEqual('Начинка 2');
    expect(state.ingredients[2].name).toEqual('Начинка 3');
  });

  it('should handle removeIngredient', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const ingredientIdToRemove = state.ingredients[1].id;

    state = constructorReducer(state, removeIngredient(ingredientIdToRemove));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toEqual('Начинка 1');
  });

  it('should handle moveIngredient - move from index 0 to index 2', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));
    state = constructorReducer(state, addIngredient(mockIngredient3));

    state = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]._id).toEqual('3');
    expect(state.ingredients[1]._id).toEqual('4');
    expect(state.ingredients[2]._id).toEqual('2');
  });

  it('should handle moveIngredient - move from index 2 to index 0', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));
    state = constructorReducer(state, addIngredient(mockIngredient3));

    state = constructorReducer(
      state,
      moveIngredient({ fromIndex: 2, toIndex: 0 })
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]._id).toEqual('4');
    expect(state.ingredients[1]._id).toEqual('2');
    expect(state.ingredients[2]._id).toEqual('3');
  });

  it('should handle moveIngredient - no change when fromIndex equals toIndex', () => {
    let state = constructorReducer(
      initialState,
      addIngredient(mockIngredient1)
    );
    state = constructorReducer(state, addIngredient(mockIngredient2));
    state = constructorReducer(state, addIngredient(mockIngredient3));

    const originalIngredients = [...state.ingredients];

    state = constructorReducer(
      state,
      moveIngredient({ fromIndex: 1, toIndex: 1 })
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]._id).toEqual(originalIngredients[0]._id);
    expect(state.ingredients[1]._id).toEqual(originalIngredients[1]._id);
    expect(state.ingredients[2]._id).toEqual(originalIngredients[2]._id);
  });

  it('should handle clearConstructor', () => {
    let state = constructorReducer(initialState, addBun(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient1));
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const actual = constructorReducer(state, clearConstructor());
    expect(actual.bun).toBeNull();
    expect(actual.ingredients).toHaveLength(0);
  });

  it('should replace bun when adding new bun', () => {
    const anotherBun: TIngredient = {
      _id: '5',
      name: 'Другая булка',
      type: 'bun',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 150,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    let state = constructorReducer(initialState, addBun(mockBun));
    expect(state.bun?._id).toEqual('1');

    state = constructorReducer(state, addBun(anotherBun));
    expect(state.bun?._id).toEqual('5');
    expect(state.ingredients).toHaveLength(0);
  });
});
