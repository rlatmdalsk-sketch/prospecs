export type InquiryType =
    | "DELIVERY" // 배송
    | "PRODUCT" // 상품
    | "EXCHANGE_RETURN" // 교환/반품
    | "MEMBER" // 회원관련
    | "OTHER"; // 기타

// 문의 상태
export type InquiryStatus = "PENDING" | "ANSWERED";

// 문의 이미지
export interface InquiryImage {
    id: number;
    url: string;
}

// 핵심 문의 데이터 모델
export interface Inquiry {
    id: number;
    type: InquiryType;
    title: string;
    content: string;
    status: InquiryStatus;
    answer: string | null;
    answeredAt: string | null; // JSON 응답은 Date가 string으로 옴
    createdAt: string;
    updatedAt: string;
    images?: InquiryImage[];
}

// [Request] 문의 등록 요청 데이터
export interface CreateInquiryRequest {
    type: InquiryType;
    title: string;
    content: string;
    images?: string[]; // 이미지 URL 배열
}

// [Response] 목록 조회 응답 (페이지네이션 포함)
export interface InquiryListResponse {
    data: Inquiry[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

// [Request] 목록 조회 쿼리 파라미터
export interface GetInquiriesParams {
    page?: number;
    limit?: number;
}
