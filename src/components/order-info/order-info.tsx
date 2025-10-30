import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderByNumber,
  clearOrderDetails
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((store) => store.order);
  const { ingredients } = useSelector((store) => store.ingredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }

    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    // Преобразуем ingredientsInfo в массив для соответствия типу
    const ingredientsInfoArray = Object.values(ingredientsInfo);

    return {
      ...order,
      ingredientsInfo: ingredientsInfoArray, // Теперь это массив
      date,
      total,
      number: order.number,
      status: order.status,
      statusText:
        order.status === 'done'
          ? 'Выполнен'
          : order.status === 'pending'
            ? 'Готовится'
            : order.status === 'created'
              ? 'Создан'
              : 'Отменен'
    };
  }, [order, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
