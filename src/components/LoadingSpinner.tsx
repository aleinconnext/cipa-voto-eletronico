import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-jurunense-gray border-t-jurunense-secondary",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-jurunense-gray font-medium">
          {text}
        </p>
      )}
    </div>
  );
};
