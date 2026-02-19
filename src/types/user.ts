export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    birthdate: string;
    gender: "MALE" | "FEMALE";
    emailOptIn: boolean;
    smsOptIn: boolean;
    role: "USER" | "ADMIN";
}

export interface RegisterProps {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    phone: string;
    birthdate: string;
    gender: "MALE" | "FEMALE";
    emailOptIn: boolean;
    smsOptIn: boolean;
    // 주소는 회원가입 시 제외 (Optional)
    zipCode?: string;
    address1?: string;
    address2?: string;
}

export interface LoginProps {
    email: string;
    password: string;
}
