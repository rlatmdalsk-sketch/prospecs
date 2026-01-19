import type { Product } from "../../types/product.ts";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const thumbnail = product.colors[0].images[0].url;
    return (
        <Link to={`/products/${product.id}`}
            className={twMerge(
                ["group", "relative", "aspect-[3/4]", "overflow-hidden"],
                ["flex", "flex-col", "gap-2"],
            )}>
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt={product.name}
                    className={twMerge(
                        ["w-full", "h-full", "object-cover", "object-center"],
                        ["group-hover:scale-105", "transition-all", "duration-300"],
                    )}
                />
            ) : (
                <div className={twMerge("flex", "justify-center", "items-center")}>No image</div>
            )}

            {/* 배지 */}
            <div className={twMerge("absolute", "left-3", "top-3", "flex", "gap-3")}>
                {product.isBest && (
                    <span
                        className={twMerge(
                            "bg-blue-100",
                            "p-2",
                            "text-sm",
                            "uppercase",
                            "rounded-full",
                        )}>
                        Best
                    </span>
                )}
                {product.isNew && (
                    <span
                        className={twMerge(
                            "bg-blue-100",
                            "p-2",
                            "text-sm",
                            "uppercase",
                            "rounded-full",
                        )}>
                        New
                    </span>
                )}
            </div>
            {/*텍스트 정보*/}
            <div className={twMerge("space-y-2")}>
                <p className={twMerge("text-us","text-gray-500","font-medium")}>
                    {product.gender === "COMMON" ? "남여공용" : product.gender === "MALE" ? "남성" : "여성"}
                    <h3 className={twMerge("text-sm","font-medium","text-gray-900")}>
                        {product.name}
                    </h3>
                    <p className={twMerge("text-base","text-gray-900","text-bold")}>
                        {product.price.toLocaleString()}원
                    </p>
                </p>
                <div className={twMerge("flex","items-center","gap-2")}>
                    {product.colors.map(color => (
                        <div
                            key={color.id}
                            className={twMerge("w-3","h-3","rounded-full")}
                            style={{backgroundColor: color.hexCode || "#fff"}}
                        />
                    ))}
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
