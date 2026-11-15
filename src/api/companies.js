import axios from 'axios';
import { getAdminToken } from '../utils/token-storage';

const BASE_URL = 'https://sairna.abdulrahman-hares.com/api/v1/dashboard';


export const getCompanies = async () => {
  const token = getAdminToken();
  const response = await axios.get(`${BASE_URL}/companies`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const createCompany = async (companyData) => {
  const token = getAdminToken();
  const response = await axios.post(`${BASE_URL}/companies`, companyData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const updateCompany = async ({ id, data }) => {
  const token = getAdminToken();
  const response = await axios.patch(`${BASE_URL}/companies/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCompany = async (id) => {
  const token = getAdminToken();
  const response = await axios.delete(`${BASE_URL}/companies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};