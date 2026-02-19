import { httpClient } from "./axios.ts";

export const uploadImage = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await httpClient.post<{ url: string }>("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
};
