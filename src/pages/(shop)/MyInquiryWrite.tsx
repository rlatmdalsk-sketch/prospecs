import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { createInquiry } from "../../api/inquiry.api";
import type { InquiryType } from "../../types/inquiry";
import Editor from "../../components/common/Editor";
import Accordion from "../../components/common/Accordion";
import Button from "../../components/common/Button"; // 기존 버튼 컴포넌트 활용 가정
import { FaTimes, FaPaperclip } from "react-icons/fa";
import { uploadImage } from "../../api/upload.api.ts"; // *주의: 사용자용 이미지 업로드 API로 교체 필요

const MyInquiryWrite = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 폼 상태 관리
    const [type, setType] = useState<InquiryType>("PRODUCT");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // 에디터 HTML 내용
    const [attachedImages, setAttachedImages] = useState<string[]>([]); // 첨부파일 URL 목록
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 문의 유형 옵션
    const typeOptions: { value: InquiryType; label: string }[] = [
        { value: "PRODUCT", label: "상품 문의" },
        { value: "DELIVERY", label: "배송 문의" },
        { value: "EXCHANGE_RETURN", label: "교환/반품 문의" },
        { value: "MEMBER", label: "회원정보 문의" },
        { value: "OTHER", label: "기타 문의" },
    ];

    // 첨부파일 업로드 핸들러
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // 간단한 유효성 검사 (예: 5MB 이하, 이미지 파일만)
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("이미지 크기는 5MB 이하여야 합니다.");
            return;
        }

        try {
            // [API 호출] 실제로는 사용자용 이미지 업로드 API를 사용해야 합니다.
            // 여기서는 예시로 기존에 있던 uploadAdminImage를 사용하거나, 동일한 로직의 함수를 호출합니다.
            const url = await uploadImage(file, "inquiry");

            setAttachedImages(prev => [...prev, url]);
        } catch (error) {
            console.error("이미지 업로드 실패", error);
            alert("이미지 업로드 중 오류가 발생했습니다.");
        } finally {
            // 같은 파일 다시 선택 가능하도록 input 초기화
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // 첨부파일 삭제 핸들러
    const removeImage = (indexToRemove: number) => {
        setAttachedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        // 에디터 내용이 비었는지 체크 (HTML 태그 제거 후 텍스트 확인)
        const plainText = content.replace(/<[^>]+>/g, "").trim();
        if (!plainText && !content.includes("<img")) {
            alert("내용을 입력해주세요.");
            return;
        }

        if (!window.confirm("문의를 등록하시겠습니까?")) return;

        setIsSubmitting(true);

        try {
            await createInquiry({
                type,
                title,
                content,
                images: attachedImages,
            });
            alert("문의가 등록되었습니다.");
            navigate("/my/inquiry"); // 목록으로 이동
        } catch (error) {
            console.error("문의 등록 실패", error);
            alert("문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-8 border-b-2 border-black pb-4 text-gray-900">
                1:1 문의 작성
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. 문의 유형 선택 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">문의 유형</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value as InquiryType)}
                        className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors appearance-none bg-white"
                        style={{ backgroundImage: "none" }} // 브라우저 기본 화살표 제거 스타일 (필요시 커스텀)
                    >
                        {typeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. 제목 입력 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요"
                        className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                        maxLength={50}
                    />
                </div>

                {/* 3. 내용 입력 (Editor) */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">내용</label>
                    <div className="min-h-100">
                        <Editor
                            value={content}
                            onChange={setContent}
                            placeholder="문의하실 내용을 자세히 적어주세요."
                        />
                    </div>
                </div>

                {/* 4. 파일 첨부 (별도 섹션) */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-gray-700">첨부파일</label>
                        <span className="text-xs text-gray-400">
                            (이미지 파일만 가능, 최대 5장)
                        </span>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {/* 업로드 버튼 */}
                        <div
                            onClick={() => {
                                if (attachedImages.length >= 5) {
                                    alert("최대 5장까지만 첨부 가능합니다.");
                                    return;
                                }
                                fileInputRef.current?.click();
                            }}
                            className="w-24 h-24 border border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-black hover:text-black transition-colors bg-gray-50">
                            <FaPaperclip size={20} className="mb-1" />
                            <span className="text-xs">파일 선택</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* 첨부된 이미지 미리보기 */}
                        {attachedImages.map((url, index) => (
                            <div
                                key={index}
                                className="w-24 h-24 border border-gray-200 rounded-sm relative group bg-white">
                                <img
                                    src={url}
                                    alt={`attached-${index}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* 삭제 버튼 (hover시 등장) */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                                    title="삭제">
                                    <FaTimes size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 하단 버튼 그룹 */}
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                        onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "문의 등록하기"}
                    </Button>
                </div>
            </form>

            {/* 하단 유의사항 (Accordion 사용) */}
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
};

export default MyInquiryWrite;
