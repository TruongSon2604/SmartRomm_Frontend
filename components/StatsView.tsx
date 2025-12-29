import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Room, Booking } from '../types';
import { CalendarCheck, Users, Clock, Building } from 'lucide-react';

interface StatsViewProps {
  rooms: Room[];
  bookings: Booking[];
}

const StatsView: React.FC<StatsViewProps> = ({ rooms, bookings }) => {
  
  // Calculate stats
  const totalRooms = rooms.length;
  const activeBookings = bookings.length;
  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const busyRooms = rooms.filter(r => r.status === 'busy').length;
  const occupancyRate = Math.round((busyRooms / totalRooms) * 100);

  // Prepare chart data: Bookings per room
  const data = rooms.map(room => ({
    name: room.name.replace('Phòng ', ''),
    bookings: bookings.filter(b => b.roomId === room.id).length
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Building size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng số phòng</p>
            <h4 className="text-2xl font-bold text-gray-900">{totalRooms}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cuộc họp hôm nay</p>
            <h4 className="text-2xl font-bold text-gray-900">{activeBookings}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng sức chứa</p>
            <h4 className="text-2xl font-bold text-gray-900">{totalCapacity}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tỷ lệ lấp đầy</p>
            <h4 className="text-2xl font-bold text-gray-900">{occupancyRate}%</h4>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tần suất đặt phòng</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="bookings" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {bookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                   {new Date(booking.startTime).getHours()}h
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 truncate w-40">{booking.title}</h5>
                  <p className="text-xs text-gray-500">{booking.organizer}</p>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">Chưa có hoạt động nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;