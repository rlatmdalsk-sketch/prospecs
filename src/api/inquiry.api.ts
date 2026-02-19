import { httpClient } from "./axios";
import type {
    CreateInquiryRequest,
    GetInquiriesParams,
    Inquiry,
    InquiryListResponse,
} from "../types/inquiry";

// 1. 문의 등록
export const createInquiry = async (data: CreateInquiryRequest): Promise<Inquiry> => {
    const response = await httpClient.post<Inquiry>("/inquiries", data);
    return response.data;
};

// 2. 내 문의 목록 조회
export const getMyInquiries = async (params?: GetInquiriesParams): Promise<InquiryListResponse> => {
    const response = await httpClient.get<InquiryListResponse>("/inquiries/me", {
        params,
    });
    return response.data;
};

// 3. 문의 상세 조회 (내 문의)
export const getInquiryDetail = async (id: number): Promise<Inquiry> => {
    const response = await httpClient.get<Inquiry>(`/inquiries/${id}`);
    return response.data;
};
