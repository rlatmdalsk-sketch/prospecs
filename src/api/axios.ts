import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json", //내가 요청을 할때 json형식으로 내용을 적어서 보내겠다
        "x-client-key": API_KEY, //백엔드에서정한사항, 인증코드를 넣어서 요청을 보낸다

    }
});

