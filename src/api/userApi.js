import { APIService } from '@/api/api';

/* /api/v1/users 사용자 생성 - 목진 */
export const postCreateUser = (loginNumber) => APIService.public.post('/users', { loginNumber });
/* /api/v1/users/{loginNumber} 사용자 단일 조회 - 목진 */
export const getUserByLoginNumber = (loginNumber) => APIService.public.get(`/users/${loginNumber}`);

/* /api/v1/users/{userId}/food-ingredients 사용자-식재료 관계 삭제 */
export const deleteUserFoodIngredients = (userId, foodIngredientData) =>
  APIService.public.delete(`/users/${userId}/food-ingredients`, {
    data: foodIngredientData,
  });

/* /api/v1/users/{userId}/cooking-equipments 사용자-조리도구 관계 삭제 */
export const deleteUserCookingEquipments = (userId, equipmentIdList) =>
  APIService.public.delete(`/users/${userId}/cooking-equipments`, {
    data: equipmentIdList,
  });

/* /api/v1/users 사용자 목록 조회 */
export const getUsers = () => APIService.public.get('/users');

/* /api/v1/users/{userId}/food-ingredients 사용자 식재료 목록 조회 */
export const getUserFoodIngredients = (userId, type) =>
  APIService.public.get(`/users/${userId}/food-ingredients`, {
    params: {
      type,
    },
  });

/* /api/v1/users/{userId}/cooking-equipments 사용자-조리도구 목록 조회 */
export const getUserCookingEquipments = (userId) =>
  APIService.public.get(`/users/${userId}/cooking-equipments`);

/* /api/v1/users/{userId} 사용자 데이터 수정 */
export const patchUser = (userId, userData) =>
  APIService.public.patch(`/users/${userId}`, userData);

/* /api/v1/users/{userId}/food-ingredients/amount 사용자-식재료 보유량 수정 */
export const patchUserFoodIngredientAmount = (userId, foodIngredientData) =>
  APIService.public.patch(`/users/${userId}/food-ingredients/amount`, foodIngredientData);

/* /api/v1/users/{userId}/onboarding 사용자 온보딩 데이터 저장 */
export const postUserOnboarding = (userId, onboardingData) =>
  APIService.public.post(`/users/${userId}/onboarding`, onboardingData);

/* /api/v1/users/{userId}/food-ingredients 사용자-식재료 관계 생성*/
export const postUserFoodIngredients = (userId, foodIngredientData) =>
  APIService.public.post(`/users/${userId}/food-ingredients`, foodIngredientData);

/* /api/v1/users/{userId}/cooking-equipments 사용자-조리도구 관계 생성 */
export const postUserCookingEquipments = (userId, equipmentIdList) =>
  APIService.public.post(`/users/${userId}/cooking-equipments`, equipmentIdList);
