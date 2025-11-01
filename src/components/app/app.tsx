import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import { Modal } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { FC, useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { fetchUser } from '../../services/slices/authSlice';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const App: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />

          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleModalClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
