import MainVisual from "../components/home/MainVisual";
import MainSecondSection from "../components/home/MainSecondSection.tsx";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <div className="flex-1 w-full min-w-0 overflow-x-hidden">
                {/* 1. 메인 비주얼 (Swiper 적용됨) */}
                <MainVisual />

                {/* 2. 서브 배너 (.sec1) - MEN / WOMEN */}
                <MainSecondSection />

                {/* 3. 상품 큐레이션 (소스의 .sec2 부분 - 추후 개발 영역) */}
                <section className="container mx-auto px-4 py-20">
                    <h3 className="text-3xl font-black italic mb-6">SHOES</h3>
                    <div className="border border-dashed border-gray-300 h-60 flex items-center justify-center text-gray-400">
                        상품 리스트 Swiper 영역 (개발 예정)
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
