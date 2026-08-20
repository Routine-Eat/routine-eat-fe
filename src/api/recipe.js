import { APIService } from '@/api/api';

// AI 레시피 단일 추천
export const getAiRecommendedRecipe = (userId) =>
  APIService.public.get(`/recipes/ai-recommend/${userId}`);

 // AI 레시피 재추천 (조건부)
 export const postAiRecipeRecommendAgain = (userId, options = {}) => {
   const { difficultyLevel, timeFilter, desiredIngredientIds, previousRecipeId } = options;
   const body = {};
   if (difficultyLevel) body.difficultyLevel = difficultyLevel;
   if (timeFilter) body.timeFilter = timeFilter;
   if (desiredIngredientIds?.length) body.desiredIngredientIds = desiredIngredientIds;
   if (previousRecipeId) body.previousRecipeId = previousRecipeId;
   return APIService.public.post(`/recipes/ai-recommend/again/${userId}`, body);
 };

// 전체 레시피 목록 조회 (보유 재료/필터 기준, 유형별 그룹 조회)
export const getRecipes = ({ userNumber, cursor = 1, size = 10, timeRequired, difficultyLevel, category, sortType = "DEFAULT" }) => {
  const params = { userNumber, cursor, size, sortType };
  if (timeRequired) params.timeRequired = timeRequired;
  if (difficultyLevel) params.difficultyLevel = difficultyLevel;
  if (category) params.category = category;
  return APIService.public.get(`/recipes`, { params });
};

// 레시피 상세 조회
export const getRecipeDetail = (recipeId, { userNumber, servings = 1 }) =>
  APIService.public.get(`/recipes/${recipeId}`, { params: { userNumber, servings } });

// 요리 가능 여부 조회 (진행/완료된 동일 레시피 세션 있으면 false)
export const getCanCookRecipe = (recipeId, { userNumber, servings = 1 }) =>
  APIService.public.get(`/recipes/${recipeId}/can-cook`, { params: { userNumber, servings } });

// 검색어 기반 레시피 검색
export const searchRecipes = ({ userNumber, searchWord, cursor = 1, size = 10, timeRequired, difficultyLevel, category, sortType = "DEFAULT" }) => {
  const params = { userNumber, searchWord, cursor, size, sortType };
  if (timeRequired) params.timeRequired = timeRequired;
  if (difficultyLevel) params.difficultyLevel = difficultyLevel;
  if (category) params.category = category;
  return APIService.public.get(`/recipes/search`, { params });
};

// 최근 검색 기록 조회 (최신순 최대 5개)
export const getRecipeSearchHistory = (userNumber) =>
  APIService.public.get(`/recipes/searchHistory`, { params: { userNumber } });

// 최근 검색 기록 전체 삭제
export const deleteRecipeSearchHistory = (userNumber) =>
  APIService.public.delete(`/recipes/searchHistory`, { params: { userNumber } });