
import { Play } from "lucide-react";

const albums = [
  {
    title: "Album One",
    artist: "Artist One",
    cover: "bg-gradient-to-br from-purple-500 to-pink-500"
  },
  {
    title: "Album Two",
    artist: "Artist Two",
    cover: "bg-gradient-to-br from-blue-500 to-green-500"
  },
  {
    title: "Album Three",
    artist: "Artist Three",
    cover: "bg-gradient-to-br from-yellow-500 to-red-500"
  },
  {
    title: "Album Four",
    artist: "Artist Four",
    cover: "bg-gradient-to-br from-green-500 to-blue-500"
  },
  {
    title: "Album Five",
    artist: "Artist Five",
    cover: "bg-gradient-to-br from-red-500 to-purple-500"
  },
  {
    title: "Album Six",
    artist: "Artist Six",
    cover: "bg-gradient-to-br from-pink-500 to-yellow-500"
  }
];

export const MusicGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {albums.map((album, index) => (
        <div key={index} className="group bg-zinc-900/90 p-4 rounded-xl hover:bg-zinc-800/90 transition-all">
          <div className={`aspect-square rounded-lg ${album.cover} relative overflow-hidden mb-4`}>
            <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg">
              <Play size={20} className="text-black ml-1" />
            </button>
          </div>
          <h3 className="font-medium text-white truncate">{album.title}</h3>
          <p className="text-sm text-gray-400 truncate">{album.artist}</p>
        </div>
      ))}
    </div>
  );
};
