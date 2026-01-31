import { Sparkles } from 'lucide-react';
import glossLogo from 'figma:asset/6a4e64c69d84356d6cb8df76ab71188bc98ed82e.png';

interface MinimizedButtonProps {
  onClick: () => void;
}

export function MinimizedButton({ onClick }: MinimizedButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-[999999] w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group overflow-hidden"
      aria-label="Open Gloss panel"
    >
      <img 
        src={glossLogo} 
        alt="Gloss" 
        className="w-full h-full object-cover rounded-full"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
    </button>
  );
}