
import { Home, Search, Library, PlusSquare, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => (
  <button className={cn(
    "flex items-center gap-4 px-3 py-2 w-full rounded-lg transition-colors",
    "hover:bg-white/10",
    active && "text-white bg-white/10",
    !active && "text-gray-400"
  )}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-black p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2 px-3">
        <div className="h-3 w-3 bg-[#1DB954] rounded-full" />
        <h1 className="text-white font-bold text-xl">Melodify</h1>
      </div>
      
      <nav className="flex flex-col gap-2">
        <NavItem icon={<Home size={24} />} label="Home" active />
        <NavItem icon={<Search size={24} />} label="Search" />
        <NavItem icon={<Library size={24} />} label="Your Library" />
      </nav>

      <div className="mt-6">
        <div className="space-y-2">
          <NavItem icon={<PlusSquare size={24} />} label="Create Playlist" />
          <NavItem icon={<Heart size={24} />} label="Liked Songs" />
        </div>
      </div>
    </aside>
  );
};
