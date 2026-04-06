import React, { useEffect, useState, ChangeEvent } from 'react';
import { useUnit } from 'effector-react';
import { $showModal, $selectedRoom, $selectedDate, $selectedTimeRange, $editingBooking, $rooms, setShowModal, createBooking, updateBooking, setEditingBooking, clearSelection } from '../../stores/bookingStore';

export const BookingModal: React.FC = () => {
  const showModal = useUnit($showModal);
  const selectedRoom = useUnit($selectedRoom);
  const selectedDate = useUnit($selectedDate);
  const selectedTimeRange = useUnit($selectedTimeRange);
  const editingBooking = useUnit($editingBooking);
  const rooms = useUnit($rooms);
  const [formData, setFormData] = useState({ topic: '', description: '', roomId: selectedRoom?.id || 0 });

  useEffect(() => {
    if (editingBooking) { setFormData({ topic: editingBooking.topic, description: editingBooking.description || '', roomId: editingBooking.roomId }); }
    else { setFormData({ topic: '', description: '', roomId: selectedRoom?.id || 0 }); }
  }, [editingBooking, showModal, selectedRoom]);

  if (!showModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) return;
    if (editingBooking) { updateBooking({ id: editingBooking.id, data: { topic: formData.topic, description: formData.description, roomId: formData.roomId } }); }
    else { createBooking({ roomId: formData.roomId, date: selectedDate, startTime: selectedTimeRange.start || 9, endTime: selectedTimeRange.end || 10, topic: formData.topic, description: formData.description }); }
    setShowModal(false);
    setEditingBooking(null);
    clearSelection();
  };

  const handleRoomChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newRoomId = Number(e.target.value);
    setFormData(prev => ({ ...prev, roomId: newRoomId }));
  };

  return (
    <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingBooking(null); }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h5>{editingBooking ? '✏️ Редактирование' : '🔒 Новое бронирование'}</h5><button type="button" className="btn-close" onClick={() => { setShowModal(false); setEditingBooking(null); }}></button></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label className="form-label">Комната</label><select className="form-select" value={formData.roomId} onChange={handleRoomChange}>{rooms.map((room: any) => (<option key={room.id} value={room.id}>{room.name}</option>))}</select></div>
          <div className="mb-3"><label className="form-label">Дата</label><input type="text" className="form-control" value={new Date(selectedDate).toLocaleDateString('ru-RU')} disabled /></div>
          {!editingBooking && (<div className="mb-3"><label className="form-label">Время</label><input type="text" className="form-control" value={`${selectedTimeRange.start || 9}:00 - ${selectedTimeRange.end || 10}:00`} disabled /></div>)}
          <div className="mb-3"><label className="form-label">Тема встречи *</label><input type="text" className="form-control" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} placeholder="Например: Планерка отдела" required /></div>
          <div className="mb-3"><label className="form-label">Описание</label><textarea className="form-control" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingBooking(null); }}>Отмена</button><button type="submit" className="btn btn-primary">{editingBooking ? 'Сохранить' : 'Забронировать'}</button></div>
        </form>
      </div>
    </div>
  );
};