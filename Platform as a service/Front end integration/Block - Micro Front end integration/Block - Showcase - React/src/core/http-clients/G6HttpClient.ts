import { AxiosRequestConfig } from 'axios';
import Axios from 'axios';
const G6HttpClient = Axios.create({});

G6HttpClient.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const authData = JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.IDENTITY_SERVER_URL}:${process.env.IDENTITY_SERVER_CLIENT_ID}`));
        if (!authData) throw new Error('The token for Geosys was not found');
        return setConfigHeaders(authData.access_token, config);
    },
    (error) => {
        console.error(`interceptor error : ${error}`);
    },
);

const setConfigHeaders = (token: string, config: AxiosRequestConfig): AxiosRequestConfig => {
    config.headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    return config;
};

G6HttpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: any) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
        }
        return Promise.reject(error);
    },
);

export default G6HttpClient;
