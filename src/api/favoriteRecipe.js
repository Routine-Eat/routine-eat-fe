// 레시피 찜 등록
export const postFavoriteRecipe = (recipeId, userNumber) =>
  APIService.public.post(`/recipes/${recipeId}/favorites`, {}, { params: { userNumber: Number(userNumber) } });

// 찜한 레시피 조회
export const getFavoriteRecipes = ({ userNumber, cursor = 1, size = 10 }) =>
  APIService.public.get(`/recipes/favorites`, { params: { userNumber, cursor, size } });