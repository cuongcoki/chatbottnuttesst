import { ReactNode } from "react";
import { useLocation } from "react-router";
interface BreadcrumbItem { label: string; href?: string; icon?: ReactNode; }

export function useAdminBreadcrumb(): BreadcrumbItem[] {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin/dashboard/blogs/create")) {
    return [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Blogs", href: "/admin/dashboard/blogs" },
      { label: "Create Blog" },
    ];
  }

  if (pathname.startsWith("/admin/dashboard/blogs/update")) {
    return [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Blogs", href: "/admin/dashboard/blogs" },
      { label: "Update Blog" },
    ];
  }

  if (pathname.startsWith("/admin/dashboard/blogs")) {
    return [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Blogs" },
    ];
  }

  if (pathname.startsWith("/admin/dashboard/users")) {
    return [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Users" },
    ];
  }

  if (pathname.startsWith("/admin/dashboard/comments")) {
    return [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Comments" },
    ];
  }

  return [{ label: "Dashboard" }];
}
