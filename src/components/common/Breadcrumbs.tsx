import type { BreadcrumbsItem } from "../../types/category.ts";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { FiChevronRight } from "react-icons/fi";

interface BreadcrumbsProps {
    items: BreadcrumbsItem[];
    className?: string;
}

function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={twMerge(["flex", "items-center", "gap-2", className])}>
            <ol className={twMerge(["flex", "items-center", "gap-2"])}>
                <li className={twMerge(["flex", "items-center"])}>
                    <Link to={"/"} className={twMerge(["text-gray-500", "hover:text-black"])}>
                        Home
                    </Link>
                </li>
                {/*
                     맵을 돌려서 화살표 함수 부분에 소괄호() 를 친 것은 자바스크립트 코드 없이
                     컴포넌트를 그대로 리턴 시킨다는 의미
                     map 내부에 들어가는 매개변수는 함수니까, 당연히 중괄호 {} 를 쳐서 코드를 쓸 수 있음
                */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className={twMerge(["flex", "items-center", "gap-2"])}>
                            <FiChevronRight className={twMerge(["w-4", "h-4", "text-gray-400"])} />
                            {isLast ? (
                                <span className={twMerge(["text-black"])}>{item.name}</span>
                            ) : (
                                <Link
                                    to={`/category/${item.id}`}
                                    className={twMerge(["text-gray-500", "hover:text-black"])}>
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
