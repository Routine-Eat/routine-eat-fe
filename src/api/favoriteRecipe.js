import { APIService } from '@/api/api';

/* /api/v1/recipes/{recipeId}/favorites 레시피 찜 등록 */
export const postFavoriteRecipe = (recipeId, userNumber) =>
  APIService.public.post(
    `/recipes/${recipeId}/favorites`,
    {},
    { params: { userNumber: Number(userNumber) } }
  );

/* /api/v1/recipes/favorites 찜한 레시피 조회 */
export const getFavoriteRecipes = ({ userNumber, cursor = 1, size = 10 }) =>
  APIService.public.get(`/recipes/favorites`, { params: { userNumber, cursor, size } });

/* /api/v1/recipes/{recipeId}/favorites 레시피 찜 해제 */
export const deleteFavoriteRecipe = (recipeId, userNumber) =>
  APIService.public.delete(`/recipes/${recipeId}/favorites`, {
    params: { userNumber: Number(userNumber) },
  });
