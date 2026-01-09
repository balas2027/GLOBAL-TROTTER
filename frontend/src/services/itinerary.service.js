import axios from 'axios';

const API_URL = 'http://global-trotter.vercel.app/api/itineraries';

const authHeader = () => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
};

export const getItinerary = async (tripId) => {
    const response = await axios.get(`${API_URL}/${tripId}`, { headers: authHeader() });
    return response.data;
};

export const addSection = async (tripId, data) => {
    const response = await axios.post(`${API_URL}/${tripId}/sections`, data, { headers: authHeader() });
    return response.data;
};

export const addActivity = async (sectionId, data) => {
    const response = await axios.post(`${API_URL}/section/${sectionId}/activity`, data, { headers: authHeader() });
    return response.data;
};
