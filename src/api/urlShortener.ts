import api from './http';

export const signup = (data: { email: string; password: string }) =>
    api().post('/signup', data);
export const login = (data: { email: string; password: string }) =>
    api().post('/login', data);
export const getUser = () => api().get('/user');
export const shorten = (data: { long_url: string }) =>
    api().post('/shorten', data);
export const deleteUrl = (id: number) => api().delete(`/urls/${id}`);
