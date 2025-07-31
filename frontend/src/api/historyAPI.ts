// src/api/historyAPI.ts

import apiClient from '../services/apiClient';
import axios from 'axios';

//  Add new search history entry
//  Updated version to accept full object
export const addToSearchHistoryAPI = async (
  userId: string,
  search: {
    query: string;
    productType: string;
    maxPrice?: number;
    features?: string[];
    resultsCount: number;
  }
) => {
    
  const res = await apiClient.post(`/history/add`, {
    userId,
    ...search, // spread the search object
  });
  return res.data;
};


//  Get search history for a user
export const getSearchHistoryAPI = async (userId: string) => {
  const res = await axios.get(`/api/history/${userId}`);
  return res.data;
};

//  Toggle wishlist item
export const toggleWishlistHistoryItem = async (
  userId: string,
  itemId: string,
  isInWishlist: boolean
): Promise<{ _id: string; isInWishlist: boolean }> => {
  const res = await axios.patch(`/api/history/${userId}/${itemId}`, {
    isInWishlist,
  });
  return res.data;
};

//  Delete single history item
export const deleteSearchHistoryItem = async (userId: string, itemId: string) => {
  await apiClient.delete(`/history/${userId}/delete/${itemId}`);
};

// Clear all history for user
export const clearSearchHistory = async (userId: string) => {
  await apiClient.delete(`/history/clear/${userId}`);
};

// src/api/historyAPI.ts
export const updateSearchHistoryItem = (userId: string, itemId: string, isMarked: boolean) =>
  apiClient.post('/history/update', { userId, itemId, isMarked }); 

