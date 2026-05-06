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

  // console.log('Fetched booking:', res.data);
  return res.data;
};

export const bookingRoom = async (formData: any): Promise<Booking> => {
  const token = localStorage.getItem('bookingToken');

  const res = await axios.post(`${API_URL}/bookings`, formData, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateBooking = async (id: number, formData: any): Promise<Booking> => {
  const token = localStorage.getItem('bookingToken');

  const res = await axios.post(`${API_URL}/bookings/${id}`, formData, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const deleteBooking = async (id: number) => {
  const token = localStorage.getItem('bookingToken');

  await axios.delete(`${API_URL}/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};