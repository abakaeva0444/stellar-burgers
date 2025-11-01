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

  const orderIngredients = useMemo(
    () =>
      order.ingredients
        .map((id: string) =>
          ingredients.find((ingredient: TIngredient) => ingredient._id === id)
        )
        .filter(Boolean),
    [order.ingredients, ingredients]
  );

  const total = useMemo(
    () =>
      orderIngredients.reduce(
        (sum: number, ingredient) => sum + (ingredient?.price || 0),
        0
      ),
    [orderIngredients]
  );

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

  const getStatusClass = (status: string) =>
    status === 'done' ? styles.statusDone : '';

  const basePath = location.pathname.includes('/profile')
    ? '/profile/orders'
    : '/feed';

  return (
    <Link
      to={`${basePath}/${order.number}`}
      state={{ background: location }}
      className={`p-6 mb-4 mr-2 ${styles.order}`}
    >
      <div className={styles.order_info}>
        <span className={`text text_type_digits-default ${styles.number}`}>
          #{String(order.number).padStart(6, '0')}
        </span>
        <FormattedDate
          date={new Date(order.createdAt)}
          className='text text_type_main-default text_color_inactive'
        />
      </div>

      <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
        {order.name}
      </h4>

      {showStatus && (
        <p
          className={`${getStatusClass(order.status)} text text_type_main-default mt-2`}
        >
          {getStatusText(order.status)}
        </p>
      )}

      <div className={`pt-6 ${styles.order_content}`}>
        <ul className={styles.ingredients}>
          {orderIngredients.slice(0, 6).map((ingredient, index) => (
            <li
              className={styles.img_wrap}
              style={{ zIndex: 6 - index }}
              key={index}
            >
              <img
                src={ingredient?.image}
                alt={ingredient?.name}
                className={styles.img}
              />
              {index === 5 && orderIngredients.length > 6 && (
                <span
                  className={`text text_type_digits-default ${styles.remains}`}
                >
                  +{orderIngredients.length - 6}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div>
          <span
            className={`text text_type_digits-default pr-1 ${styles.order_total}`}
          >
            {total}
          </span>
          <CurrencyIcon type='primary' />
        </div>
      </div>
    </Link>
  );
};
