import { httpClient } from "./axios.ts";

export const uploadAdminImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // 경로가 /admin/uploads 로 변경됨
    const response = await httpClient.post<{ url: string }>("/admin/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
};