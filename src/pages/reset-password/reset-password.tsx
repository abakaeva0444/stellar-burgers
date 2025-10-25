import { FC, SyntheticEvent, useState } from 'react';
import { ResetPasswordUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Здесь будет вызов API для сброса пароля
    navigate('/login');
  };

  return (
    <ResetPasswordUI
      errorText=''
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
