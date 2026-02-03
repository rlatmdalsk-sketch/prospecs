import { httpClient } from "./axios.ts";

export const uploadImage = async (file: File, folder: string) => {
    // 백엔드에서 데이터를 전달해줄 때에는 어쨌든, form 형태로 전달해줘야 함
    // 우리는 이 함수에서 이미지만 받았기 때문에 강제로 FormData 형식으로 만들어서
    // 백엔드에 전달해줄 것임
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await httpClient.post<{ url: string}>("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data"}
    })
    return response.data.url;
}