import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import type { Product } from "../../../types/product.ts";
import useModalStore from "../../../store/useModalStore.tsx";
import { deleteAdminProduct, getAdminProducts } from "../../../api/admin.product.api.ts";
import Button from "../../../components/common/Button.tsx";

const AdminProductList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { openModal } = useModalStore();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, page: 1, lastPage: 1 });

    const page = Number(searchParams.get("page")) || 1;

    const fetchProducts = async (pageNum: number) => {
        try {
            setLoading(true);
            // [Fix] API 정의에 맞춰 객체 형태로 전달 ({ page, limit })
            const data = await getAdminProducts({
                page: pageNum,
                limit: 10,
            });
            setProducts(data.data);
            setMeta(data.meta);
        } catch (error) {
            console.error(error);
            alert("상품 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > meta.lastPage) return;
        setSearchParams({ page: String(newPage) });
    };

    const handleDeleteClick = (id: number, name: string) => {
        openModal("CONFIRM", {
            title: "상품 삭제",
            message: `'${name}' 상품을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
            isDanger: true,
            onConfirm: async () => {
                try {
                    await deleteAdminProduct(id);
                    alert("삭제되었습니다.");
                    fetchProducts(page);
                } catch (error) {
                    if (error instanceof AxiosError) {
                        alert(error.response?.data?.message || "삭제 실패");
                    } else {
                        alert("삭제 중 오류가 발생했습니다.");
                    }
                }
            },
        });
    };

    if (loading) return <div className="p-8">로딩 중...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">상품 관리</h2>
                <Button variant="primary" size="sm" onClick={() => navigate("/admin/products/new")}>
                    + 상품 등록
                </Button>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-medium">정보</th>
                            <th className="px-6 py-4 font-medium">카테고리</th>
                            {/* [New] 성별/종류 컬럼 추가 */}
                            <th className="px-6 py-4 font-medium">성별 / 종류</th>
                            <th className="px-6 py-4 font-medium">판매가</th>
                            <th className="px-6 py-4 font-medium">옵션(색상)</th>
                            <th className="px-6 py-4 font-medium text-center">상태</th>
                            <th className="px-6 py-4 font-medium text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length > 0 ? (
                            products.map(product => {
                                const thumbnail = product.colors?.[0]?.images?.[0]?.url;

                                return (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                            No Img
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 mb-1">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {product.colors?.[0]?.productCode} 등
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {product.category?.name}
                                        </td>
                                        {/* [New] 성별/종류 데이터 표시 */}
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="text-xs font-bold text-gray-400 mb-0.5">
                                                {product.gender}
                                            </div>
                                            <div className="text-sm">{product.style}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {product.price.toLocaleString()}원
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {product.colors.map(color => (
                                                    <span
                                                        key={color.id}
                                                        className="inline-block w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                                        style={{
                                                            backgroundColor:
                                                                color.hexCode || "#fff",
                                                        }}
                                                        title={color.colorName}
                                                    />
                                                ))}
                                                {product.colors.length === 0 && (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1 block">
                                                총 {product.colors.length}개 컬러
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col gap-1 items-center">
                                                {product.isNew && (
                                                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">
                                                        NEW
                                                    </span>
                                                )}
                                                {product.isBest && (
                                                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                                                        BEST
                                                    </span>
                                                )}
                                                {!product.isNew && !product.isBest && (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/admin/products/${product.id}`}
                                                    className="px-3 py-1.5 text-xs font-bold border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
                                                    수정
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="h-[30px] px-3 text-xs"
                                                    onClick={() =>
                                                        handleDeleteClick(product.id, product.name)
                                                    }>
                                                    삭제
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                    등록된 상품이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {meta.total > 0 && (
                    <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-100">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
                            이전
                        </button>
                        <span className="text-sm text-gray-600 font-medium px-2">
                            Page {page} of {meta.lastPage}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === meta.lastPage}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductList;
