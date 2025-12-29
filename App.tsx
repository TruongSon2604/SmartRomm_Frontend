import React, { useState, useEffect } from 'react';
import { LayoutGrid, CalendarDays, BarChart3, Search, Sparkles, MessageSquarePlus, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { MOCK_ROOMS, MOCK_BOOKINGS } from './constants';
import { Room, Booking, ViewState } from './types';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import StatsView from './components/StatsView';
import CalendarView from './components/CalendarView';
import AiAssistant from './components/AiAssistant';
import Login from './components/Login';
import { getRooms } from './services/roomService';

// Simple Toast Notification Component
const Toast = ({ message, type }: { message: string, type: 'success' | 'error' }) => (
  <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-2xl text-white transform transition-all animate-fade-in flex items-center gap-3 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
    <span className="font-medium">{message}</span>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [view, setView] = useState<ViewState>('rooms');

  // State for Booking
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // State for UI/UX
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedRoomId, setHighlightedRoomId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('rooms'); // Reset view on logout
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setEditingBooking(null); // Ensure we are in create mode
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    const room = rooms.find(r => r.id === booking.roomId);
    if (room) {
      setSelectedRoom(room);
      setEditingBooking(booking);
      setIsBookingModalOpen(true);
    }
  };

  const handleBookingSubmit = (bookingData: any) => {
    const startDateTime = new Date(`${bookingData.date}T${bookingData.startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + parseInt(bookingData.duration) * 60000);
    const now = new Date();

    // 1. Validation: Future check (only if not editing or if changing time to past)
    if (startDateTime < now && !editingBooking) {
      showToast("Lỗi: Không thể đặt phòng trong quá khứ.", "error");
      return;
    }

    // 2. Validation: Collision check (Overlapping bookings)
    // Exclude current booking if we are editing
    const hasConflict = bookings.some(b => {
      if (b.roomId !== bookingData.roomId) return false;
      if (editingBooking && b.id === editingBooking.id) return false; // Ignore self when editing

      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);

      // Check overlapping logic: (StartA < EndB) and (EndA > StartB)
      return startDateTime < bEnd && endDateTime > bStart;
    });

    if (hasConflict) {
      showToast(`Lỗi: Phòng "${bookingData.roomName}" đã bận trong khung giờ này.`, "error");
      return;
    }

    if (editingBooking) {
      // UPDATE existing booking
      setBookings(prev => prev.map(b =>
        b.id === editingBooking.id
          ? {
            ...b,
            title: bookingData.title,
            organizer: bookingData.organizer,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            attendees: parseInt(bookingData.attendees)
          }
          : b
      ));
      showToast("Cập nhật lịch đặt thành công!", "success");
    } else {
      // CREATE new booking
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        roomId: bookingData.roomId,
        title: bookingData.title,
        organizer: bookingData.organizer,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendees: parseInt(bookingData.attendees)
      };
      setBookings(prev => [...prev, newBooking]);
      showToast(`Đặt phòng "${bookingData.roomName}" thành công!`, "success");
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch đặt phòng này không?")) {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      showToast("Đã hủy lịch đặt phòng.", "success");
      setIsBookingModalOpen(false); // Close modal if open
    }
  };

  const handleAiSuggestion = (roomId: string) => {
    setHighlightedRoomId(roomId);
    setView('rooms');

    // Scroll to the room card
    setTimeout(() => {
      const element = document.getElementById(`room-${roomId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight effect class
        element.classList.add('ring-4', 'ring-yellow-400');
        setTimeout(() => element.classList.remove('ring-4', 'ring-yellow-400'), 2000);
      }
    }, 100);
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Sidebar / Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white border-r border-gray-200 z-30 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 hidden md:block">SmartRoom</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 flex flex-col">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <BarChart3 size={20} />
            <span className="hidden md:block">Tổng quan</span>
          </button>

          <button
            onClick={() => setView('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'rooms' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <LayoutGrid size={20} />
            <span className="hidden md:block">Danh sách phòng</span>
          </button>

          <button
            onClick={() => setView('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'calendar' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <CalendarDays size={20} />
            <span className="hidden md:block">Lịch biểu</span>
          </button>

          <div className="flex-1"></div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-red-50 hover:text-red-600 mb-2`}
          >
            <LogOut size={20} />
            <span className="hidden md:block">Đăng xuất</span>
          </button>
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => setIsAiOpen(true)}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>
            <Sparkles className="mb-3 text-yellow-300 animate-pulse" />
            <h4 className="font-bold text-sm mb-1 relative z-10">Cần trợ giúp?</h4>
            <p className="text-xs text-brand-100 relative z-10 mb-3">Để AI tìm phòng cho bạn ngay.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors backdrop-blur-sm">Chat ngay</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 pb-24">

        {/* Top bar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {view === 'dashboard' && 'Tổng quan hệ thống'}
              {view === 'rooms' && 'Đặt phòng họp'}
              {view === 'calendar' && 'Lịch trình'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Hôm nay, {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          <div className="flex items-center gap-3">
            {view === 'rooms' && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm phòng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none w-64 text-sm transition-all shadow-sm"
                />
              </div>
            )}

            {/* Mobile Logout */}
            <button onClick={handleLogout} className="md:hidden p-3 text-gray-500 bg-white border border-gray-200 rounded-full shadow-sm hover:text-red-600 hover:bg-red-50">
              <LogOut size={20} />
            </button>

            <button
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="md:hidden p-3 bg-brand-600 text-white rounded-full shadow-lg"
            >
              <MessageSquarePlus size={24} />
            </button>
          </div>
        </header>

        {/* Views */}
        <div key={view} className="animate-slide-up">
          {view === 'dashboard' && (
            <div className="animate-fade-in">
              <StatsView rooms={rooms} bookings={bookings} />
            </div>
          )}

          {view === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {filteredRooms.map(room => (
                <div id={`room-${room.id}`} key={room.id} className="transition-all duration-500">
                  <RoomCard
                    room={room}
                    onBook={handleBookRoom}
                    isRecommended={highlightedRoomId === room.id}
                  />
                </div>
              ))}
              {filteredRooms.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  Không tìm thấy phòng phù hợp.
                </div>
              )}
            </div>
          )}

          {view === 'calendar' && (
            console.log('bookings in calendar view:', bookings),
            <CalendarView
              rooms={rooms}
              bookings={bookings}
              onDeleteBooking={handleDeleteBooking}
              onEditBooking={handleEditBooking}
            />
          )}
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={selectedRoom}
        initialBooking={editingBooking}
        onSubmit={handleBookingSubmit}
        onDelete={handleDeleteBooking}
      />

      {/* AI Assistant */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        rooms={rooms}
        bookings={bookings}
        onSuggestionClick={handleAiSuggestion}
      />

    </div>
  );
}

export default App;