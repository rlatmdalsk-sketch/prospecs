import type { Inquiry, InquiryStatus, InquiryType } from "./inquiry";

// 관리자용 문의 모델 (작성자 정보 포함)
export interface AdminInquiry extends Inquiry {
    user?: {
        name: string;
        email: string;
    };
}

// [Request] 관리자 목록 조회 쿼리 파라미터
export interface GetAdminInquiriesParams {
    page?: number;
    limit?: number;
    status?: InquiryStatus;
    type?: InquiryType;
}

// [Response] 관리자 목록 조회 응답
export interface AdminInquiryListResponse {
    data: AdminInquiry[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

// [Request] 답변 등록/수정 요청 데이터
export interface AnswerInquiryRequest {
    answer: string;
}
