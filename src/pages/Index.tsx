
import { Search } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { NowPlaying } from "@/components/NowPlaying";
import { MusicGrid } from "@/components/MusicGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-24">
        <div className="sticky top-0 bg-black/95 backdrop-blur-lg z-10 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              className="w-full bg-zinc-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1DB954] placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          <MusicGrid />
        </div>
      </main>

      <NowPlaying />
    </div>
  );
};

export default Index;
