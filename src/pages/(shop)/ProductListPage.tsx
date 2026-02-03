import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Category } from "../../types/category.ts";
import { getCategoryById } from "../../api/category.api.ts";
import { twMerge } from "tailwind-merge";
import Breadcrumbs from "../../components/common/Breadcrumbs.tsx";
import { getProducts, type GetProductsParams } from "../../api/product.api.ts";
import type { Product } from "../../types/product.ts";
import ProductCard from "../../components/shop/ProductCard.tsx";
import { FILTER_GENDERS, FILTER_SIZES, FILTER_STYLES } from "../../types/productFilter.ts";

function ProductListPage() {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    // 필터 관련 state
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    {
        /* Category에 대한 요청 */
    }
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

    {
        /* 상품 목록에 대한 요청 */
    }
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
                    genders: selectedGenders,
                    sizes: selectedSizes,
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
                // array에 있는 includes 메소드 => 단순하게 이 안에 값이 포함되어져 있는지 확인할 때 쓰는 메소드
                // array에 있는 find, some, 메소드는 array 안에 있는 요소가 객체일 때 사용.
                // 왜냐하면 includes는 진짜 "값"만으로 찾아야 하고, find나 some 메소드는 함수를 통해
                // 그 요소들을 "꺼내서" 비교할 수 있기 때문
                if (selectedStyles.includes(value)) {
                    // 빼야되는거고
                    setSelectedStyles(selectedStyles.filter(item => item !== value));
                } else {
                    // 덧붙여줘야 됨
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
    };

    const handleReset = () => {
        setSelectedStyles([]);
        setSelectedGenders([]);
        setSelectedSizes([]);
    };

    return (
        <div className={twMerge(["max-w-400", "mx-auto", "py-40"])}>
            {/* 상단 카테고리 헤더 */}
            <div
                className={twMerge(
                    ["flex", "justify-between", "items-end", "pb-4", "mb-4"],
                    ["border-b", "border-gray-200"],
                )}>
                <div>
                    <h1 className={twMerge(["text-3xl", "font-extrabold", "uppercase", "mb-2"])}>
                        {category ? category.name : ""}
                    </h1>

                    <Breadcrumbs items={category ? category.breadcrumbs : []} />
                </div>
                <div className={twMerge(["text-sm", "font-medium"])}>
                    Total <span className={"font-bold"}>{products.length}</span> Items
                </div>
            </div>

            {/* 상품 목록 관련 */}
            <div className={twMerge(["flex"])}>
                {/* 상품 관련 필터 */}
                <div className={twMerge(["w-64"])}>
                    <aside className={twMerge(["w-64", "pr-8", "space-y-10", "h-fit"])}>
                        <div
                            className={twMerge(
                                ["flex", "justify-between", "items-center", "pb-4"],
                                ["border-b", "border-gray-800"],
                            )}>
                            <h2 className={twMerge(["font-bold", "text-lg"])}>FILTER</h2>
                            <button
                                className={twMerge(["text-xs", "text-gray-500"])}
                                onClick={handleReset}>
                                초기화
                            </button>
                        </div>

                        {/* 필터 관련 */}
                        <FilterBox
                            title={"종류"}
                            type={"styles"}
                            data={FILTER_STYLES}
                            selectedValue={selectedStyles}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title={"성별"}
                            type={"genders"}
                            data={FILTER_GENDERS}
                            selectedValue={selectedGenders}
                            onChange={handleFilterChange}
                        />
                        <FilterButtonBox
                            onChange={handleFilterChange}
                            selectedSizes={selectedSizes}
                        />
                    </aside>
                </div>

                {/* 상품 목록 */}
                <div className={twMerge(["flex-1"])}>
                    {loading && (
                        <div className={twMerge(["flex", "flex-wrap", "gap-y-3"])}>
                            {/* 동일한 컴포넌트를 여러개 뽑을 수 있는 방법은 우리는 map을 알고 있음
                                    그렇기 때문에 요소가 8개인 Array를 생성해서 map을 돌려줘야 함
                                    배열을 만드는 방법 : Array(갯수)
                                     [ , , , , , , , ]
                                 */}

                            {[...Array(8)].map((_ ,index) => (
                                <div key={index} className={twMerge(["w-1/4", "px-3", "animate-pulse"])}>
                                    <div
                                        className={twMerge([
                                            "bg-gray-200",
                                            "aspect-3/4",
                                            "w-full",
                                            "mb-2",
                                        ])}
                                    />
                                    <div
                                        className={twMerge(["h-4", "bg-gray-200", "w-3/4", "mb-1"])}
                                    />
                                    <div className={twMerge(["h-4", "bg-gray-200", "w-1/2"])} />
                                </div>
                            ))}
                        </div>
                    )}
                    {!loading && products.length > 0 ? (
                        <div className={twMerge(["flex", "flex-wrap", "gap-y-3"])}>
                            {products.map(product => (
                                <div key={product.id} className={twMerge(["w-1/4", "px-3"])}>
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

interface FilterBoxProps {
    title: string;
    data: { label: string; value: string }[];
    type: "styles" | "genders";
    selectedValue: string[];
    onChange: (type: "styles" | "genders" | "sizes", value: string) => void;
}

function FilterBox({ title, data, type, onChange, selectedValue }: FilterBoxProps) {
    return (
        <div className={twMerge(["flex", "flex-col"])}>
            {/* styles 시작 */}
            <div className={twMerge(["space-y-4"])}>
                <h3 className={twMerge(["font-bold", "text-sm"])}>{title}</h3>
                <div className={twMerge(["space-y-2", "pr-2"])}>
                    {data.map((style, index) => (
                        <label
                            key={index}
                            className={twMerge([
                                "flex",
                                "items-center",
                                "gap-3",
                                "cursor-pointer",
                            ])}>
                            {/* input type="text"일 땐 value로 접근, type="checkbox"일 땐 checked로 접근 */}
                            <input
                                type={"checkbox"}
                                className={twMerge(["w-4", "h-4", "rounded"])}
                                checked={selectedValue.includes(style.value)}
                                onChange={() => onChange(type, style.value)}
                            />
                            <span className={twMerge(["text-sm", "text-gray-600"])}>
                                {style.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface FilterButtonBoxProps {
    selectedSizes: string[];
    onChange: (type: "styles" | "genders" | "sizes", value: string) => void;
}

function FilterButtonBox({ onChange, selectedSizes }: FilterButtonBoxProps) {
    return (
        <div className={twMerge(["flex", "flex-col"])}>
            {/* styles 시작 */}
            <div className={twMerge(["space-y-4"])}>
                <h3 className={twMerge(["font-bold", "text-sm"])}>사이즈</h3>
                <div className={twMerge(["pr-2", "flex", "flex-wrap", "gap-2"])}>
                    {FILTER_SIZES.map((item, index) => {
                        const isSelected = selectedSizes.includes(item);

                        return (
                            <button
                                key={index}
                                className={twMerge(
                                    ["text-xs", "py-2", "px-3", "border", "rounded-sm"],
                                    isSelected && ["text-white", "bg-black"],
                                )}
                                onClick={() => onChange("sizes", item)}>
                                {item}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
