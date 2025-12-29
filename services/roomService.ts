import axios from 'axios';
import { Room } from '../types';

const API_URL = 'http://localhost:8000/api';

export const getRooms = async (): Promise<Room[]> => {
    const res = await axios.get(`${API_URL}/rooms`, {
        headers: {
            Accept: 'application/json'
        }
    });
    console.log('Fetched rooms:', res.data);
    return res.data;
};
