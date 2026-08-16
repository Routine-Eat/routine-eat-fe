import { APIService } from '@/api/api';

//
export const postCreateUser = (loginNumber) => APIService.public.post('/users', { loginNumber });
