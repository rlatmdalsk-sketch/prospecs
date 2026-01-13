import { twMerge } from "tailwind-merge";

function Home() {
    return <div className={twMerge(["h-[200dvh]", "bg-green-500"])}>Home</div>;
}

export default Home;
