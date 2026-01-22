import { useNavigate, useParams } from "react-router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { Product, ProductColor, ProductImage } from "../../types/product.ts";
import { getProduct } from "../../api/product.api.ts";
import { twMerge } from "tailwind-merge";
import Button from "../../components/common/Button.tsx";
import Acordion from "../../components/common/Acordion.tsx";
import useCartStore from "../../stores/useCartStore.ts";
import useAuthStore from "../../stores/useAuthStore.ts";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCartStore();
    const { isLoggedIn } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);

    // 색상 저장 state
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

    // 메인 이미지 관련 state > URL
    const [mainImage, setMainImage] = useState<string>("");

    // 사이즈 선택 state
    const [selectedSize, setSelectedSize] = useState<string>("");

    // 수량 선택 state
    const [quantity, setQuantity] = useState(1);

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

    if (loading) return <div className={twMerge(["py-40", "text-center"])}>Loading...</div>;
    if (!product)
        return <div className={twMerge(["py-40", "text-center"])}>상품 정보가 없습니다.</div>;

    // 화면에다 출력해줄 정보는 color에 종속되어 있고, color가 굉장히 많은 정보를 갖고 있음
    const currentColor = product.colors.find(color => color.id === selectedColorId);

    const handleAddTocart = async () => {
        if (!isLoggedIn) {
            const confirmLogin = window.confirm(
                "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?",
            );
            if (!confirmLogin) {
                navigate("/login");
            }
            return;
        }

        if (!selectedSize || !currentColor) {
            alert("사이즈를 선택해주세요.");
            return;
        }
        const targetSizeObj = currentColor.sizes.find(size => size.size === selectedSize);
        if (!targetSizeObj) {
            alert("유효하지 않은 사이즈입니다.");
            return;
        }
        if (targetSizeObj.stock <= 0) {
            alert ("품절된 상품입니다.");
            return;
        }

        try {
            await addItem(targetSizeObj.id.quantity);
            if (window.confirm("장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?")){
                navigate("/cart");
            }
        } catch (e) {
            console.log(e);
            alert("장바구니 담기에 실패했습니다.");
        }

    };

    return (
        <div className={twMerge(["w-full", "max-w-350", "mx-auto", "py-40"])}>
            {/* 상단 상품 정보 */}
            <div className={twMerge(["flex", "gap-14"])}>
                {/* 왼쪽 (이미지) */}
                <div className={twMerge(["w-2/3", "space-y-3"])}>
                    {/* 큰 이미지 박스 */}
                    <MainImageBox product={product} mainImage={mainImage} />
                    {/* 작은 이미지가 한 줄로 들어가는 박스 */}
                    {currentColor && currentColor.images.length > 1 && (
                        <div className={twMerge(["flex", "gap-2", "overflow-x-auto"])}>
                            {currentColor.images.map((image, index) => (
                                <ThumbnailBox
                                    key={index}
                                    mainImage={mainImage}
                                    setMainImage={setMainImage}
                                    image={image}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 오른쪽 (상품 정보) */}
                <div className={twMerge(["w-1/3", "space-y-6"])}>
                    {/* 상품 대표 정보 */}
                    <RightHeaderBox product={product} currentColor={currentColor} />

                    {/* 옵션 선택 영역 */}
                    <RightColorSelectBox
                        product={product}
                        currentColor={currentColor}
                        selectedColorId={selectedColorId}
                        setSelectedColorId={setSelectedColorId}
                        setMainImage={setMainImage}
                        setSelectedSize={setSelectedSize}
                    />

                    <RightSizeSelecetBox
                        currentColor={currentColor}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                    />

                    <RightQuantitySelectBox
                        price={product.price}
                        quantity={quantity}
                        setQuantity={setQuantity}
                    />
                    <div className={twMerge("flex", "flex-col", "gap-3")}>
                        <Button size={"lg"}>바로구매</Button>
                        <Button size={"lg"} variant={"secondary"} onClick={handleAddTocart}>
                            장바구니
                        </Button>
                    </div>
                    <Acordion title={"상품 설명"}>{product.summary}</Acordion>
                    <Acordion title={"상품 정보 고시"}>
                        <RightInformation product={product} />
                    </Acordion>
                </div>
            </div>

            {/* 상품 상세 */}
            <div
                className={twMerge("mx-auto", "max-w-215", "mt-24")}
                dangerouslySetInnerHTML={{ __html: product.description }}></div>
        </div>
    );
}

export default ProductDetailPage;

interface MainImageBoxProps {
    product: Product;
    mainImage: string;
}

function MainImageBox({ product, mainImage }: MainImageBoxProps) {
    return (
        <div
            className={twMerge(
                ["aspect-4/5", "w-full", "overflow-hidden", "relative"],
                ["bg-gray-50"],
            )}>
            {/* 이미지 */}
            {mainImage ? (
                <img
                    src={mainImage}
                    alt={"Main"}
                    className={twMerge(["w-full", "h-full", "object-cover"])}
                />
            ) : (
                <div
                    className={twMerge(
                        ["w-full", "h-full"],
                        ["flex", "items-center", "justify-center", "text-gray-300"],
                    )}>
                    No Image
                </div>
            )}

            {/* 뱃지 */}
            <div className={twMerge(["absolute", "top-4", "left-4"], ["flex", "gap-2"])}>
                {product.isBest && (
                    <span className={twMerge(["bg-white", "text-xs", "font-bold", "px-2", "py-1"])}>
                        BEST
                    </span>
                )}
                {product.isNew && (
                    <span className={twMerge(["bg-white", "text-xs", "font-bold", "px-2", "py-1"])}>
                        NEW
                    </span>
                )}
            </div>
        </div>
    );
}

interface ThumbnailBoxProps {
    image: ProductImage;
    mainImage: string;
    setMainImage: Dispatch<SetStateAction<string>>;
}

function ThumbnailBox({ image, mainImage, setMainImage }: ThumbnailBoxProps) {
    return (
        <button
            onMouseEnter={() => setMainImage(image.url)}
            className={twMerge(
                ["w-20", "h-24", "bg-gray-50", "overflow-hidden"],
                ["border"],
                mainImage === image.url ? "border-black" : "border-transparent",
            )}>
            <img
                src={image.url}
                alt={"thumb"}
                className={twMerge(["w-full", "h-full", "object-cover"])}
            />
        </button>
    );
}

interface RightHeaderBoxProps {
    product: Product;
    currentColor: ProductColor | undefined;
}

function RightHeaderBox({ product, currentColor }: RightHeaderBoxProps) {
    return (
        <div className={twMerge(["border-b", "border-gray-200", "pb-6"])}>
            <h1 className={twMerge(["text-3xl", "font-bold"])}>{product.name}</h1>
            <div className={twMerge(["text-xs", "text-gray-500"])}>{currentColor?.productCode}</div>
            <div className={twMerge(["mt-6"])}>
                <span className={twMerge(["text-2xl", "font-bold", "text-gray-900"])}>
                    {product.price.toLocaleString()}
                </span>
                <span className={twMerge(["text-lg", "font-medium", "ml-1"])}>원</span>
            </div>
        </div>
    );
}

interface RightColorSelectBoxProps {
    product: Product;
    currentColor: ProductColor | undefined;
    selectedColorId: number | null;
    setSelectedColorId: Dispatch<SetStateAction<number | null>>;
    setMainImage: Dispatch<SetStateAction<string>>;
    setSelectedSize: Dispatch<SetStateAction<string>>;
}

function RightColorSelectBox({
    product,
    currentColor,
    selectedColorId,
    setSelectedColorId,
    setMainImage,
    setSelectedSize,
}: RightColorSelectBoxProps) {
    return (
        <div className={twMerge(["w-full"])}>
            <div className={twMerge(["text-sm", "font-bold", "mb-3"])}>
                색상
                <span className={twMerge(["text-gray-500", "ml-2"])}>
                    {currentColor?.colorName}
                </span>
            </div>
            <div className={twMerge(["flex", "flex-wrap", "gap-2"])}>
                {product.colors.map((color, index) => {
                    const thumb = color.images[0]?.url;
                    const isSelected = selectedColorId === color.id;

                    return (
                        <button
                            key={index}
                            className={twMerge(
                                ["w-16", "h-16", "overflow-hidden", "relative"],
                                isSelected
                                    ? ["border-black", "border-2"]
                                    : ["border-gray-200", "border"],
                            )}
                            onClick={() => {
                                setSelectedColorId(color.id);
                                setMainImage(thumb || "");
                                setSelectedSize("");
                            }}>
                            {thumb ? (
                                <img
                                    src={thumb}
                                    alt={color.colorName}
                                    className={twMerge(["w-full", "h-full", "object-cover"])}
                                />
                            ) : (
                                <div className={twMerge("w-full", "h-full", "bg-gray-50")}>
                                    No Image
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface RightSizeSelectBoxProps {
    currentColor: ProductColor | undefined;
    selectedSize: string;
    setSelectedSize: Dispatch<SetStateAction<string>>;
}

function RightSizeSelecetBox({
    currentColor,
    selectedSize,
    setSelectedSize,
}: RightSizeSelectBoxProps) {
    return (
        <div className={twMerge(["w-full"])}>
            <div className={twMerge(["text-sm", "font-bold", "mb-3"])}>사이즈</div>
            <div className={twMerge(["flex", "flex-wrap", "gap-2"])}>
                {currentColor?.sizes.map((size, index) => {
                    const isSoldOut = size.stock <= 0;
                    const isSelected = selectedSize === size.size;

                    return (
                        <button
                            key={index}
                            disabled={isSoldOut}
                            className={twMerge(
                                "h-10 w-[50px] px-3 text-sm border transition-colors",
                                isSelected
                                    ? "bg-black text-white border-black"
                                    : isSoldOut
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                      : "border-gray-300 text-gray-700 hover:border-black",
                            )}
                            onClick={() => setSelectedSize(size.size)}>
                            {size.size}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface RightQuantitySelectBoxProps {
    price: number;
    quantity: number;
    setQuantity: Dispatch<SetStateAction<number>>;
}

function RightQuantitySelectBox({ price, quantity, setQuantity }: RightQuantitySelectBoxProps) {
    const handleQuantity = (type: "plus" | "minus") => {
        if (type === "plus") {
            setQuantity(quantity + 1);
        } else {
            setQuantity(prev => (prev > 1 ? -1 : 1));
        }
    };

    return (
        <div className={twMerge("bg-gray-50", "p-5", "rounded-sm")}>
            <div className={twMerge("flex", "justify-between", "items-center", "mb-4")}>
                <span className={twMerge("text-sm", "font-bold", "text-gray-700")}>수량</span>
                <div className={twMerge("flex", "items-center", "bg-white", "border-gray-300")}>
                    <button
                        className={twMerge([
                            "w-8",
                            "h-8",
                            "flex",
                            "justify-center",
                            "items-center",
                            "text-gray-600",
                        ])}
                        onClick={() => handleQuantity("minus")}>
                        -
                    </button>
                    <span
                        className={twMerge(
                            "w-10",
                            "h-8",
                            "flex",
                            "justify-center",
                            "items-center",
                        )}>
                        {quantity}
                    </span>
                    <button
                        className={twMerge([
                            "w-8",
                            "h-8",
                            "flex",
                            "justify-center",
                            "items-center",
                            "text-gray-600",
                        ])}
                        onClick={() => handleQuantity("plus")}>
                        +
                    </button>
                </div>
            </div>
            <div className={twMerge("flex", "justify-between", "items-center", "pt-4", "border-t")}>
                <span className={twMerge("text-sm", "font-bold", "text-gray-700")}>합계</span>
                <div>
                    <span className={twMerge("text-2xl", "font-extrabold", "text-orange-400")}>
                        {(quantity * price).toLocaleString()}
                    </span>
                    <span className={twMerge("text-xs", "ml-1")}>원</span>
                </div>
            </div>
        </div>
    );
}

interface RightInformationProps {
    product: Product;
}

function RightInformation({ product }: RightInformationProps) {
    return (
        <table className={twMerge("w-full", "text-xs")}>
            <colgroup>
                <col className={"w-40"} />
                <col />
            </colgroup>
            <tbody>
                <tr>
                    <th className="py-3 font-medium text-gray-900">소재</th>
                    <td className="py-3 text-gray-600">{product.material || "-"}</td>
                </tr>
                <tr>
                    <th className="py-3 font-medium text-gray-900">제조사</th>
                    <td className="py-3 text-gray-600">{product.manufacturer || "-"}</td>
                </tr>
                <tr>
                    <th className="py-3 font-medium text-gray-900">제조국</th>
                    <td className="py-3 text-gray-600">{product.originCountry || "-"}</td>
                </tr>
                <tr>
                    <th className="py-3 font-medium text-gray-900">제조년월</th>
                    <td className="py-3 text-gray-600">{product.manufactureDate || "-"}</td>
                </tr>
                <tr>
                    <th className="py-3 font-medium text-gray-900">취급시 주의사항</th>
                    <td className="py-3 text-gray-600 leading-relaxed">
                        {product.careInstructions || "-"}
                    </td>
                </tr>
                <tr>
                    <th className="py-3 font-medium text-gray-900">품질보증기준</th>
                    <td className="py-3 text-gray-600">{product.qualityAssurance || "-"}</td>
                </tr>
                <tr>
                    <th className="py-3 font-medium text-gray-900">A/S 책임자/전화번호</th>
                    <td className="py-3 text-gray-600">{product.asPhone || "-"}</td>
                </tr>
            </tbody>
        </table>
    );
}
