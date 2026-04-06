import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { $isAuthenticated, $selectedRoomId, $isSelectionValid, $theme, fetchRooms, fetchBookings, setShowModal } from '../../stores/bookingStore';
import { Header } from './Header';
import { RoomList } from '../Rooms/RoomList';
import { MyBookings } from '../MyBookings/MyBookings';
import { BookingModal } from '../BookingModal/BookingModal';
import { BookingDetailsModal } from '../MyBookings/BookingDetailsModal';
import { Notification } from './Notification';

export const MainLayout: React.FC = () => {
  const isAuthenticated = useUnit($isAuthenticated);
  const selectedRoomId = useUnit($selectedRoomId);
  const isSelectionValid = useUnit($isSelectionValid);
  const theme = useUnit($theme);

  useEffect(() => { fetchRooms(); fetchBookings(); }, []);

  if (!isAuthenticated) return null;

  return (
    <div className={`app-container theme-${theme}`}>
      <Header />
      <div className="main-content">
        <RoomList />
        {selectedRoomId && isSelectionValid && (
          <button className="btn btn-primary btn-lg w-100 mb-4" onClick={() => setShowModal(true)}>🔒 Забронировать выбранное время</button>
        )}
        <MyBookings />
        <BookingModal />
        <BookingDetailsModal />
        <Notification />
      </div>
    </div>
  );
};