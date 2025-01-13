import { Heart } from "lucide-react";
import { useBreakpoint } from '@/utils/hooks/use-breakpoints';

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
}

export const LikeButton = ({ isLiked, onClick }: LikeButtonProps) => {
  const { isMobile, isTablet } = useBreakpoint();
  const size = isMobile ? 22 : isTablet ? 28 : 36;

  return (
    <button 
      onClick={onClick}
      className={`p-1 sm:p-1.5 lg:p-2 rounded-full transition-all duration-300 ${
        isLiked ? 'text-adaptive-accent' : 'text-adaptive-secondary hover:text-adaptive-accent'
      }`}
    >
      <Heart 
        size={size}
        className="transition-all duration-300"
        fill={isLiked ? 'currentColor' : 'none'}
      />
    </button>
  );
};