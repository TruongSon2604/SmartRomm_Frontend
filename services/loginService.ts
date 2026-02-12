import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const onLoginfunction = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    localStorage.setItem('bookingToken', res.data.access_token);
    localStorage.setItem('me', JSON.stringify(res.data.me));
    return true;
  } catch (error) {
    return false;
  }
};