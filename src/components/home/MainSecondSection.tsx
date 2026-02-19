import men from "../../assets/home/main_men.png";
import women from "../../assets/home/main_women.png";

function MainSecondSection() {
    return (
        <section className="w-full">
            <div className="flex h-50 md:h-150">
                <div className="w-full relative group overflow-hidden cursor-pointer">
                    <div
                        className={`absolute inset-0 bg-gray-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-105`}
                        style={{backgroundImage: `url(${men})`}}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter border-b-2 border-transparent group-hover:border-white transition-all pb-1">
                            MEN
                        </span>
                    </div>
                </div>
                <div className="w-full relative group overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gray-300 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{backgroundImage: `url(${women})`}}/>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter border-b-2 border-transparent group-hover:border-white transition-all pb-1">
                            WOMEN
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MainSecondSection;
