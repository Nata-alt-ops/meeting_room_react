import React from 'react';
import { useUnit } from 'effector-react';
import { $selectedBooking, $showDetailsModal, setShowDetailsModal } from '../../stores/bookingStore';

export const BookingDetailsModal: React.FC = () => {
  const selectedBooking = useUnit($selectedBooking);
  const showDetailsModal = useUnit($showDetailsModal);
  if (!showDetailsModal || !selectedBooking) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h5>📋 Детали бронирования</h5><button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button></div>
        <div className="booking-details-modal">
          <div className="detail-row"><span className="detail-label">Комната:</span><span className="detail-value">{selectedBooking.roomName}</span></div>
          <div className="detail-row"><span className="detail-label">Дата:</span><span className="detail-value">{new Date(selectedBooking.date).toLocaleDateString('ru-RU')}</span></div>
          <div className="detail-row"><span className="detail-label">Время:</span><span className="detail-value">{selectedBooking.startTime}:00 - {selectedBooking.endTime}:00</span></div>
          <div className="detail-row"><span className="detail-label">Тема:</span><span className="detail-value">{selectedBooking.topic}</span></div>
          {selectedBooking.description && (<div className="detail-row"><span className="detail-label">Описание:</span><span className="detail-value">{selectedBooking.description}</span></div>)}
          <div className="detail-row"><span className="detail-label">Организатор:</span><span className="detail-value">{selectedBooking.userName}</span></div>
          <div className="detail-row"><span className="detail-label">Email:</span><span className="detail-value">{selectedBooking.userEmail}</span></div>
        </div>
        <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Закрыть</button></div>
      </div>
    </div>
  );
};