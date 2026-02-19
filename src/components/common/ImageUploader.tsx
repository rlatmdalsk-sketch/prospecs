import { type ChangeEvent, useState } from "react";
import { IoCamera, IoClose } from "react-icons/io5";
import {uploadAdminImage} from "../../api/admin.image.api.ts";

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
}

const ImageUploader = ({ value, onChange, onRemove }: ImageUploaderProps) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            // [변경] 관리자용 업로드 API 호출 (/api/admin/uploads)
            const url = await uploadAdminImage(file);
            onChange(url);
        } catch (error) {
            console.error(error);
            alert("이미지 업로드 실패 (관리자 권한 확인 필요)");
        } finally {
            setUploading(false);
        }
    };

    if (value) {
        return (
            <div className="relative w-24 h-24 border border-gray-200 rounded overflow-hidden group">
                <img src={value} alt="uploaded" className="w-full h-full object-cover" />
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <IoClose />
                    </button>
                )}
            </div>
        );
    }

    return (
        <label className="w-24 h-24 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 hover:border-black transition-colors">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            {uploading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            ) : (
                <>
                    <IoCamera className="text-2xl text-gray-400" />
                    <span className="text-[10px] text-gray-500 mt-1">Add Image</span>
                </>
            )}
        </label>
    );
};

export default ImageUploader;