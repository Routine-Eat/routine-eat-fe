import { APIService } from '@/api/api';

/* /api/v1/menus/difficulty-level/init 메뉴 난이도 초기화 API */
export const patchInitMenuDifficultyLevel = () =>
  APIService.public.patch('/menus/difficulty-level/init');
