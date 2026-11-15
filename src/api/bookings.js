import axios from 'axios';
import { getAdminToken } from '../utils/token-storage';

const BASE_URL = 'https://sairna.abdulrahman-hares.com/api/v1/dashboard';

export const getBookings = async () => {
  const token = getAdminToken();
  const response = await axios.get(`${BASE_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const cancelBooking = async (id) => {
  const token = getAdminToken();
  const response = await axios.post(`${BASE_URL}/bookings/${id}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};