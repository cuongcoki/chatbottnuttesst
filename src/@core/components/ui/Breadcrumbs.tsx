import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home, LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon | ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  homeHref?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  showHome = false,
  homeHref = "/",
  onNavigate,
  className = "",
}: BreadcrumbsProps) {
  const defaultSeparator = (
    <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
  );

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href?: string
  ) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const allItems = showHome
    ? [{ label: "Trang chủ", href: homeHref, icon: Home }, ...items]
    : items;

  // Nếu không có items, không render gì
  if (allItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const IconComponent = item.icon as LucideIcon;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center space-x-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#008C8C] dark:hover:text-[#00994C] transition-all duration-200 hover:translate-x-0.5"
                  aria-current={isLast ? "page" : undefined}
                >
                  {IconComponent && typeof IconComponent === "function" && (
                    <span className="transition-transform duration-200 hover:scale-110">
                      <IconComponent size={16} />
                    </span>
                  )}
                  {item.label}
                </a>
              ) : (
                <span
                  className={`flex items-center gap-1.5 text-sm ${
                    isLast
                      ? "text-gray-900 dark:text-gray-100 font-semibold"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {IconComponent && typeof IconComponent === "function" && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <IconComponent size={16} />
                    </motion.span>
                  )}
                  {item.label}
                </span>
              )}

              {!isLast && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center"
                  aria-hidden="true"
                >
                  {separator || defaultSeparator}
                </motion.span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// BreadcrumbSkeleton - Loading state
export function BreadcrumbSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
          {index < items - 1 && (
            <ChevronRight
              size={16}
              className="text-gray-300 dark:text-gray-700"
            />
          )}
        </div>
      ))}
    </div>
  );
}