import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Product } from "../../types/product";
import ProductCard from "../../components/shop/ProductCard";
import FilterSidebar from "../../components/shop/FilterSidebar";
import { getCategoryDetail } from "../../api/category.api.ts";
import { getProducts } from "../../api/product.api.ts";
import type { CategoryDetail } from "../../types/category.ts";
import Breadcrumbs from "../../components/common/Breadcrumbs.tsx";

const ProductListPage = () => {
    const { id } = useParams<{ id: string }>();

    // 상태 관리
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState<CategoryDetail | null>(null);

    // 필터 상태
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // [단순화] 카테고리 정보 찾기 (ID로 검색)
    useEffect(() => {
        const fetchInfo = async () => {
            if (!id) return;
            try {
                // [변경] 전체 조회 -> 단일 상세 조회
                const data = await getCategoryDetail(Number(id));
                setCategoryInfo(data);
                // breadcrumbs 계산 로직 삭제! 백엔드가 줌.
            } catch (e) {
                console.error(e);
            }
        };
        fetchInfo().then(() => {});

        // 필터 초기화
        setSelectedStyles([]);
        setSelectedGenders([]);
        setSelectedSizes([]);
    }, [id]);

    // 2. 상품 목록 조회 (ID로 바로 호출)
    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return; // ID가 없으면 실행 안 함

            setLoading(true);
            try {
                const params = {
                    page: 1,
                    limit: 40,
                    categoryId: Number(id), // URL에서 받은 ID를 숫자로 변환
                    styles: selectedStyles,
                    genders: selectedGenders,
                    sizes: selectedSizes,
                };

                const res = await getProducts(params);

                // 백엔드 응답 처리 (res.data 또는 res.products)
                const productList = res.data || [];
                setProducts(productList);
            } catch (error) {
                console.error("상품 조회 실패", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts().then(() => {});
    }, [id, selectedStyles, selectedGenders, selectedSizes]); // id가 의존성

    // 필터 변경 핸들러 (Toggle)
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
    };

    // 필터 초기화
    const handleReset = () => {
        setSelectedStyles([]);
        setSelectedGenders([]);
        setSelectedSizes([]);
    };

    return (
        <div className="max-w-400 mx-auto px-4 md:px-8 py-40">
            {/* 상단 헤더 (카테고리명 & 개수) */}
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold uppercase tracking-tight">
                        {categoryInfo ? categoryInfo.name : "ALL PRODUCTS"}
                    </h1>

                    <Breadcrumbs items={categoryInfo?.breadcrumbs} />
                </div>
                <div className="text-sm font-medium">
                    Total <span className="font-bold">{products.length}</span> Items
                </div>
            </div>

            <div className="flex">
                {/* 왼쪽 사이드바 (필터) */}
                <FilterSidebar
                    selectedStyles={selectedStyles}
                    selectedGenders={selectedGenders}
                    selectedSizes={selectedSizes}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                {/* 오른쪽 상품 그리드 */}
                <div className="flex-1">
                    {loading ? (
                        // [로딩 스켈레톤]
                        // -mx-3: 아이템의 px-3로 생기는 좌우 여백을 컨테이너에서 상쇄
                        <div className="flex flex-wrap -mx-3">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    // w-1/2: 모바일 2열, md:w-1/3: 태블릿 3열, lg:w-1/4: 데스크탑 4열
                                    // px-3: 좌우 Gutter(간격) 생성 (합치면 gap-6인 24px와 동일)
                                    // mb-10: 상하 간격
                                    className="w-1/2 md:w-1/3 lg:w-1/4 px-3 mb-10 animate-pulse">
                                    <div className="bg-gray-200 aspect-3/4 w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-3/4 mb-1"></div>
                                    <div className="h-4 bg-gray-200 w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        // [상품 리스트]
                        <div className="flex flex-wrap -mx-3">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="w-1/2 md:w-1/3 lg:w-1/4 px-3 mb-12">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // [결과 없음]
                        <div className="py-20 text-center text-gray-500 border-t border-gray-100 mt-10">
                            <p className="text-lg">조건에 맞는 상품이 없습니다.</p>
                            <button onClick={handleReset} className="mt-4 underline text-sm">
                                필터 초기화
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
