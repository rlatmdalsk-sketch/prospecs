import { Link } from "react-router";
import type { Product } from "../../types/product";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    // 썸네일: 첫 번째 색상의 첫 번째 이미지
    const thumbnail = product.colors?.[0]?.images?.[0]?.url;
    // 사용 가능한 색상 개수
    const colorCount = product.colors?.length || 0;

    return (
        <div className="group relative flex flex-col gap-2">
            {/* 1. 이미지 영역 */}
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-sm relative">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 text-sm">
                        No Image
                    </div>
                )}

                {/* 배지 (왼쪽 상단) */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                        <span className="bg-white/90 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
                            New
                        </span>
                    )}
                    {product.isBest && (
                        <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
                            Best
                        </span>
                    )}
                </div>
            </div>

            {/* 2. 텍스트 정보 */}
            <div className="space-y-1 mt-1">
                {/* 브랜드/성별 등 (생략 가능) */}
                <p className="text-xs text-gray-500 font-medium">
                    {product.gender === "COMMON"
                        ? "남녀공용"
                        : product.gender === "MALE"
                          ? "남성"
                          : "여성"}
                </p>

                {/* 상품명 */}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:underline decoration-1 underline-offset-2">
                    <Link to={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </Link>
                </h3>

                {/* 가격 */}
                <p className="text-base font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                </p>

                {/* 색상 정보 (색상 칩) */}
                {colorCount > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        {product.colors.slice(0, 5).map(color => (
                            <div
                                key={color.id}
                                className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor: color.hexCode || "#fff" }}
                                title={color.colorName}
                            />
                        ))}
                        {colorCount > 5 && (
                            <span className="text-[10px] text-gray-400">+{colorCount - 5}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
