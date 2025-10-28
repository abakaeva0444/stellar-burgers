import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  createOrder,
  clearOrder
} from '../../services/slices/orderBurgerSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Берем данные из store с безопасными значениями по умолчанию
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

  // Очищаем конструктор при успешном создании заказа
  useEffect(() => {
    if (orderModalData && orderModalData.number) {
      // Заказ успешно создан - очищаем конструктор
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Собираем массив ID ингредиентов для заказа
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
    // При закрытии модального окна очищаем только данные заказа,
    // но не очищаем конструктор
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

  // Создаем безопасный объект для передачи в UI компонент
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
    />
  );
};
