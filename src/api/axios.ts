import axios from "axios";
import useAuthStore from "../stores/useAuthStore.ts";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json", //내가 요청을 할때 json형식으로 내용을 적어서 보내겠다
        "x-client-key": API_KEY, //백엔드에서정한사항, 인증코드를 넣어서 요청을 보낸다

    }
});

httpClient.interceptors.request.use(
    config => {
        //axios가 request를 보낼 때 환경 설정 정보를 꺼내서 수정하고 다시 넣어줘야 되는 함수
        //만약, useAuthStore (zustand)에 token이 존재하면, 그 token 정보를 꺼내서
        //request header에 "Authorization"이라는 키에, 그 token을 넣어서 환경 설정 정보를 수정 후 axios에 넣는다

        //React hooks : useState, useEFFect, useRef
        //React hooks 라는건, React 컴포넌트 내부에서 변경사항을 지속적으로 확인하고 그에 대한 처리를 해 줄수있는 메소드
        //zustand에서 만든 것도 훅이다 => 컴포넌트가 아닌곳에서 데이터를 꺼내와야함
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;


    }
)