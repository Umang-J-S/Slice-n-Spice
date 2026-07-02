import { fetcher } from './apiClient';

export const menuApi = {
  getFullMenu: () => fetcher('/api/v1/menu/full'),
  getSpecials: () => fetcher('/api/v1/menu/specials'),
  getTopRated: () => fetcher('/api/v1/menu/top-rated'),
  getChefs: () => fetcher('/api/v1/chefs'),
  
  // Reviews
  getItemReviews: (itemId: string) => fetcher(`/api/v1/menu/items/${itemId}/reviews`),
  getMyReview: (itemId: string) => fetcher(`/api/v1/menu/items/${itemId}/reviews/me`),
  submitReview: (itemId: string, data: { rating: number; reviewText?: string }) => 
    fetcher(`/api/v1/menu/items/${itemId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
