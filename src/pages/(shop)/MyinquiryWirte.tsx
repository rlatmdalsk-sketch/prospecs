import { useNavigate } from "react-router";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

import { twMerge } from "tailwind-merge";
import Select from "../../components/common/Select.tsx";
import Input from "../../components/common/Input.tsx";
import { FaPaperclip, FaTimes } from "react-icons/fa";
import { uploadImage } from "../../api/upload.api.ts";
import { createInquiry } from "../../api/inquiry.api.ts";
import Button from "../../components/common/Button.tsx";
import Accordion from "../../components/common/Accordion.tsx";
import Editor from "../../components/common/Editor.tsx";
import type {InquiryType} from "../../types/inqury.ts";

function MyInquiryWrite() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [type, setType] = useState<InquiryType>("PRODUCT");
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState("");
    const [attachImage, setAttachImage] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const typeOptions = [
        { value: "PRODUCT", label: "상품 문의" },
        { value: "DELIVERY", label: "배송 문의" },
        { value: "EXCHANGE_RETURN", label: "교환/반품 문의" },
        { value: "MEMBER", label: "회원정보 문의" },
        { value: "OTHER", label: "기타 문의" },
    ];

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        // 파일을 임시 파일로 저장했다가 서브밋 때 업로드 처리를 했지만,
        // 여기서는 그냥 파일 선택을 하면 업로드 바로 할 것임
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (file.size > 5 * 1024 * 1024) {
            alert("이미지 크기는 5MB 이하여야 합니다.");
        }

        try {
            const url = await uploadImage(file, "inquiry");
            setAttachImage([...attachImage, url]);
        } catch (e) {
            console.log(e);
            alert("이미지 업로드 중 오류가 발생했습니다.");
        } finally {
            // 파일 선택된 것을 해제
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (indexToRemove: number) => {
        // 백엔드에게 이 녀석을 삭제해달라는 요청을 포함시키면 좋음
        setAttachImage(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!window.confirm("문의를 등록하시겠습니까?")) return;

        setIsSubmitting(true);

        try {
            // const result = await createInquiry({
            //     type,
            //     title,
            //     content,
            //     images: attachImage
            // })
            // navigate(`/my/inquiries/${result.id}`);
            await createInquiry({
                type,
                title,
                content,
                images: attachImage,
            });
            navigate("/my/inquiries");
        } catch (e) {
            console.log(e);
            alert("문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={twMerge(["w-full", "max-w-4xl", "mx-auto"])}>
            <h1
                className={twMerge(
                    ["text-2xl", "font-bold", "mb-8"],
                    ["border-b-2", "border-black", "pb-4", "text-gray-900"],
                )}>
                1:1 문의 작성
            </h1>

            <form className={twMerge(["space-y-6"])} onSubmit={handleSubmit}>
                <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                    <label className={twMerge(["text-sm", "font-bold", "text-gray-900"])}>
                        문의 유형
                    </label>
                    <Select
                        options={typeOptions}
                        value={type}
                        onChange={e => setType(e.target.value as InquiryType)}
                    />
                </div>

                <Input label={"제목"} value={title} onChange={e => setTitle(e.target.value)} />

                <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                    <label className={twMerge(["text-sm", "font-bold", "text-gray-900"])}>
                        내용
                    </label>
                    {/* 에디터 자리 */}
                    <Editor value={content} onChange={setContent} />
                </div>

                <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                    <label className={twMerge(["text-sm", "font-bold", "text-gray-900"])}>
                        첨부파일 (이미지 파일만 가능, 최대 5장)
                    </label>

                    <div className={twMerge(["flex", "gap-3", "flex-wrap"])}>
                        {/* 이미지 첨부 버튼 */}
                        <div
                            className={twMerge(
                                ["w-24", "h-24"],
                                ["flex", "flex-col", "justify-center", "items-center"],
                                ["border", "border-dashed", "border-gray-300", "rounded-sm"],
                                ["text-gray-400", "cursor-pointer", "bg-gray-50"],
                            )}
                            onClick={() => {
                                if (attachImage.length >= 5) {
                                    alert("최대 5장까지만 첨부 가능합니다.");
                                    return;
                                }

                                // useRef를 통해 선택된 요소에 접근해서 그 요소가 클릭 이벤트를 실행
                                fileInputRef.current?.click();
                            }}>
                            <FaPaperclip size={20} className={"mb-1"} />
                            <span className={"text-xs"}>파일 선택</span>
                        </div>
                        <input
                            type={"file"}
                            accept={"image/*"}
                            className={"hidden"}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        {/* 등록된 이미지 목록 */}
                        {attachImage.map((url, index) => (
                            <div
                                key={index}
                                className={twMerge(
                                    ["w-24", "h-24", "relative"],
                                    ["border", "border-gray-200", "rounded-sm"],
                                    ["bg-white", "group"],
                                )}>
                                <img
                                    src={url}
                                    className={twMerge(["w-full", "h-full", "object-cover"])}
                                    alt={url}
                                />
                                <button
                                    type={"button"}
                                    className={twMerge(
                                        ["absolute", "top-1", "right-1"],
                                        ["rounded-full", "p-1", "bg-black", "text-white"],
                                        ["opacity-80", "hover:opacity-100", "transition-all"],
                                    )}
                                    onClick={() => removeImage(index)}>
                                    <FaTimes size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={twMerge(
                        ["flex", "gap-3", "justify-center"],
                        ["border-t", "border-gray-100", "pt-6"],
                    )}>
                    <Button
                        variant={"secondary"}
                        className={"flex-1"}
                        size={"lg"}
                        onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button
                        type={"submit"}
                        size={"lg"}
                        className={"flex-1"}
                        disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "등록"}
                    </Button>
                </div>
            </form>

            <div className="mt-16">
                <Accordion title="문의 작성 시 유의사항" defaultOpen={true}>
                    <ul className="list-disc list-inside space-y-1 text-gray-500">
                        <li>답변은 평일 09:00 ~ 18:00 사이에 순차적으로 등록됩니다.</li>
                        <li>주말 및 공휴일에 등록된 문의는 다음 영업일에 답변해 드립니다.</li>
                        <li>
                            욕설, 비방, 광고성 글 등 부적절한 내용은 관리자에 의해 통보 없이 삭제될
                            수 있습니다.
                        </li>
                        <li>상품과 무관한 내용은 처리가 지연될 수 있습니다.</li>
                        <li>
                            이미지 파일(JPG, PNG, GIF)만 첨부 가능하며, 파일당 최대 5MB까지 업로드
                            가능합니다.
                        </li>
                    </ul>
                </Accordion>
                <Accordion title="자주 묻는 질문 (FAQ)">
                    <p className="mb-2">
                        <strong>Q. 배송은 언제 시작되나요?</strong>
                        <br />
                        A. 평일 오후 2시 이전 결제 완료 건은 당일 출고됩니다.
                    </p>
                    <p>
                        <strong>Q. 반품 주소지는 어디인가요?</strong>
                        <br />
                        A. [12345] 서울특별시 강남구 테헤란로 123, 00빌딩 1층 물류센터 앞
                    </p>
                </Accordion>
            </div>
        </div>
    );
}

export default MyInquiryWrite;