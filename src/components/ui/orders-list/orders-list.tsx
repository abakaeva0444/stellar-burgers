import { FC } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => {
  const location = useLocation();

  return (
    <div className={`${styles.content}`}>
      {orderByDate.map((order) => (
        <OrderCard
          order={order}
          key={order._id}
          showStatus={location.pathname === '/profile/orders'}
        />
      ))}
    </div>
  );
};
