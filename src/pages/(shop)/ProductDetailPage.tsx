import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProductDetail } from "../../api/product.api";
import type { Product, ProductColor, ProductImage } from "../../types/product";
import Button from "../../components/common/Button.tsx";
import Accordion from "../../components/common/Accordion.tsx";
import { twMerge } from "tailwind-merge";
import useCartStore from "../../store/useCartStore.ts";
import useAuthStore from "../../store/useAuthStore.ts";
import useOrderStore from "../../store/useOrderStore.ts";
import type { CartItem } from "../../types/cart.ts";
import ProductReviews from "../../components/product/ProductReview.tsx";

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); // 페이지 이동용
    const { addItem } = useCartStore();
    const { isLoggedIn } = useAuthStore();
    const { setOrderItems } = useOrderStore();

    // 상태 관리
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // 선택 옵션
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("");

    const [quantity, setQuantity] = useState<number>(1);

    // 메인 이미지 (색상 변경 시 변경됨)
    const [mainImage, setMainImage] = useState<string>("");

    // 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const data = await getProductDetail(Number(id));
                setProduct(data);

                // 초기값: 첫 번째 색상 선택
                if (data.colors && data.colors.length > 0) {
                    const firstColor = data.colors[0];
                    setSelectedColorId(firstColor.id);
                    if (firstColor.images.length > 0) {
                        setMainImage(firstColor.images[0].url);
                    }
                }
            } catch (error) {
                console.error("상품 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData().then(() => {});
    }, [id]);

    if (loading) return <div className="py-40 text-center">Loading...</div>;
    if (!product) return <div className="py-40 text-center">상품 정보가 없습니다.</div>;

    // 현재 선택된 색상 데이터
    const currentColor = product.colors.find(c => c.id === selectedColorId);

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            const confirmLogin = window.confirm(
                "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
            );
            if (confirmLogin) {
                navigate("/auth/login");
            }
            return;
        }
        if (!selectedSize || !currentColor) {
            alert("사이즈를 선택해주세요.");
            return;
        }

        // 선택된 사이즈의 고유 ID(productSizeId) 찾기
        const targetSizeObj = currentColor.sizes.find(s => s.size === selectedSize);
        if (!targetSizeObj) {
            alert("유효하지 않은 사이즈입니다.");
            return;
        }

        // 품절 체크
        if (targetSizeObj.stock <= 0) {
            alert("품절된 상품입니다.");
            return;
        }

        try {
            // 스토어 함수 호출
            await addItem(targetSizeObj.id, quantity);

            // 성공 후 사용자 확인
            if (window.confirm("장바구니에 상품을 담았습니다.\n장바구니로 이동하시겠습니까?")) {
                navigate("/cart");
            }
        } catch (error) {
            console.error(error);
            alert("장바구니 담기에 실패했습니다.");
        }
    };

    const handleBuyNow = () => {
        // 1. 로그인 체크
        if (!isLoggedIn) {
            if (
                window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")
            ) {
                navigate("/auth/login");
            }
            return;
        }

        // 2. 옵션 선택 확인
        if (!selectedSize || !currentColor) {
            alert("사이즈를 선택해주세요.");
            return;
        }

        // 3. 사이즈 객체 찾기 (ID 및 재고 확인용)
        const targetSizeObj = currentColor.sizes.find(s => s.size === selectedSize);
        if (!targetSizeObj) {
            alert("유효하지 않은 사이즈입니다.");
            return;
        }

        // 4. 품절 체크
        if (targetSizeObj.stock < quantity) {
            alert(`재고가 부족합니다. (남은 수량: ${targetSizeObj.stock}개)`);
            return;
        }

        const mockCartItem: CartItem = {
            id: -1, // 임시 ID (DB 장바구니에 없으므로)
            quantity: quantity,
            productSize: {
                id: targetSizeObj.id,
                size: targetSizeObj.size,
                stock: targetSizeObj.stock,
                productColor: {
                    colorName: currentColor.colorName,
                    images: currentColor.images, // 이미지 배열 그대로 전달
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                    },
                },
            },
        };

        // 스토어에 저장하고 이동
        setOrderItems([mockCartItem]);
        navigate("/order");
    };

    return (
        <div className="w-full max-w-350 mx-auto px-4 md:px-0 py-40 text-gray-900">
            {/* [상단 영역] 이미지(좌) vs 정보(우) */}
            <div className="flex flex-col md:flex-row gap-10 lg:gap-14">
                {/* 1. 왼쪽: 이미지 갤러리 */}
                <div className="w-full md:w-[65%] space-y-3">
                    {/* 메인 이미지 */}
                    <MainImageBox product={product} mainImage={mainImage} />

                    {/* 썸네일 리스트 (현재 색상의 추가 이미지들) */}
                    {currentColor && currentColor.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {currentColor.images.map((img, idx) => (
                                <ThumbnailBox
                                    img={img}
                                    mainImage={mainImage}
                                    setMainImage={setMainImage}
                                    key={idx}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. 오른쪽: 상품 정보 및 옵션 */}
                <div className="w-full md:w-[35%] flex flex-col pt-2">
                    {/* 헤더 정보 */}
                    <RightHeaderBox product={product} currentColor={currentColor} />

                    {/* 옵션 선택 영역 */}
                    <div className="py-6 space-y-6">
                        {/* (1) 색상 선택 (이미지로 보여주기) */}
                        <RightColorSelectBox
                            product={product}
                            currentColor={currentColor}
                            selectedColorId={selectedColorId}
                            setSelectedColorId={setSelectedColorId}
                            setSelectedSize={setSelectedSize}
                            setMainImage={setMainImage}
                        />

                        {/* (2) 사이즈 선택 */}
                        <RightSizeSelectBox
                            currentColor={currentColor}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                        />

                        {/* 구매 버튼 */}
                        <RightActionBox
                            price={product.price}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />

                        <RightAccordionBox product={product} />
                    </div>
                </div>
            </div>

            {/* 상세 이미지/설명 영역 */}
            <div id="detail" className="max-w-215 mx-auto mt-24">
                {/* 에디터로 작성된 HTML 내용 */}
                <div
                    className="prose max-w-none mb-20 text-center"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />
            </div>

            <ProductReviews productId={product.id} />
        </div>
    );
};

export default ProductDetailPage;

interface MainImageBoxProps {
    product: Product;
    mainImage: string;
}

function MainImageBox({ mainImage, product }: MainImageBoxProps) {
    return (
        <div className="aspect-4/5 w-full bg-gray-50 overflow-hidden relative">
            {mainImage ? (
                <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No Image
                </div>
            )}
            {/* 배지 표시 */}
            <div className="absolute top-4 left-4 flex gap-1">
                {product.isNew && (
                    <span className="bg-white text-xs font-bold px-2 py-1 shadow-sm">NEW</span>
                )}
                {product.isBest && (
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 shadow-sm">
                        BEST
                    </span>
                )}
            </div>
        </div>
    );
}

interface ThumbnailBoxProps {
    img: ProductImage;
    mainImage: string;
    setMainImage: Dispatch<SetStateAction<string>>;
}

function ThumbnailBox({ img, mainImage, setMainImage }: ThumbnailBoxProps) {
    return (
        <button
            onMouseEnter={() => setMainImage(img.url)}
            onClick={() => setMainImage(img.url)}
            className={`w-20 h-24 bg-gray-50 overflow-hidden border ${
                mainImage === img.url ? "border-black" : "border-transparent"
            }`}>
            <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
        </button>
    );
}

interface RightHeaderBoxProps {
    product: Product;
    currentColor: ProductColor | undefined;
}

function RightHeaderBox({ product, currentColor }: RightHeaderBoxProps) {
    return (
        <div className="border-b border-gray-200 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="text-xs text-gray-500">{currentColor?.productCode}</div>
            <div className="mt-6">
                <span className="text-2xl font-bold text-gray-900">
                    {product.price.toLocaleString()}
                </span>
                <span className="text-lg font-medium ml-1">원</span>
            </div>
        </div>
    );
}

interface RightColorSelectBoxProps {
    product: Product;
    currentColor: ProductColor | undefined;
    selectedColorId: number | null;
    setSelectedColorId: Dispatch<SetStateAction<number | null>>;
    setSelectedSize: Dispatch<SetStateAction<string>>;
    setMainImage: Dispatch<SetStateAction<string>>;
}

function RightColorSelectBox({
    product,
    currentColor,
    selectedColorId,
    setSelectedColorId,
    setSelectedSize,
    setMainImage,
}: RightColorSelectBoxProps) {
    return (
        <div>
            <div className="text-sm font-bold mb-3">
                색상
                <span className="text-gray-500 font-normal ml-2">{currentColor?.colorName}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {product.colors.map(color => {
                    const thumb = color.images[0]?.url;
                    const isSelected = selectedColorId === color.id;
                    return (
                        <button
                            key={color.id}
                            onClick={() => {
                                setSelectedColorId(color.id);
                                setSelectedSize(""); // 색상 변경 시 사이즈 리셋
                                if (thumb) setMainImage(thumb);
                            }}
                            className={`w-16 h-16 border overflow-hidden relative ${
                                isSelected
                                    ? "border-black border-2"
                                    : "border-gray-200 hover:border-gray-400"
                            }`}
                            title={color.colorName}>
                            {thumb ? (
                                <img
                                    src={thumb}
                                    alt={color.colorName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full bg-gray-200"
                                    style={{ backgroundColor: color.hexCode }}
                                />
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

function RightSizeSelectBox({
    currentColor,
    selectedSize,
    setSelectedSize,
}: RightSizeSelectBoxProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3 text-sm font-bold">사이즈</div>
            <div className="flex flex-wrap gap-2">
                {currentColor?.sizes.map(s => {
                    const isSoldOut = s.stock <= 0;
                    const isSelected = selectedSize === s.size;
                    return (
                        <button
                            key={s.id}
                            disabled={isSoldOut}
                            onClick={() => setSelectedSize(s.size)}
                            // [수정] flex 사용 시 버튼 크기 확보를 위해 min-w-[3rem]과 px-3 추가
                            className={`h-10 w-12.6 px-3 text-sm border transition-colors ${
                                isSelected
                                    ? "border-black bg-black text-white"
                                    : isSoldOut
                                      ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through decoration-gray-300"
                                      : "border-gray-300 text-gray-700 hover:border-black"
                            }`}>
                            {s.size}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface RightActionBoxProps {
    price: number;
    quantity: number;
    setQuantity: Dispatch<SetStateAction<number>>;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

function RightActionBox({
    price,
    quantity,
    setQuantity,
    onAddToCart,
    onBuyNow,
}: RightActionBoxProps) {
    const handleQuantity = (type: "plus" | "minus") => {
        if (type === "plus") {
            setQuantity(prev => prev + 1);
        } else {
            setQuantity(prev => (prev > 1 ? prev - 1 : 1));
        }
    };

    return (
        <div className="space-y-6 pt-4 border-t border-gray-100">
            {/* 수량 및 총 금액 */}
            <div className="bg-gray-50 p-5 rounded-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-700">수량</span>
                    <div className="flex items-center bg-white border border-gray-300">
                        <button
                            onClick={() => handleQuantity("minus")}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600">
                            -
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm font-bold border-x border-gray-300">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantity("plus")}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600">
                            +
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                    <span className="font-bold text-gray-900">총 상품금액</span>
                    <div>
                        <span className="text-2xl font-extrabold text-orange-600">
                            {(price * quantity).toLocaleString()}
                        </span>
                        <span className="text-sm font-medium ml-1">원</span>
                    </div>
                </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col gap-3">
                <Button size="lg" onClick={onBuyNow} className="w-full py-4 text-lg">
                    바로구매
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={onAddToCart}
                    className="w-full py-4 text-lg">
                    장바구니
                </Button>
            </div>
        </div>
    );
}

interface RightAccordionBoxProps {
    product: Product;
}

function RightAccordionBox({ product }: RightAccordionBoxProps) {
    return (
        <div className={twMerge(["flex", "flex-col"])}>
            {/* 상품 설명 */}
            <Accordion title={"상품 설명"}>{product.summary}</Accordion>

            {/* 상품 정보 고시 (테이블) */}
            <Accordion title={"상품 정보 고시"}>
                <table className="w-full text-xs text-left">
                    <colgroup>
                        <col className="w-32 sm:w-40" /> {/* th 너비 고정 */}
                        <col />
                    </colgroup>
                    <tbody>
                        {/* 각 행: 배경색 없이 텍스트와 하단 라인만 유지 */}
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
                            <td className="py-3 text-gray-600">
                                {product.qualityAssurance || "-"}
                            </td>
                        </tr>
                        <tr>
                            <th className="py-3 font-medium text-gray-900">A/S 책임자/전화번호</th>
                            <td className="py-3 text-gray-600">{product.asPhone || "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </Accordion>
        </div>
    );
}
