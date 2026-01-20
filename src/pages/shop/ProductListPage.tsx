import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Category } from "../../types/category.ts";
import { getCategoryById } from "../../api/category.api.ts";
import { twMerge } from "tailwind-merge";
import Breadcrumbs from "../../components/common/Breadcrumbs.tsx";
import { getProducts, type GetProductsParams } from "../../api/product.api.ts";
import type { Product } from "../../types/product.ts";
import ProductCard from "../../components/shop/ProductCard.tsx";
import { FILTER_STYLES } from "../../types/productFilter.ts";

function ProductListPage() {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    /* Category에 대한 요청*/
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

    /*상품목록에 대한 요청*/
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const params: GetProductsParams = {
                    page: 1,
                    limit: 40,
                    categoryId: Number(id),
                    styles: selectedStyles,
                };
                const response = await getProducts(params);
                setProducts(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct().then(() => {});
    }, [id, selectedStyles, selectedGenders, selectedSizes]);

    const handleFilterChange = (type: "styles" | "genders" | "sizes", value: string) => {
        switch (type) {
            case "styles":
                if (selectedStyles.includes(value)) {
                    setSelectedStyles(selectedStyles.filter(item => item !== value));
                } else {
                    setSelectedStyles([...selectedStyles, value]);
                }
                break;
            case "genders":
                if (selectedGenders.includes(value)) {
                    setSelectedGenders(selectedGenders.filter(item => item !== value));
                } else {
                    setSelectedGenders([...selectedGenders, value]);
                }
                break;
            case "sizes":
                if (selectedSizes.includes(value)) {
                    setSelectedSizes(selectedSizes.filter(item => item !== value));
                } else {
                    setSelectedSizes([...selectedSizes, value]);
                }
                break;
        }
    }

    const handleReset = () => {
        setSelectedStyles([]);
        setSelectedGenders([]);
        setSelectedSizes([]);
    }

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
                <div className={twMerge(["text-sm", "font-medium"])}>
                    Total <span className={twMerge(["font-bold"])}>{products.length}</span>Items
                </div>
            </div>

            {/* 상품 목록 관련 */}
            <div className={twMerge(["flex"])}>
                {/*상품 관련 필터*/}
                <div className={twMerge(["w-64"])}>
                    <aside className={twMerge("w-64", "pr-8", "space-y-10", "h-fit")}>
                        <div
                            className={twMerge(
                                "flex",
                                "justify-between",
                                "items-center",
                                "ph-4",
                                "border-b",
                                "border-gray-800",
                            )}>
                            <h2 className={twMerge("font=bold", "text-lg")}>FILTER</h2>
                            <button className={twMerge("text-xs", "text-gray-500")} onClick={handleReset}>초기화</button>
                        </div>

                        <div className={twMerge("flex", "flex-col")}>
                            <div className={twMerge("space-y-4")}>
                                <h3 className={twMerge("font-bold", "text-sm")}>종류</h3>
                                <div className={twMerge("space-y-2", "pr-2")}>
                                    {FILTER_STYLES.map((style, index) => (
                                        <label
                                            key={index}
                                            className={twMerge(
                                                "flex",
                                                "items-center",
                                                "gap-3",
                                                "cursor-pointer",
                                            )}>
                                            <input
                                                type={"checkbox"}
                                                className={twMerge("w-4", "h-4", "rounded")}
                                                onChange={() => handleFilterChange("styles", style.value)}
                                            />
                                            <span className={twMerge("text-sm", "text-gray-600")}>
                                                {style.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/*상품 목록*/}
                <div className={twMerge(["flex-1"])}>
                    {products.length > 0 ? (
                        <div className={twMerge(["flex", "flex-wrap", "gap-y-3"])}>
                            {products.map(product => (
                                <div key={product.id} className={twMerge("w-1/4", "px-3")}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className={twMerge([
                                "min-h-[50dvh]",
                                "flex",
                                "justify-center",
                                "items-center",
                            ])}>
                            조건에 맞는 상품이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductListPage;
