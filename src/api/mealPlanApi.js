import { APIService } from '@/api/api';

/* /api/v1/meal-plans/{mealPlanId}/users/{userId} 사용자-식단 삭제 API */
export const deleteUserMealPlan = (mealPlanId, userId) =>
  APIService.public.delete(`/meal-plans/${mealPlanId}/users/${userId}`);

/* /api/v1/meal-plans/{userId} 사용자-식단 조회 API */
export const getUserMealPlans = (userId, status) =>
  APIService.public.get(`/meal-plans/${userId}`, {
    params: {
      status,
    },
  });

/* /api/v1/meal-plans/{userId}/{mealPlanId} 사용자-식단 상세 조회 API */
export const getUserMealPlanDetail = (userId, mealPlanId) =>
  APIService.public.get(`/meal-plans/${userId}/${mealPlanId}`);

/* /api/v1/meal-plans/{userId}/ai-recommendation AI 목적별 식단 4종 추천 API */
export const getAiMealPlanRecommendation = (userId) =>
  APIService.public.get(`/meal-plans/${userId}/ai-recommendation`);

/* /api/v1/meal-plans/{mealPlanId}/users/{userId} 사용자-식단 상태 수정 API */
export const patchUserMealPlanStatus = (mealPlanId, userId, status) =>
  APIService.public.patch(`/meal-plans/${mealPlanId}/users/${userId}`, status);

/* /api/v1/meal-plans/userId/{userId}/plan-menus/{planMenuId} 식단 메뉴 완료 여부 수정 API */
export const patchPlanMenuCompleted = (userId, planMenuId, completed) =>
  APIService.public.patch(`/meal-plans/userId/${userId}/plan-menus/${planMenuId}`, completed);

/* /api/v1/meal-plans/{userId} 사용자-식단 저장 API */
export const postUserMealPlan = (userId, mealPlanData) =>
  APIService.public.post(`/meal-plans/${userId}`, mealPlanData);
