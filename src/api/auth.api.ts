import type { LoginProps, RegisterProps, User } from "../types/user";
import { httpClient } from "./axios.ts"; // 타입 정의 필요

interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export const registerUser = async (data: RegisterProps) => {
    const response = await httpClient.post<{ message: string; user: User }>("/auth/register", data);
    return response.data;
};

export const loginUser = async (data: LoginProps) => {
    const response = await httpClient.post<AuthResponse>("/auth/login", data);
    return response.data;
};
