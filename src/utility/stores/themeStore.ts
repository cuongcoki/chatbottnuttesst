import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Apply theme to document
const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // console.log('🎨 Applying theme:', theme);
  
  if (theme === 'dark') {
    root.classList.add('dark');
    // console.log('🎨 Added dark class');
  } else {
    root.classList.remove('dark');
    // console.log('🎨 Removed dark class');
  }
  
  // console.log('🎨 Current classList:', root.classList.toString());
};

// Get initial theme safely
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.theme || 'light';
    }
  } catch (error) {
    console.warn('Error reading theme from storage:', error);
  }
  
  return 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // console.log('🎨 toggleTheme called');
        // console.log('🎨 Current theme:', currentTheme);
        // console.log('🎨 New theme:', newTheme);
        
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
      
      setTheme: (theme: Theme) => {
        console.log('🎨 setTheme called with:', theme);
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        // console.log('🎨 Rehydrating theme store...');
        return (state) => {
          // console.log('🎨 Rehydrated state:', state);
          if (state) {
            applyTheme(state.theme);
          }
        };
      },
    }
  )
);