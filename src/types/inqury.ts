export type InquiryStatus = "PENDING" | "ANSWERED";

export type inquiryType = "DELIVERY" | "PRODUCT" | "EXCHANGE_RETURN" | "MEMBER" | "OTHER";

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
    answeredAt? : string;
    content: string;
    createdAt: string;
    status: InquiryStatus;
    type: InquiryType;
    updatedAt: string;
    images: InquiryImage[];
    user: InquiryUser;

}

export interface getInquiriesResponse {
    data: Inquiry[];
    meta: InquiryMeta;
}

export interface getInquiriesParams {
    page?: number;
    limit?: number;
}

export interface CreateInquiryRequest {
    title: string;
    content: string;
    type: INquiryType;
    images?: string[];
}

export interface getInquiryParams {
    id: number;
}