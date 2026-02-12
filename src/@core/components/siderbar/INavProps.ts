import { LucideIcon } from 'lucide-react';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface NavLink {
  title: string;
  href?: string;
  hrefCon?: string[]; // Sub-menu/children routes
  icon: LucideIcon;
  checkRoll: UserRole[]; // Roles that can access this link
  badge?: string | number; // Optional badge (notifications, count, etc.)
  
}

export interface NavProps {
  isCollapsed: boolean;
  links: NavLink[];
  currentPath?: string; // Current active path
  userRole?: UserRole; // Current user role
  onNavigate?: (href: string) => void; // Navigation handler
}

export interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  userRole?: UserRole;
  currentPath?: string;
}