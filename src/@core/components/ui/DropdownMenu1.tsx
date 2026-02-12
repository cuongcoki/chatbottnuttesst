// ==================== components/ui/DropdownMenu.tsx ====================
import React, { type ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface DropdownMenuLabelProps {
  children: ReactNode;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

// Context để share state giữa các components
const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: { current: null },
});

// Main DropdownMenu Component
export function DropdownMenu({ children, open, onOpenChange }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// DropdownMenuTrigger
export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(DropdownContext);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: (el: HTMLElement | null) => {
        triggerRef.current = el;
      },
      onClick: handleClick,
      'aria-expanded': isOpen,
      'aria-haspopup': true,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <motion.button
      ref={(el) => {
        triggerRef.current = el;
      }}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup={true}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center justify-center"
    >
      {children}
    </motion.button>
  );
}

// DropdownMenuContent
export function DropdownMenuContent({ 
  children, 
  align = 'start', 
  side = 'bottom',
  className = '' 
}: DropdownMenuContentProps) {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(DropdownContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      // Calculate position based on side
      switch (side) {
        case 'bottom':
          top = triggerRect.bottom + 8;
          break;
        case 'top':
          top = triggerRect.top - (contentRect?.height || 0) - 8;
          break;
        case 'left':
          left = triggerRect.left - (contentRect?.width || 0) - 8;
          top = triggerRect.top;
          break;
        case 'right':
          left = triggerRect.right + 8;
          top = triggerRect.top;
          break;
      }

      // Calculate position based on align
      if (side === 'bottom' || side === 'top') {
        switch (align) {
          case 'start':
            left = triggerRect.left;
            break;
          case 'center':
            left = triggerRect.left + (triggerRect.width - (contentRect?.width || 0)) / 2;
            break;
          case 'end':
            left = triggerRect.right - (contentRect?.width || 0);
            break;
        }
      }

      setPosition({ top, left });
    }
  }, [isOpen, align, side]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  const contentVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: side === 'top' ? 10 : -10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: side === 'top' ? 10 : -10
    }
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            duration: 0.2,
            bounce: 0.1
          }}
          className={`
            absolute z-50 min-w-32 p-1 
            bg-primary-dark border border-primary-light/30 rounded-lg shadow-xl
            ${className}
          `}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

// DropdownMenuItem
export function DropdownMenuItem({ 
  children, 
  onClick, 
  disabled = false,
  className = '' 
}: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setIsOpen(false);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.02, x: 4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        px-3 py-2 text-sm rounded-md cursor-pointer
        transition-colors duration-150
        ${disabled 
          ? 'text-gray-500 cursor-not-allowed' 
          : 'text-primary-light hover:bg-primary-light/20 hover:text-white'
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// DropdownMenuLabel
export function DropdownMenuLabel({ children, className = '' }: DropdownMenuLabelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05, duration: 0.2 }}
      className={`px-3 py-2 text-xs font-semibold text-primary-light uppercase tracking-wide ${className}`}
    >
      {children}
    </motion.div>
  );
}

// DropdownMenuSeparator
export function DropdownMenuSeparator({ className = '' }: DropdownMenuSeparatorProps) {
  return (
    <motion.div 
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.2 }}
      className={`my-1 h-px bg-primary-light/30 origin-left ${className}`} 
    />
  );
}