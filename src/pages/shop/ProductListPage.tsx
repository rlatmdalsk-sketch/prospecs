import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Category } from "../../types/category.ts";
import { getCategoryById } from "../../api/category.api.ts";
import { twMerge } from "tailwind-merge";
import Breadcrumbs from "../../components/common/Breadcrumbs.tsx";

function ProductListPage() {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            if (!id) return;

            try {
                const data = await getCategoryById(Number(id));
                setCategory(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchInfo().then(() => {});
    }, [id]);

    return (
        <div className={twMerge(["max-w-400", "mx-auto", "py-40"])}>
            {/* 상단 카테고리 헤더 */}
            <div
                className={twMerge(
                    ["flex", "justify-between", "items-end", "pb-4"],
                    ["border-b", "border-gray-200"],
                )}>
                <div>
                    <h1 className={twMerge(["text-3xl", "font-extrabold", "uppercase", "mb-2"])}>
                        {category ? category.name : ""}
                    </h1>

                    <Breadcrumbs items={category ? category.breadcrumbs : []} />
                </div>
                <div>
                    <div className={twMerge("text-sm","font-medium")}>
                        Total <span className={twMerge("font-bold")}>Items</span>
                    </div>
                </div>
            </div>

            {/* 상품 목록 관련 */}
            <div></div>
        </div>
    );
}

export default ProductListPage;