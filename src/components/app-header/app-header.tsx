import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from '../ui/app-header/app-header.module.css';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='text text_type_main-default ml-2'>
                  Лента заказов
                </span>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo />
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='text text_type_main-default ml-2'>
                  {user ? user.name : 'Личный кабинет'}
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
