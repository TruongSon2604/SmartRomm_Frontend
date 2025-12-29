export interface Equipment {
  id: number;
  name: string;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  equipments: Equipment[];
  image: string;
  status: 'available' | 'busy' | 'maintenance';
  location: string;
  description: string;
}

export interface Booking {
  id: number;
  room_id: number;
  title: string;
  organizer: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  attendees: number;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  suggestedRoomId?: string; // If the AI suggests a specific room
}

export type ViewState = 'dashboard' | 'calendar' | 'rooms';