import { twMerge } from "tailwind-merge";
import MainVisual from "../components/home/mainVisual.tsx";
import MainSecondSection from "../components/home/MainSecondSection.tsx";

function Home() {
    return <>
        <div className={twMerge("min-h-screen","flex","flex-col")}>
            <MainVisual />
            <MainSecondSection />
        </div>
    </>
}

export default Home;