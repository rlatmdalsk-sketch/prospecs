export interface RegisterFormType {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    phone: string;
    emailOptIn: boolean;
    smsOptIn: boolean;
    birthdate: string;
    gender: "MALE" | "FEMALE";
    zipCode?: string;
    address1?: string;
    address2?: string;
}

export interface LoginFormType {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export interface User {
    email: string;
    name: string;
    phone: string;
    emailOptIn: boolean;
    smsOptIn: boolean;
    birthdate: string;
    gender: "MALE" | "FEMALE";
    zipCode?: string;
    address1?: string;
    address2?: string;
}