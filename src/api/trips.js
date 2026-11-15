import axios from 'axios';
import { getAdminToken } from '../utils/token-storage';

const BASE_URL = 'https://sairna.abdulrahman-hares.com/api/v1/dashboard';

export const getTrips = async () => {
  const token = getAdminToken();
  const response = await axios.get(`${BASE_URL}/trips`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTrip = async (tripData) => {
  const token = getAdminToken();
  const response = await axios.post(`${BASE_URL}/trips`, tripData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTrip = async ({ id, data }) => {
  const token = getAdminToken();
  const response = await axios.patch(`${BASE_URL}/trips/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTrip = async (id) => {
  const token = getAdminToken();
  const response = await axios.delete(`${BASE_URL}/trips/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};