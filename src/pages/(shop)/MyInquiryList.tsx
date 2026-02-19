import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMyInquiries } from "../../api/inquiry.api";
import type { Inquiry, InquiryType, InquiryStatus } from "../../types/inquiry";
import { FaChevronDown, FaChevronUp, FaPen } from "react-icons/fa";

const MyInquiryList = () => {
    const navigate = useNavigate();

    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    // 아코디언 상태 관리 (열린 항목의 ID)
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        fetchInquiries().then(() => {});
    }, []);

    const fetchInquiries = async () => {
        try {
            // 페이지네이션은 추후 구현, 우선 1페이지 기본 로드
            const response = await getMyInquiries({ page: 1, limit: 20 });
            setInquiries(response.data);
        } catch (error) {
            console.error("문의 내역 로드 실패", error);
        } finally {
            setLoading(false);
        }
    };

    // 아코디언 토글
    const toggleExpand = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    // [헬퍼] 문의 유형 한글 변환
    const getTypeLabel = (type: InquiryType) => {
        const map: Record<InquiryType, string> = {
            DELIVERY: "배송",
            PRODUCT: "상품",
            EXCHANGE_RETURN: "교환/반품",
            MEMBER: "회원",
            OTHER: "기타",
        };
        return map[type] || type;
    };

    // [헬퍼] 문의 상태 배지
    const renderStatusBadge = (status: InquiryStatus) => {
        if (status === "ANSWERED") {
            return (
                <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-black rounded-sm">
                    답변완료
                </span>
            );
        }
        return (
            <span className="inline-block px-2 py-1 text-xs font-bold text-gray-500 bg-gray-200 rounded-sm">
                답변대기
            </span>
        );
    };

    if (loading)
        return <div className="py-20 text-center text-gray-500">문의 내역을 불러오는 중...</div>;

    return (
        <div className="w-full mx-auto px-4">
            {/* 상단 헤더 영역 */}
            <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold text-gray-900">1:1 문의 내역</h1>
                <button
                    onClick={() => navigate("/my/inquiry/write")}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                    <FaPen size={12} />
                    문의하기
                </button>
            </div>

            {inquiries.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 border border-gray-100 rounded-sm">
                    <p className="text-gray-500 mb-4">작성한 문의 내역이 없습니다.</p>
                </div>
            ) : (
                <div className="border-t border-gray-200">
                    {inquiries.map(inquiry => {
                        const isExpanded = expandedId === inquiry.id;

                        return (
                            <div key={inquiry.id} className="border-b border-gray-200">
                                {/* 1. 리스트 아이템 헤더 (클릭 시 펼침) */}
                                <div
                                    onClick={() => toggleExpand(inquiry.id)}
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                        {/* 상태 & 유형 */}
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 shrink-0 w-24 md:w-auto">
                                            {renderStatusBadge(inquiry.status)}
                                            <span className="text-xs text-gray-500 font-medium">
                                                [{getTypeLabel(inquiry.type)}]
                                            </span>
                                        </div>

                                        {/* 제목 */}
                                        <h3 className="text-sm md:text-base font-medium text-gray-900 truncate flex-1">
                                            {inquiry.title}
                                        </h3>

                                        {/* 작성일 & 화살표 */}
                                        <div className="flex items-center gap-4 text-gray-400 text-xs md:text-sm shrink-0">
                                            <span>
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </span>
                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. 상세 내용 (아코디언 본문) */}
                                {isExpanded && (
                                    <div className="bg-gray-50 p-6 text-sm">
                                        {/* 질문 내용 */}
                                        <div className="mb-6">
                                            <div className="flex items-start gap-3">
                                                <span className="font-bold text-orange-600 shrink-0 mt-0.5">
                                                    Q.
                                                </span>
                                                <div
                                                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                                    dangerouslySetInnerHTML={{
                                                        __html: inquiry.content,
                                                    }}
                                                />
                                            </div>

                                            {/* 첨부 이미지 (있을 경우) */}
                                            {inquiry.images && inquiry.images.length > 0 && (
                                                <div className="mt-4 flex gap-2 overflow-x-auto pl-6">
                                                    {inquiry.images.map(img => (
                                                        <div
                                                            key={img.id}
                                                            className="w-24 h-24 border border-gray-200 bg-white rounded-sm overflow-hidden shrink-0 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(img.url, "_blank")
                                                            }>
                                                            <img
                                                                src={img.url}
                                                                alt="attachment"
                                                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* 답변 내용 (있을 경우) */}
                                        {inquiry.answer ? (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <span className="font-bold text-black shrink-0 mt-0.5">
                                                        A.
                                                    </span>
                                                    <div className="flex-1">
                                                        {/* 관리자가 에디터로 작성했을 수 있으므로 HTML 렌더링 */}
                                                        <div
                                                            className="prose prose-sm max-w-none text-gray-800"
                                                            dangerouslySetInnerHTML={{
                                                                __html: inquiry.answer,
                                                            }}
                                                        />
                                                        <div className="mt-2 text-xs text-gray-400">
                                                            답변일:{" "}
                                                            {inquiry.answeredAt &&
                                                                new Date(
                                                                    inquiry.answeredAt,
                                                                ).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-4 pt-4 border-t border-gray-200 pl-6 text-gray-400 text-xs">
                                                아직 답변이 등록되지 않았습니다. 빠르고 정확하게
                                                답변해 드리겠습니다.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyInquiryList;
