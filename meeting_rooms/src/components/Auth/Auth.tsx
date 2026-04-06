import React, { useState } from 'react';
import { useUnit } from 'effector-react';
import { login, $isAuthenticated } from '../../stores/bookingStore';

export const Auth: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const isAuthenticated = useUnit($isAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username: formData.username, password: formData.password });
  };

  if (isAuthenticated) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">🏢 Вход в систему</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Имя пользователя</label>
            <input type="text" className="form-control" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Пароль</label>
            <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Войти</button>
        </form>
        <div className="mt-3 text-center">
          <small className="text-muted">Тест: <strong>analyst</strong> / <strong>employee</strong> (пароль: password)</small>
        </div>
      </div>
    </div>
  );
};