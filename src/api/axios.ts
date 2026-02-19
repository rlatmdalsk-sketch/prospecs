import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4001/api";
const API_KEY = import.meta.env.VITE_API_KEY || "";

export const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "x-client-key": API_KEY, // [중요] 백엔드 미들웨어 통과용 키
    },
});

// 요청 인터셉터: 토큰이 있으면 헤더에 실어보냄
httpClient.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: 에러 처리 공통화 (선택사항)
httpClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // 토큰 만료 시 로그아웃 처리 등의 로직 가능
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    },
);
