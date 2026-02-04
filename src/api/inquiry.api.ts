import type {
    CreateInquiryRequest,
    getInquiriesParams,
    getInquiriesResponse,
    Inquiry,
} from "../types/inquiry.ts";
import { httpClient } from "./axios.ts";

export const createInquiry = async (data: CreateInquiryRequest) => {
    const response = await httpClient.post<Inquiry>("/inquiries", data);
    return response.data;
};

export const getMyInquiries = async (params: getInquiriesParams) => {
    const response = await httpClient.get<getInquiriesResponse>("/inquiries/me", {
        params,
    });
    return response.data;
};

export const getInquiryDetail = async (id: number) => {
    const response = await httpClient.get<Inquiry>(`/inquiries/${id}`);
    return response.data;
};