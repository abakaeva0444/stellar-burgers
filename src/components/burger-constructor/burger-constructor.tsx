import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  createOrder,
  clearOrder
} from '../../services/slices/orderBurgerSlice';
import {
  clearConstructor,
  addBun,
  addIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((store) => store.constructor) || {
    bun: null,
    ingredients: []
  };
  const { order: orderModalData, loading: orderRequest } = useSelector(
    (store) => store.orderBurger
  ) || {
    order: null,
    loading: false
  };
  const { user } = useSelector((store) => store.auth) || { user: null };

  useEffect(() => {
    if (orderModalData && orderModalData.number) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const handleDrop = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(addBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...(constructorItems.ingredients || []).map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const safeConstructorItems = {
    bun: constructorItems.bun,
    ingredients: constructorItems.ingredients || []
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onDrop={handleDrop}
    />
  );
};
