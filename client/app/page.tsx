import RoomMenu from "@/components/ui/RoomMenu";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <main className="3xl:flex 3xl:justify-center h-screen">
      <div className="3xl:w-[1800px] h-full global-x-padding flex flex-col pb-10">
        <Navbar />

        <div className="flex-1 flex  justify-center items-center">
          <div className="text-center max-w-[75ch]">
            <h1 className="text-4xl sm:text-2xl leading-[2.6rem] sm:mb-4 mb-6">
              Premium video meetings. Now free for everyone
            </h1>
            <p className="text-zinc-400 mb-10 sm:text-xs">
              Empowering Collaboration: Seamless video meetings, now free for
              all! Connect and communicate effortlessly, breaking barriers for
              teams, friends, and families. Embrace a new era of dynamic virtual
              gatherings
            </p>

            <RoomMenu />
          </div>
        </div>
      </div>
    </main>
  );
}
