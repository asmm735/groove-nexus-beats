
import { Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const NowPlaying = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-lg border-t border-white/10">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded" />
          <div>
            <p className="text-sm font-medium text-white">No song playing</p>
            <p className="text-xs text-gray-400">Select a song to play</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform">
              <Play size={20} className="text-black ml-1" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
          <div className="w-96">
            <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 size={20} className="text-gray-400" />
          <div className="w-24">
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
        </div>
      </div>
    </div>
  );
};
