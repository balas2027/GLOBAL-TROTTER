import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trips';

const authHeader = () => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
};

export const createTrip = async (tripData) => {
  const response = await axios.post(API_URL + '/', tripData, { headers: authHeader() });
  return response.data;
};

export const getUserTrips = async () => {
  const response = await axios.get(API_URL + '/', { headers: authHeader() });
  return response.data;
};

export const getTrip = async (id) => {
  const response = await axios.get(API_URL + `/${id}`, { headers: authHeader() });
  return response.data;
};

export const updateTrip = async (id, tripData) => {
  const response = await axios.put(API_URL + `/${id}`, tripData, { headers: authHeader() });
  return response.data;
};

export const deleteTrip = async (id) => {
  const response = await axios.delete(API_URL + `/${id}`, { headers: authHeader() });
  return response.data;
};

export const getDestinations = async () => {
  const response = await axios.get(API_URL + '/destinations', { headers: authHeader() });
  return response.data;
};

export const getPublicTrips = async () => {
  const response = await axios.get(API_URL + '/public');
  return response.data;
};

export const duplicateTrip = async (id) => {
  const response = await axios.post(API_URL + `/${id}/copy`, {}, { headers: authHeader() });
  return response.data;
};
