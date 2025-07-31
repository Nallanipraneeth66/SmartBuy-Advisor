import apiClient from '../services/apiClient';

export const getRecommendations = async (params: {
  productType: string;
  maxPrice?: number;
  features?: string[];            // array is ideal
}) => {
  const response = await apiClient.post('/api/recommend/recommend', params);
  return response.data;
};
