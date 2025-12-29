import { Room, Booking } from './types';

export const MOCK_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Phòng Galaxy',
    capacity: 20,
    equipments: ['Projector', 'Whiteboard', 'Video Conf'],
    floor: 2,
    image: 'https://picsum.photos/400/300?random=1',
    status: 'available'
  },
  {
    id: 'r2',
    name: 'Phòng Nebula',
    capacity: 8,
    equipments: ['TV', 'Whiteboard'],
    floor: 2,
    image: 'https://picsum.photos/400/300?random=2',
    status: 'busy'
  },
  {
    id: 'r3',
    name: 'Phòng Star',
    capacity: 4,
    equipments: ['Whiteboard'],
    floor: 3,
    image: 'https://picsum.photos/400/300?random=3',
    status: 'available'
  },
  {
    id: 'r4',
    name: 'Phòng Cosmos',
    capacity: 50,
    equipments: ['Projector', 'Sound System', 'Stage', 'Video Conf'],
    floor: 1,
    image: 'https://picsum.photos/400/300?random=4',
    status: 'maintenance'
  },
  {
    id: 'r5',
    name: 'Phòng Orbit',
    capacity: 12,
    equipments: ['TV', 'Video Conf'],
    floor: 3,
    image: 'https://picsum.photos/400/300?random=5',
    status: 'available'
  }
];

// Helper to create dates relative to today
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const setTime = (date: Date, hours: number) => {
  const d = new Date(date);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    roomId: 1,
    title: 'Họp Daily Team Tech',
    organizer: 'Nguyễn Văn A',
    startTime: setTime(today, 9),
    endTime: setTime(today, 10),
    attendees: 6
  },
  {
    id: 2,
    roomId: 2,
    title: 'Review Sản phẩm Q3',
    organizer: 'Trần Thị B',
    startTime: setTime(today, 14),
    endTime: setTime(today, 16),
    attendees: 15
  },
  {
    id: 3,
    roomId: 3,
    title: 'Phỏng vấn ứng viên',
    organizer: 'Lê Văn C',
    startTime: setTime(tomorrow, 10),
    endTime: setTime(tomorrow, 11),
    attendees: 3
  }

];