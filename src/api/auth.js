import axios from 'axios';


const BASE_URL = 'https://sairna.abdulrahman-hares.com/api/v1/dashboard';

export const loginAdmin = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
  return response.data;
};