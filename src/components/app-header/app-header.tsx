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
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.leftMenu}>
            <NavLink
              to='/'
              className={({ isActive }) =>
                `${styles.link} p-5 mr-2 ${isActive ? styles.linkActive : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                  <span className='text text_type_main-default ml-2'>
                    Конструктор
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to='/feed'
              className={({ isActive }) =>
                `${styles.link} p-5 ${isActive ? styles.linkActive : ''}`
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

          <div className={styles.rightMenu}>
            <NavLink
              to='/profile'
              className={({ isActive }) =>
                `${styles.link} p-5 ${isActive ? styles.linkActive : ''}`
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
      </div>
    </header>
  );
};
