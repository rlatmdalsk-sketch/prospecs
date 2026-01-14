import { twMerge } from "tailwind-merge";
import MainVisual from "../components/home/mainVisual.tsx";

function Home() {
    return <>
        <div className={twMerge("min-h-screen","flex","flex-col")}>
            <MainVisual />
        </div>
    </>
}

export default Home;