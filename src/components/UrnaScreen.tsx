import { cn } from "@/lib/utils";

interface UrnaScreenProps {
  children: React.ReactNode;
  className?: string;
}

export const UrnaScreen = ({ children, className }: UrnaScreenProps) => {
  return (
    <div className={cn(
      "bg-urna-screen text-urna-screen-foreground rounded-lg p-4 md:p-8 shadow-screen border-4 border-gray-800 min-h-[400px] md:min-h-[500px] font-mono",
      className
    )}>
      {children}
    </div>
  );
};