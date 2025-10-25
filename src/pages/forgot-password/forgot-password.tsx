import { FC, SyntheticEvent, useState } from 'react';
import { ForgotPasswordUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Здесь будет вызов API для восстановления пароля
    navigate('/reset-password');
  };

  return (
    <ForgotPasswordUI
      errorText=''
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
