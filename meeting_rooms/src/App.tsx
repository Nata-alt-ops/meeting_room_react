import React from 'react';
import { useUnit } from 'effector-react';
import { $isAuthenticated } from './stores/bookingStore';
import { Auth } from './components/Auth/Auth';
import { MainLayout } from './components/Layout/MainLayout';

const App: React.FC = () => {
  const isAuthenticated = useUnit($isAuthenticated);

  return (
    <>
      <Auth />
      <MainLayout />
    </>
  );
};

export default App;