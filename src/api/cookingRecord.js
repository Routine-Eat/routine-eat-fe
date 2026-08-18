import { APIService } from '@/api/api';

// 요리 시작 (레시피 기반 요리 단계/세션 생성)
export const postStartCooking = (userNumber, { recipeId, servings }) =>
  APIService.public.post(`/cooking-records`, { recipeId, servings }, {
    params: { userNumber },
  });

// 다음 요리 단계로 이동 (마지막 단계면 세션 완료 처리, data: null)
export const postNextCookingStep = (cookingRecordId, userNumber) =>
  APIService.public.post(
    `/cooking-records/${cookingRecordId}/cooking-session/cooking-steps/next`,
    {},
    { params: { userNumber } }
  );

// 이전 요리 단계로 이동 (현재가 1단계면 유지, data: null)
export const postPrevCookingStep = (cookingRecordId, userNumber) =>
  APIService.public.post(
    `/cooking-records/${cookingRecordId}/cooking-session/cooking-steps/prev`,
    {},
    { params: { userNumber } }
  );

// AI 대화 기록 조회 (커서 기반 페이지네이션)
export const getCookingSessionAiHistory = (cookingRecordId, { userNumber, cursor = 1, size = 10 }) =>
  APIService.public.get(
    `/cooking-records/${cookingRecordId}/cooking-session/ai`,
    { params: { userNumber, cursor, size } }
  );

// 요리 중 AI에게 지시 또는 질문 (응답이 multipart/form-data라 별도 처리 필요)
export const postCookingSessionAi = (cookingRecordId, userNumber, userSpeechText) =>
  APIService.public.post(
    `/cooking-records/${cookingRecordId}/cooking-session/ai`,
    { userSpeechText },
    { params: { userNumber } }
  );

// 진행 중인 요리 세션 조회
export const getCurrentCookingRecord = (userNumber) =>
  APIService.public.get(`/cooking-records/current`, { params: { userNumber } });

// 완료된 요리 기록 목록 조회 (커서 기반 페이지네이션)
export const getCookingRecords = ({ userNumber, cursor = 1, size = 10 }) =>
  APIService.public.get(`/cooking-records`, { params: { userNumber, cursor, size } });

// 요리 기록 상세 조회 (완료 후 회고 상세)
export const getCookingRecordDetail = (cookingRecordId, userNumber) =>
  APIService.public.get(`/cooking-records/${cookingRecordId}`, { params: { userNumber } });

// 이번 요리에 사용한 음식 재료 양 조회
export const getCookingRecordFoodIngredients = (cookingRecordId, userNumber) =>
  APIService.public.get(`/cooking-records/${cookingRecordId}/food-ingredients`, { params: { userNumber } });

// 요리 결과 저장 (multipart/form-data — 맛 평가, 난이도, 팁, 실제 사용량, 결과 이미지)
export const patchCookingResult = (userNumber, { tasteRating, difficultyLevel, cookingTip, modifiedCookingRecordFoodIngredients, image }) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob(
      [JSON.stringify({ tasteRating, difficultyLevel, cookingTip, modifiedCookingRecordFoodIngredients })],
      { type: "application/json" }
    )
  );
  if (image) formData.append("image", image);

  return APIService.public.patch(`/cooking-records`, formData, {
    params: { userNumber },
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 현재 요리 단계 정보 조회 (이동 없이 조회만)
export const getCurrentCookingStep = (cookingRecordId, userNumber) =>
  APIService.public.get(
    `/cooking-records/${cookingRecordId}/cooking-session/cooking-steps/current`,
    { params: { userNumber } }
  );