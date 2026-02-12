import { FC, ReactNode, useEffect, useState } from 'react';
import { useThemeStore } from '../stores/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  // console.log('🎨 ThemeProvider render - theme:', theme, 'mounted:', mounted);

  // Only run on client side
  useEffect(() => {
    // console.log('🎨 ThemeProvider mounted');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      // console.log('🎨 Skipping theme apply - not mounted yet');
      return;
    }

    // console.log('🎨 ThemeProvider - applying theme:', theme);
    
    // Apply theme on mount and when theme changes
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      // console.log('🎨 ThemeProvider - Added dark class');
    } else {
      root.classList.remove('dark');
      // console.log('🎨 ThemeProvider - Removed dark class');
    }
    
    // console.log('🎨 ThemeProvider - classList:', root.classList.toString());
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
};

export default ThemeProvider;