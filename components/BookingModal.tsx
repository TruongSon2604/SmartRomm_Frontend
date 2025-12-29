import React, { useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import { X, Calendar, Clock, User, AlignLeft, Save, Trash2 } from 'lucide-react';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
  onDelete?: (id: string) => void; // New prop
  initialBooking?: Booking | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, isOpen, onClose, onSubmit, onDelete, initialBooking }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: '60',
    organizer: '',
    attendees: 1
  });

  // Reset or pre-fill form when modal opens or initialBooking changes
  useEffect(() => {
    if (isOpen) {
      if (initialBooking) {
        // Edit mode: Parse existing booking data
        const start = new Date(initialBooking.startTime);
        const end = new Date(initialBooking.endTime);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
        
        // Format time to HH:mm for input[type="time"]
        const timeString = start.toTimeString().substring(0, 5);
        const dateString = start.getFullYear() + '-' + 
                          String(start.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(start.getDate()).padStart(2, '0');

        setFormData({
          title: initialBooking.title,
          date: dateString,
          startTime: timeString,
          duration: durationMinutes.toString(),
          organizer: initialBooking.organizer,
          attendees: initialBooking.attendees
        });
      } else {
        // Create mode: Reset defaults
        setFormData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          duration: '60',
          organizer: '',
          attendees: 1
        });
      }
    }
  }, [isOpen, initialBooking]);

  if (!isOpen || !room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      roomId: room.id,
      roomName: room.name,
      id: initialBooking?.id // Pass ID if editing
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && initialBooking) {
      onDelete(initialBooking.id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isEditMode = !!initialBooking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-brand-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">
              {isEditMode ? 'Cập nhật lịch đặt' : `Đặt ${room.name}`}
            </h2>
            <p className="text-brand-100 text-sm mt-1">
              {isEditMode ? `Đang sửa thông tin cho ${room.name}` : `Sức chứa tối đa: ${room.capacity} người`}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề cuộc họp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <AlignLeft size={18} />
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="Ví dụ: Họp Weekly Team..."
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu lúc</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Clock size={18} />
                  </div>
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="30">30 Phút</option>
                <option value="45">45 Phút</option>
                <option value="60">1 Giờ</option>
                <option value="90">1.5 Giờ</option>
                <option value="120">2 Giờ</option>
                <option value="180">3 Giờ</option>
                <option value="240">4 Giờ</option>
              </select>
            </div>

            {/* Organizer & Attendees */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người đặt</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="organizer"
                    required
                    value={formData.organizer}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Tên của bạn"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số người</label>
                <input
                  type="number"
                  name="attendees"
                  min="1"
                  max={room.capacity}
                  required
                  value={formData.attendees}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div>
            {isEditMode && onDelete && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Xóa lịch</span>
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              form="booking-form"
              className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2"
            >
              {isEditMode ? <Save size={18} /> : <Calendar size={18} />}
              {isEditMode ? 'Lưu thay đổi' : 'Xác nhận đặt'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;