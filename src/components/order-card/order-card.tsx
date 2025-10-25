import { FC, useMemo } from 'react';
import { TOrder, TIngredient } from '@utils-types';
import {
  FormattedDate,
  CurrencyIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from '../../services/store';
import styles from '../ui/order-card/order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  showStatus?: boolean;
};

export const OrderCard: FC<TOrderCardProps> = ({
  order,
  showStatus = false
}) => {
  const location = useLocation();
  const { ingredients } = useSelector((store) => store.ingredients);

  const orderIngredients = useMemo(() => {
    return order.ingredients
      .map((id: string) =>
        ingredients.find((ingredient: TIngredient) => ingredient._id === id)
      )
      .filter(Boolean);
  }, [order.ingredients, ingredients]);

  const total = useMemo(() => {
    return orderIngredients.reduce(
      (sum: number, ingredient) => sum + (ingredient?.price || 0),
      0
    );
  }, [orderIngredients]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created':
        return 'Создан';
      case 'pending':
        return 'Готовится';
      case 'done':
        return 'Выполнен';
      default:
        return 'Отменён';
    }
  };

  const getStatusClass = (status: string) => {
    return status === 'done' ? styles.statusDone : '';
  };

  const basePath = location.pathname.includes('/profile')
    ? '/profile/orders'
    : '/feed';

  return (
    <Link
      to={`${basePath}/${order.number}`}
      state={{ background: location }}
      className={styles.link}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <span className='text text_type_digits-default'>#{order.number}</span>
          <FormattedDate
            date={new Date(order.createdAt)}
            className='text text_type_main-default text_color_inactive'
          />
        </div>

        <h3 className={`${styles.title} text text_type_main-medium mt-6`}>
          {order.name}
        </h3>

        {showStatus && (
          <p
            className={`${styles.status} ${getStatusClass(order.status)} text text_type_main-default mt-2`}
          >
            {getStatusText(order.status)}
          </p>
        )}

        <div className={`${styles.content} mt-6`}>
          <div className={styles.ingredients}>
            {orderIngredients.slice(0, 6).map((ingredient, index) => (
              <div
                key={index}
                className={styles.ingredient}
                style={{ zIndex: 6 - index }}
              >
                <img
                  src={ingredient?.image}
                  alt={ingredient?.name}
                  className={styles.ingredientImage}
                />
                {index === 5 && orderIngredients.length > 6 && (
                  <div className={styles.overlay}>
                    <span className='text text_type_main-default'>
                      +{orderIngredients.length - 6}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.price}>
            <span className='text text_type_digits-default'>{total}</span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </div>
    </Link>
  );
};
