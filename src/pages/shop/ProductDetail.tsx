import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product.ts";
import { getProduct } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);

    //색상 저장 state
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

    //사이즈 선택
    const [selectedSize, setSelectedSize] = useState<string>("");

    //수량 선택
    const [quantity, setQuantity] = useState(1);

    //메인 이미지 관련 state state > URL
    const [mainImage, setMainImage] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const result = await getProduct(Number(id));
                setProduct(result);

                if (result.colors && result.colors.length > 0) {
                        const firstColor = result.colors[0];
                        setSelectedColorId(firstColor.id);
                        if (firstColor.images.length > 0) {
                            setMainImage(firstColor.images[0].url);
                        }
                }

            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(() => {});
    }, [id]);

    if (loading) return <div className={twMerge("py-40","text-center")}>Loading...</div>
    if (!product) return <div className={twMerge("py-40", "text-center")}>상품 정보가 없습니다.</div>

    const currentColor = product.colors.find(color => color.id === selectedColorId);

    return (
        <>
            <div className={twMerge("w-full", "max-w-350", "mx-auto", "py-40")}>
                {/*상단 상품 정보*/}
                <div className={twMerge("flex","gap-14")}>
                    {/*이미지*/}
                    <div className={twMerge("w-2/3","space-y-3")}></div>
                    {/*큰 이미지박스*/}
                    <MainImageBox product={product} mainImage={mainImage} />

                    {/*작은 이미지 박스*/}

                    {/*상품정보*/}
                    <div className={"w-1/3"}></div>
                </div>
                {/*상품 상세*/}
                <div></div>
            </div>
        </>
    );
}

export default ProductDetailPage;

interface MainImageBoxProps {
    product: Product;
    mainImage: string;
}

function MainImageBox({product, mainImage}: MainImageBoxProps) {
    return <div className={twMerge("aspect-4/5","w-full","bg-gray-50","overflow-hidden","relative")}>
        {mainImage ? (
            <img src={mainImage} alt={"Main"} className={twMerge("w-full","h-full","object-cover")} />
        ) : (
            <div className={twMerge("w-full","h-full","flex","items-center","justify-center","text-gray-300")}>
                No Image
            </div>
        )}

        {/*뱃지*/}
        <div className={twMerge("absolute","top-4","left-4",["flex","gap-2"])}>
            {product.isBest && (
                <span className={twMerge("bg-white", "text-xs","font-bold","px-2","py-1")}>BEST</span>
            )}
            {product.isNew && (
                <span className={twMerge("bg-white", "text-xs","font-bold","px-2","py-1")}>New</span>
            )}
        </div>
    </div>
}