import type { LoginFormType, LoginResponse, RegisterFormType, User } from "../types/user.ts";
import { httpClient } from "./axios.ts";

export const registerUser = async (data: RegisterFormType) => {
    const response = await httpClient.post<{ message: string; user: User }>("/auth/register", data);
    return response.data;
};

export const loginUser = async (data: LoginFormType) => {
    const response = await httpClient.post<LoginResponse>("/auth/login", data);
    return response.data;
};
