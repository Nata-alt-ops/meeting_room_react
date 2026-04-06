import { createEvent, createStore, sample, combine, createEffect } from 'effector';
import { User, Room, Booking, TimeRange, Theme, BookingFormData, LoginForm } from '../types';
import { authApi, roomsApi, bookingsApi } from '../api/client';

const MOCK_ROOMS: Room[] = [
  { id: 1, name: 'Переговорная «Альфа»', roomNumber: '305-А', capacity: 6, equipment: ['Проектор', 'WiFi', 'Whiteboard'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', isActive: true },
  { id: 2, name: 'Зал «Бета»', roomNumber: '410-Б', capacity: 12, equipment: ['Проектор', 'Видеоконференция', 'WiFi'], image: 'https://images.unsplash.com/photo-1517502884422-41e157d4430c?w=400', isActive: true },
  { id: 3, name: 'Кабинет «Гамма»', roomNumber: '201-В', capacity: 4, equipment: ['TV', 'WiFi'], image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400', isActive: true },
  { id: 4, name: 'Переговорная «Дельта»', roomNumber: '515-Г', capacity: 8, equipment: ['Проектор', 'WiFi', 'Видеоконференция'], image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=400', isActive: true },
];

export const login = createEvent<LoginForm>();
export const logout = createEvent<void>();
export const fetchRooms = createEvent<void>();
export const fetchBookings = createEvent<void>();
export const selectRoom = createEvent<number | null>();
export const selectDate = createEvent<string>();
export const selectTimeSlot = createEvent<{ roomId: number; hour: number }>();
export const createBooking = createEvent<BookingFormData>();
export const updateBooking = createEvent<{ id: number; data: Partial<BookingFormData> & { roomId?: number } }>();
export const deleteBooking = createEvent<number>();
export const clearSelection = createEvent<void>();
export const setEditingBooking = createEvent<Booking | null>();
export const setShowModal = createEvent<boolean>();
export const setSelectedBooking = createEvent<Booking | null>();
export const setShowDetailsModal = createEvent<boolean>();
export const setTheme = createEvent<Theme>();
export const setNotification = createEvent<{ type: 'success' | 'error' | 'warning'; message: string } | null>();

export const $user = createStore<User | null>(null);
export const $isAuthenticated = createStore<boolean>(false);
export const $rooms = createStore<Room[]>([]);
export const $bookings = createStore<Booking[]>([]);
export const $selectedRoomId = createStore<number | null>(null);

const today = new Date().toISOString().split('T')[0] as string;
export const $selectedDate = createStore<string>(today);
export const $selectedTimeRange = createStore<TimeRange>({ start: null, end: null });
export const $editingBooking = createStore<Booking | null>(null);
export const $showModal = createStore<boolean>(false);
export const $selectedBooking = createStore<Booking | null>(null);
export const $showDetailsModal = createStore<boolean>(false);
export const $theme = createStore<Theme>('blue');
export const $notification = createStore<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

const WORK_HOURS = Array.from({ length: 10 }, (_, i) => i + 9);

export const $timeSlots = combine($rooms, $bookings, $selectedRoomId, $selectedDate, $selectedTimeRange, (rooms, bookings, selectedRoomId, selectedDate, selectedTimeRange) => {
  if (!selectedRoomId) return [];
  const roomBookings = bookings.filter((b: Booking) => b.roomId === selectedRoomId && b.date === selectedDate && b.status === 'confirmed');
  return WORK_HOURS.map((hour) => {
    const booking = roomBookings.find((b: Booking) => hour >= b.startTime && hour < b.endTime);
    const isSelected = selectedTimeRange.start !== null && selectedTimeRange.end !== null && hour >= selectedTimeRange.start && hour < selectedTimeRange.end;
    return { hour, isBooked: !!booking, isSelected, booking };
  });
});

export const $selectedRoom = combine($rooms, $selectedRoomId, (rooms, id) => rooms.find((r) => r.id === id) || null);
export const $myBookings = combine($user, $bookings, (user, bookings) => user ? bookings.filter((b: Booking) => b.userId === user.id && b.status === 'confirmed') : []);
export const $isSelectionValid = combine($selectedTimeRange, (range) => range.start !== null && range.end !== null && range.end - range.start >= 1);

const loginFx = createEffect<LoginForm, User, Error>(async ({ username, password }) => {
  const response = await authApi.login(username, password);
  localStorage.setItem('token', response.data.access_token);
  const userResponse = await authApi.me();
  return userResponse.data;
});

const fetchRoomsFx = createEffect<void, Room[], Error>(async () => {
  try { const r = await roomsApi.getAll(); return r.data; } catch { return MOCK_ROOMS; }
});

const fetchBookingsFx = createEffect<void, Booking[], Error>(async () => {
  try { const r = await bookingsApi.getAll(); return r.data; } catch { return []; }
});

const createBookingFx = createEffect<BookingFormData, Booking, Error>(async (data) => {
  const response = await bookingsApi.create({ ...data, date: new Date(data.date) });
  return response.data;
});

const updateBookingFx = createEffect<{ id: number; data: Partial<BookingFormData> & { roomId?: number } }, Booking, Error>(async ({ id, data }) => {
  const response = await bookingsApi.update(id, data);
  return response.data;
});

const deleteBookingFx = createEffect<number, number, Error>(async (id) => {
  await bookingsApi.delete(id);
  return id;
});

sample({ clock: login, target: loginFx });
sample({ clock: loginFx.doneData, target: $user });
sample({ clock: $user, fn: (user) => !!user, target: $isAuthenticated });
sample({ clock: logout, fn: () => { localStorage.removeItem('token'); return null; }, target: $user });

sample({ clock: fetchRooms, target: fetchRoomsFx });
sample({ clock: fetchRoomsFx.doneData, target: $rooms });
sample({ clock: fetchBookings, target: fetchBookingsFx });
sample({ clock: fetchBookingsFx.doneData, target: $bookings });

sample({ clock: selectRoom, fn: () => ({ start: null, end: null }), target: $selectedTimeRange });

sample({
  clock: selectTimeSlot,
  source: { selectedRoomId: $selectedRoomId, timeSlots: $timeSlots, currentRange: $selectedTimeRange },
  fn: ({ selectedRoomId, timeSlots, currentRange }, { roomId, hour }) => {
    if (selectedRoomId !== roomId) return { start: hour, end: hour + 1 };
    const slot = timeSlots.find((s) => s.hour === hour);
    if (slot?.isBooked) return currentRange;
    const { start, end } = currentRange;
    if (start === null) return { start: hour, end: hour + 1 };
    if (end === null) { if (hour < start) return { start: hour, end: start }; return { start, end: hour + 1 }; }
    if (hour < start) return { start: hour, end };
    if (hour >= end) return { start, end: hour + 1 };
    return { start: hour, end: hour + 1 };
  },
  target: $selectedTimeRange,
});

sample({ clock: createBooking, target: createBookingFx });
sample({ clock: createBookingFx.doneData, source: { bookings: $bookings }, fn: ({ bookings }, newBooking) => [...bookings, newBooking], target: $bookings });
sample({ clock: createBookingFx.doneData, fn: () => ({ type: 'success' as const, message: 'Бронирование создано!' }), target: setNotification });
sample({ clock: createBookingFx.failData, fn: (error: any) => ({ type: 'error' as const, message: error.response?.data?.detail || 'Ошибка создания' }), target: setNotification });

sample({ clock: updateBooking, target: updateBookingFx });
sample({ clock: updateBookingFx.doneData, source: { bookings: $bookings }, fn: ({ bookings }: { bookings: Booking[] }, updated: Booking) => bookings.map((b: Booking) => (b.id === updated.id ? updated : b)), target: $bookings });

sample({ clock: deleteBooking, target: deleteBookingFx });
sample({ clock: deleteBookingFx.doneData, source: { bookings: $bookings }, fn: ({ bookings }: { bookings: Booking[] }, id: number) => bookings.map((b: Booking) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)), target: $bookings });
sample({ clock: deleteBookingFx.doneData, fn: () => ({ type: 'success' as const, message: 'Бронирование отменено' }), target: setNotification });

sample({ clock: setNotification, fn: () => null, target: setNotification, delay: 3000 });
sample({ clock: setSelectedBooking, fn: () => true, target: $showDetailsModal });