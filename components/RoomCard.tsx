import React from 'react';
import { Room } from '../types';
import { Users, Monitor, Wifi, Maximize } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  isRecommended?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, isRecommended }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Đang trống';
      case 'busy': return 'Đang bận';
      case 'maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  const renderIcon = (name: string) => {
    if (name.includes('Wifi')) return <Wifi size={10} />;
    if (name.includes('Projector')) return <Monitor size={10} />;
    return <Monitor size={10} />;
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${isRecommended ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
          <span className="animate-pulse">✨</span> Gợi ý AI
        </div>
      )}

      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
            {getStatusText(room.status)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
          Khu vực {room.location}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{room.name}</h3>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5" title="Sức chứa">
            <Users size={16} />
            <span>{room.capacity} người</span>
          </div>
          <div className="flex items-center gap-1.5" title="Diện tích">
            <Maximize size={16} />
            <span>{room.capacity * 2}m²</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">

          <div className="flex flex-wrap gap-2 mb-5">
            {room.equipments.map((eq) => (
              <span
                key={eq.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100"
              >
                {eq.name.includes('Wifi') ? <Wifi size={10} /> : <Monitor size={10} />}
                {eq.name}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBook(room)}
          disabled={room.status === 'maintenance'}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2
            ${room.status === 'maintenance'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800'}`}
        >
          {room.status === 'maintenance' ? 'Tạm ngưng phục vụ' : 'Đặt phòng này'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;