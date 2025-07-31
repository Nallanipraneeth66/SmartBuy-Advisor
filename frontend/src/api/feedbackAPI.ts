// src/api/feedbackAPI.ts
import apiClient from '../services/apiClient';

export const submitFeedback = async (userId: string, message: string) => {
  return await apiClient.post('/feedback', { userId, message });
};

export const fetchAllFeedback = async () => {
  return await apiClient.get('/feedback');
};
