import { FC, ReactNode } from "react";

interface BackgroundLayoutProps {
  children: ReactNode;
  className?: string;
}

const BackgroundLayout: FC<BackgroundLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`min-h-screen flex relative ${className}`}>
      {/* Light Mode - Simple gradient */}
      <div 
        className="absolute inset-0 -z-10 dark:hidden"
        style={{
          background: "linear-gradient(135deg, #e8f5f0 0%, #e0f2fe 100%)"
        }}
      />

      {/* Dark Mode - Your preferred gradient colors */}
      <div 
        className="hidden dark:block absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #0a2f1f 0%, #0a3d3d 50%, #0a2d4d 100%)"
        }}
      />

      {/* Subtle overlay pattern (optional) */}
      <div 
        className="absolute inset-0 -z-5 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;