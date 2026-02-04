export type InquiryStatus = "PENDING" | "ANSWERED";

export type InquiryType = "DELIVERY" | "PRODUCT" | "EXCHANGE_RETURN" | "MEMBER" | "OTHER";

export interface InquiryImage {
    id: number;
    url: string;
}

export interface InquiryUser {
    email: string;
    name: string;
}

export interface InquiryMeta {
    lastPage: number;
    page: number;
    total: number;
}

export interface Inquiry {
    id: number;
    answer?: string;
    answeredAt?: string;
    content: string;
    createdAt: string;
    status: InquiryStatus;
    title: string;
    type: InquiryType;
    updatedAt: string;
    images: InquiryImage[];
    user: InquiryUser;
}

// 목록 응답 타입
export interface getInquiriesResponse {
    data: Inquiry[];
    meta: InquiryMeta;
}

// 목록 요청 타입
export interface getInquiriesParams {
    page?: number;
    limit?: number;
}

// 문의 등록 요청
export interface CreateInquiryRequest {
    title: string;
    content: string;
    type: InquiryType;
    images?: string[];
}