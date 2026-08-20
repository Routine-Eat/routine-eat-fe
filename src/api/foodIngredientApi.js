import { APIService } from '@/api/api';

/* /api/v1/food-ingredients 식재료 조회 API */
export const getFoodIngredients = (search, extra = {}) => {
  const params = { ...extra };
  if (search) params.search = search;
  return APIService.public.get('/food-ingredients', { params });
};

/* /api/v1/food-ingredients/exception 제외 대표 식재료 조회 API */
export const getExceptionFoodIngredients = () =>
  APIService.public.get('/food-ingredients/exception');

/* /api/v1/food-ingredients/init 식재료 세팅 API */
export const postInitFoodIngredients = () => APIService.public.post('/food-ingredients/init');
