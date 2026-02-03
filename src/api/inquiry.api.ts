import type { CreateInquiryRequest, getInquiriesParams, getInquiryParams, Inquiry } from "../types/inqury.ts";
import { httpClient } from "./axios.ts";

export const createInquiry = async (data: CreateInquiryRequest) => {
    const response = await httpClient.post<Inquiry>("/inquiries", data);
    return response.data;
}

export const getMyInquiries = async (params: getInquiriesParams)=> {
    const response = await httpClient.get<getInquriesResponse>("/inquiries/me",{
        params;
    });
    return response.data;
}

export const getInquiryDetail = async (params: getInquiryParams) => {
    const response = await httpClient.get<Inquiry>(`/inquiries/${id}`, {
        params,
    });
    return response.data;
}