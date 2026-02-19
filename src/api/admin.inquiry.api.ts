import { httpClient } from "./axios";
import type {
    AdminInquiry,
    AdminInquiryListResponse,
    AnswerInquiryRequest,
    GetAdminInquiriesParams,
} from "../types/admin.inquiry";

// 1. 전체 문의 목록 조회 (관리자)
export const getAdminInquiries = async (
    params?: GetAdminInquiriesParams,
): Promise<AdminInquiryListResponse> => {
    const response = await httpClient.get<AdminInquiryListResponse>("/admin/inquiries", {
        params,
    });
    return response.data;
};

// 2. 답변 등록 및 수정 (관리자)
export const answerInquiry = async (
    id: number,
    data: AnswerInquiryRequest,
): Promise<AdminInquiry> => {
    const response = await httpClient.put<AdminInquiry>(`/admin/inquiries/${id}/answer`, data);
    return response.data;
};
