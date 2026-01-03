import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authHeader = () => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      logout();
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/me`, userData, { headers: authHeader() });
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  } catch (error) {
     if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      logout();
      window.location.href = '/login';
    }
    throw error;
  }
};
