import { APIService } from '@/api/api';

export const postCreateUser = (loginNumber) => APIService.public.post('/users', { loginNumber });

export const getUserByLoginNumber = (loginNumber) => APIService.public.get(`/users/${loginNumber}`);
