import React from 'react';
import { useUnit } from 'effector-react';
import { $rooms, $timeSlots, $selectedDate, selectDate, $user } from '../../stores/bookingStore';
import { RoomCard } from './RoomCard';

export const RoomList: React.FC = () => {
  const rooms = useUnit($rooms);
  const timeSlots = useUnit($timeSlots);
  const selectedDate = useUnit($selectedDate);
  const user = useUnit($user);
  const canBook = user?.role === 'analyst' || user?.role === 'admin';

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="section-title">🚪 Доступные комнаты</h4><p className="text-muted">Выберите комнату для бронирования</p></div>
        <div><label className="form-label me-2">📅 Дата:</label><input type="date" className="form-control d-inline-block" style={{ width: 'auto' }} value={selectedDate} onChange={(e) => selectDate(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
      </div>
      <div className="rooms-grid">{rooms.map((room) => (<RoomCard key={room.id} room={room} timeSlots={timeSlots} canBook={canBook} />))}</div>
    </div>
  );
};