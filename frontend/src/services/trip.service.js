import api from './api';

const BASE_URL = '/trips';

export const createTrip = async (tripData) => {
  const response = await api.post(BASE_URL + '/', tripData);
  return response.data;
};

export const getUserTrips = async () => {
  const response = await api.get(BASE_URL + '/');
  return response.data;
};

export const getTrip = async (id) => {
  const response = await api.get(BASE_URL + `/${id}`);
  return response.data;
};

export const updateTrip = async (id, tripData) => {
  const response = await api.put(BASE_URL + `/${id}`, tripData);
  return response.data;
};

export const deleteTrip = async (id) => {
  const response = await api.delete(BASE_URL + `/${id}`);
  return response.data;
};

export const getDestinations = async () => {
  const response = await api.get(BASE_URL + '/destinations');
  return response.data;
};

export const getPublicTrips = async () => {
  const response = await api.get(BASE_URL + '/public');
  return response.data;
};

export const duplicateTrip = async (id) => {
  const response = await api.post(BASE_URL + `/${id}/copy`, {});
  return response.data;
};

