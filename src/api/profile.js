import axios from 'axios';
import { getAdminToken } from '../utils/token-storage';

const BASE_URL = 'https://sairna.abdulrahman-hares.com/api/v1/dashboard';

export const getMyProfile = async () => {
  const token = getAdminToken();
  const response = await axios.get(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};