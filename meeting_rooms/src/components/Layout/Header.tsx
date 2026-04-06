import React from 'react';
import { useUnit } from 'effector-react';
import { $user, logout, $theme, setTheme } from '../../stores/bookingStore';
import { Theme } from '../../types';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'blue', label: 'Синяя' }, { value: 'green', label: 'Зелёная' }, { value: 'purple', label: 'Фиолетовая' },
  { value: 'orange', label: 'Оранжевая' }, { value: 'dark', label: 'Тёмная' }, { value: 'pink', label: 'Розовая' }, { value: 'sea', label: 'Морская' },
];

export const Header: React.FC = () => {
  const user = useUnit($user);
  const theme = useUnit($theme);

  return (
    <header className="app-header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="logo"><span>🏢</span><span>Переговорные комнаты</span></div>
          {user && (
            <div className="user-info">
              <select className="theme-selector" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                {THEMES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
              <span>{user.fullName}</span>
              <span className="badge bg-light text-dark">{user.role}</span>
              <button className="btn btn-outline-light btn-sm" onClick={() => logout()}>Выйти</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};