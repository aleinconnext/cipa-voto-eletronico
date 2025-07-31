import { cn } from "@/lib/utils";
import { useUrnaAudio } from "@/hooks/useUrnaAudio";

interface UrnaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'number' | 'white' | 'orange' | 'confirm' | 'finalizar';
  disabled?: boolean;
  className?: string;
}

export const UrnaButton = ({ 
  children, 
  onClick, 
  variant = 'number', 
  disabled = false,
  className 
}: UrnaButtonProps) => {
  const { playKeySound, playConfirmSound, playFinalizarSound } = useUrnaAudio();

  const handleClick = () => {
    if (!disabled) {
      // Tocar som específico baseado no tipo de botão
      switch (variant) {
        case 'confirm':
          playConfirmSound();
          break;
        case 'finalizar':
          playFinalizarSound();
          break;
        default:
          playKeySound();
          break;
      }
      onClick?.();
    }
  };

  const baseClasses = "relative rounded-lg font-bold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    number: "bg-urna-button-white text-urna-button-white-foreground border-2 border-gray-300 shadow-button hover:bg-gray-50 text-xl md:text-2xl w-12 h-12 md:w-16 md:h-16",
    white: "bg-urna-button-white text-urna-button-white-foreground border-2 border-gray-300 shadow-button hover:bg-gray-50 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base",
    orange: "bg-urna-button-orange text-urna-button-orange-foreground border-2 border-orange-600 shadow-button hover:bg-orange-500 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base",
    confirm: "bg-primary text-primary-foreground border-2 border-green-700 shadow-button hover:bg-green-600 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg animate-pulse-button",
    finalizar: "bg-red-600 text-white border-2 border-red-700 shadow-button hover:bg-red-700 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg animate-pulse-button"
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
};