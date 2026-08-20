import { APIService } from '@/api/api';

/* /api/v1/cooking-equipments 조리도구 조회 API */
export const getCookingEquipments = (search, symbol) => {
  return APIService.public.get('/cooking-equipments', {
    params: {
      search,
      symbol,
    },
  });
};

/* /api/v1/cooking-equipments/init 조리도구 세팅 API */
export const postInitCookingEquipments = () => APIService.public.post('/cooking-equipments/init');
