import React, { useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Trash2, Edit3, ChevronDown } from 'lucide-react';

interface CalendarViewProps {
  rooms: Room[];
  bookings: Booking[];
  onDeleteBooking: (id: string) => void;
  onEditBooking: (booking: Booking) => void;
}

const START_HOUR = 7; // 7:00 AM
const END_HOUR = 19;  // 7:00 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;

const CalendarView: React.FC<CalendarViewProps> = ({ rooms, bookings, onDeleteBooking, onEditBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTimePosition, setCurrentTimePosition] = useState<number | null>(null);

  // Update current time indicator position
  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      // Only show line if viewing today
      if (now.toDateString() === currentDate.toDateString()) {
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Check if current time is within view range
        if (hours < START_HOUR || hours >= END_HOUR) {
          setCurrentTimePosition(null);
          return;
        }

        const totalMinutes = (hours - START_HOUR) * 60 + minutes;
        const percentage = (totalMinutes / (TOTAL_HOURS * 60)) * 100;

        setCurrentTimePosition(percentage);
      } else {
        setCurrentTimePosition(null);
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currentDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setCurrentDate(new Date(e.target.value));
    }
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter bookings for the selected date
  const daysBookings = bookings.filter(b => {
    const bookingDate = new Date(b.startTime);
    return bookingDate.toDateString() === currentDate.toDateString();
  });

  const getBookingStyle = (booking: Booking) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    // Calculate start position relative to START_HOUR
    const startMinutes = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

    const left = (startMinutes / (TOTAL_HOURS * 60)) * 100;
    const width = (durationMinutes / (TOTAL_HOURS * 60)) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - Math.max(0, left), width)}%`
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      {/* Calendar Controls */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">

        {/* Date Picker Section */}
        <div className="flex items-center gap-3 relative group cursor-pointer hover:bg-white p-2 rounded-xl transition-all">
          <div className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-brand-600 group-hover:border-brand-300 group-hover:text-brand-700 transition-colors">
            <CalendarIcon size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Thời gian</div>
            <h2 className="font-bold text-gray-900 text-lg capitalize flex items-center gap-2">
              {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              <ChevronDown size={16} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
            </h2>
          </div>

          {/* Hidden Input Trigger */}
          <input
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            value={currentDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" title="Ngày trước">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleToday} className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors mx-1">
            Hôm nay
          </button>
          <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" title="Ngày sau">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <div className="min-w-[1000px] h-full flex flex-col">

          {/* Header Row (Hours) */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white z-40 shadow-sm">
            <div className="w-48 flex-shrink-0 p-4 border-r border-gray-200 bg-gray-50 font-semibold text-gray-500 text-sm flex items-center justify-center">
              Phòng họp
            </div>
            <div className="flex-1 relative h-12 bg-white">
              {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 text-xs text-gray-400 font-medium transform -translate-x-1/2 flex flex-col justify-center items-center"
                  style={{ left: `${(i / TOTAL_HOURS) * 100}%` }}
                >
                  <span className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-500 z-10">{START_HOUR + i}:00</span>
                  <div className="h-2 w-px bg-gray-200 mt-1"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Rows Container */}
          <div className="flex-1 relative">

            {/* 
                FIX APPLIED HERE:
                The Red Line (Current Time Indicator) is now wrapped in a container that 
                mimics the row layout (Sidebar spacer + Flex Content).
                This ensures 'left: %' is relative to the timeline track, NOT the entire screen width.
            */}
            <div className="absolute inset-0 flex pointer-events-none z-30">
              <div className="w-48 flex-shrink-0 border-r border-transparent"></div>
              <div className="flex-1 relative h-full">
                {currentTimePosition !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                    style={{ left: `${currentTimePosition}%` }}
                  >
                    <div className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm ring-2 ring-white"></div>
                    <div className="absolute -bottom-1 -translate-x-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm ring-2 ring-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid Background Lines */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-48 flex-shrink-0 bg-gray-50/30"></div>
              <div className="flex-1 relative border-l border-gray-100">
                {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-r border-gray-100 border-dashed"
                    style={{ left: `${((i + 1) / TOTAL_HOURS) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {rooms.map((room) => {
              const roomBookings = daysBookings.filter(b => b.roomId === room.id);

              return (
                <div key={room.id} className="flex border-b border-gray-100 min-h-[100px] hover:bg-gray-50/50 transition-colors group">
                  {/* Room Info */}
                  <div className="w-48 flex-shrink-0 p-4 border-r border-gray-200 flex flex-col justify-center bg-white group-hover:bg-gray-50 transition-colors sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <h4 className="font-bold text-gray-800 text-sm">{room.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      Tầng {room.floor} • {room.capacity} ch
                    </p>
                    <div className="mt-2 text-[10px] text-gray-400 bg-gray-100 inline-block px-2 py-0.5 rounded-full self-start">
                      ID: {room.id}
                    </div>
                  </div>

                  {/* Timeline Track */}
                  <div className="flex-1 relative p-2">
                    {roomBookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => onEditBooking(booking)}
                        className="absolute top-3 bottom-3 rounded-lg bg-brand-50 border border-brand-200 text-brand-900 p-2 text-xs overflow-hidden hover:shadow-lg hover:bg-brand-100 hover:scale-[1.01] hover:z-20 transition-all cursor-pointer shadow-sm group/booking"
                        style={getBookingStyle(booking)}
                        title={`${booking.title}\n${booking.organizer}\n(Bấm để sửa)`}
                      >
                        <div className="font-bold truncate pr-4 text-brand-700">{booking.title}</div>
                        <div className="text-brand-600 truncate text-[10px] mt-0.5 opacity-80 group-hover/booking:opacity-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block"></span>
                          {booking.organizer}
                        </div>

                        {/* Actions */}
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/booking:opacity-100 transition-all z-30 bg-white/80 backdrop-blur-sm rounded-md p-0.5 shadow-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditBooking(booking);
                            }}
                            className="p-1.5 rounded-md text-brand-600 hover:bg-white hover:text-brand-700 hover:shadow-sm transition-all"
                            title="Sửa"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteBooking(booking.id);
                            }}
                            className="p-1.5 rounded-md text-red-500 hover:bg-white hover:text-red-700 hover:shadow-sm transition-all"
                            title="Hủy lịch đặt"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {roomBookings.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        <span className="text-xs text-gray-400 font-medium dashed-border px-3 py-1 border border-gray-200 rounded-full border-dashed bg-white/50">Trống lịch</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;