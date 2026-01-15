import type { RegisterFormType, User } from "../types/user.ts";
import { httpClient } from "./axios.ts";

export const registerUser = async(data: RegisterFormType) => {
    const response = await httpClient.post<{message: string, user:User}>
    ("/auth/register",data);
    return response.data;
};

