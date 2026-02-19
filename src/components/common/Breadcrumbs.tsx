import { Link } from "react-router";
import { FiChevronRight } from "react-icons/fi"; // react-icons 사용
// 이전에 정의한 타입 경로에 맞게 수정해주세요.
import type { BreadcrumbItem } from "../../types/category";

interface BreadcrumbsProps {
    items: BreadcrumbItem[] | undefined; // 데이터 로딩 전 undefined 일 수 있음
    className?: string;
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
    // 아이템이 없으면 아무것도 렌더링하지 않음 (Home만 덩그러니 있는 것 방지)
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
            <ol className="flex items-center flex-wrap gap-1 md:gap-2">
                {/* 1. Home 링크 (항상 고정) */}
                <li className="flex items-center">
                    <Link
                        to="/"
                        className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">
                        Home
                    </Link>
                </li>

                {/* 2. 전달받은 경로 아이템들 순회 */}
                {items.map((item, index) => {
                    // 마지막 아이템인지 확인
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.id} className="flex items-center">
                            {/* 구분자 아이콘 */}
                            <FiChevronRight className="w-4 h-4 text-gray-400 mx-1" />

                            {/* 링크 또는 텍스트 */}
                            {isLast ? (
                                // 마지막 아이템: 현재 페이지이므로 링크 없이 볼드 처리
                                <span
                                    className="font-bold text-black truncate max-w-37.5 md:max-w-50"
                                    title={item.name} // 마우스 올리면 전체 이름 표시
                                >
                                    {item.name}
                                </span>
                            ) : (
                                // 중간 아이템: 해당 카테고리로 이동하는 링크
                                <Link
                                    to={`/category/${item.id}`}
                                    className="text-gray-500 hover:text-black transition-colors truncate max-w-25 md:max-w-37.5"
                                    title={item.name}>
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
