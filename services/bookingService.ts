import axios from 'axios';
import { Booking } from '../types';

const API_URL = 'http://localhost:8000/api';

export const getBooking = async (): Promise<Booking[]> => {
  const token = localStorage.getItem('bookingToken');

  const res = await axios.get(`${API_URL}/bookings`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Fetched booking:', res.data);
  return res.data;
};

export const bookingRoom = async() : Promise<Booking> =>{
   const token = localStorage.getItem('bookingToken',);
   const res = await axios.post(`${API_URL}/bookings`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}