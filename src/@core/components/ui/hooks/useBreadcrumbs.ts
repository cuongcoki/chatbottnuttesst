import { useMemo } from "react";
import { useLocation } from "react-router";
import { navLinks } from "../../siderbar";
import { LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

// Custom mapping cho các routes đặc biệt
const customRouteLabels: Record<string, string> = {
  create: "Tạo mới",
  update: "Cập nhật",
  edit: "Chỉnh sửa",
  view: "Xem chi tiết",
  settings: "Cài đặt",
  profile: "Hồ sơ",
  dashboard: "Trang chủ",
  users: "Người dùng",
  classes: "Lớp học",
  subjects: "Môn học",
  reports: "Báo cáo",
  notifications: "Thông báo",
  feedbacks: "Phản hồi",
  assignments: "Bài tập",
  datasets: "Dữ liệu",
  models: "Mô hình",
};

// Helper function để format label từ URL segment
const formatLabel = (segment: string): string => {
  // Check custom mapping trước
  const lowerSegment = segment.toLowerCase();
  if (customRouteLabels[lowerSegment]) {
    return customRouteLabels[lowerSegment];
  }

  // Nếu là UUID hoặc ID (dài > 20 ký tự hoặc toàn số)
  if (segment.length > 20 || /^\d+$/.test(segment)) {
    return "Chi tiết";
  }

  // Format kebab-case hoặc snake_case thành Title Case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function để check xem có phải route role không (admin, teacher, student)
const isRoleSegment = (segment: string): boolean => {
  return ["admin", "teacher", "student"].includes(segment.toLowerCase());
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation();

  return useMemo(() => {
    // Bỏ qua nếu là trang home
    if (pathname === "/" || pathname === "") {
      return [];
    }

    // Split pathname thành các segments
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Build href từng phần
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Bỏ qua role segments (admin, teacher, student) và dashboard
      if (
        isRoleSegment(segment) ||
        segment.toLowerCase() === "dashboard"
      ) {
        return;
      }

      // Tìm matching nav link
      const matchingLink = navLinks.find((link) => {
        // Exact match
        if (link.href === currentPath) return true;

        // Check nếu currentPath là child của link.href
        if (currentPath.startsWith(link?.href || "") && link.href !== "/") {
          // Đảm bảo match chính xác segment, không phải substring
          const remainingPath = currentPath.substring(link?.hrefCon?.length || 0);
          return remainingPath === "" || remainingPath.startsWith("/");
        }

        return false;
      });

      // Nếu tìm thấy matching link, dùng label và icon từ đó
      if (matchingLink) {
        // Kiểm tra xem breadcrumb này đã tồn tại chưa
        const exists = breadcrumbs.some(
          (b) => b.label === matchingLink.title
        );

        if (!exists) {
          breadcrumbs.push({
            label: matchingLink.title,
            href: isLast ? undefined : matchingLink.href,
            icon: matchingLink.icon,
          });
        }
      } else {
        // Nếu không tìm thấy, generate label từ segment
        const label = formatLabel(segment);

        breadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath,
        });
      }
    });

    return breadcrumbs;
  }, [pathname]);
}