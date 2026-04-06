import React from 'react';
import { useUnit } from 'effector-react';
import { $notification } from '../../stores/bookingStore';

export const Notification: React.FC = () => {
  const notification = useUnit($notification);
  if (!notification) return null;
  return (<div className={`notification ${notification.type}`}>{notification.message}</div>);
};