import React from 'react';
import { useUnit } from 'effector-react';
import { Room, TimeSlot } from '../../types';
import { selectRoom, selectTimeSlot, $selectedRoomId } from '../../stores/bookingStore';

interface RoomCardProps { room: Room; timeSlots: TimeSlot[]; canBook: boolean; }

export const RoomCard: React.FC<RoomCardProps> = ({ room, timeSlots, canBook }) => {
  const selectedRoomId = useUnit($selectedRoomId);
  const isSelected = selectedRoomId === room.id;

  return (
    <div className={`room-card ${isSelected ? 'selected' : ''}`} onClick={() => selectRoom(room.id)}>
      <img src={room.image} alt={room.name} className="room-image" />
      <div className="room-info">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="room-name">{room.name}</h5>
          <span className="badge bg-secondary">{room.roomNumber}</span>
        </div>
        <p className="room-capacity">👥 {room.capacity} человек</p>
        <div className="room-equipment">{room.equipment.map((item) => (<span key={item} className="badge bg-light text-dark me-1">{item}</span>))}</div>
        {isSelected && canBook && (
          <div className="time-slots mt-3">
            <p className="small text-muted mb-2">Выберите время:</p>
            <div className="slots-grid">
              {timeSlots.map((slot) => (
                <div key={slot.hour} className={`slot ${slot.isBooked ? 'booked' : ''} ${slot.isSelected ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); selectTimeSlot({ roomId: room.id, hour: slot.hour }); }}>{slot.hour}</div>
              ))}
            </div>
            <div className="slots-labels"><span>09:00</span><span>19:00</span></div>
          </div>
        )}
      </div>
    </div>
  );
};