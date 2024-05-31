import axios, { AxiosInstance } from "axios";
import qs from 'qs';

export const base = (): string => {
    return import.meta.env.VITE_API_URL || ((window as any).$runtimeConfig || {}).VITE_API_URL || 'https://neroli.tests.data.fr';
}

export const noIndices = (params: any) => qs.stringify(params, { arrayFormat: 'repeat' });

export const apiClient: AxiosInstance = axios.create({
    baseURL: base(),
    headers: {
        "Content-type": "application/json",
    },
    paramsSerializer: noIndices
});

apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});
(window as any).$api = apiClient;
export default apiClient;
