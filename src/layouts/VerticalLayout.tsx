import { FC, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router"; // ⭐ Import Outlet
import CoreVerticalLayout from "../@core/layouts/VerticalLayout";
import { Sidebar } from "../@core/components/siderbar";
import { Navbar } from "../@core/components/navbar";
// import { Footer } from '../@core/components/footer';
import { ArrowUp } from "lucide-react";

interface VerticalLayoutProps {
  userRole?: "admin" | "teacher" | "student";
  companyName?: string;
}

const VerticalLayout: FC<VerticalLayoutProps> = ({ userRole }) => {
  const navigation = useNavigate();


  // ** Get collapsed state from localStorage
  const getInitialCollapsedState = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menuCollapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  };

  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // ** Save collapsed state to localStorage
  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    if (typeof window !== "undefined") {
      localStorage.setItem("menuCollapsed", JSON.stringify(collapsed));
    }
  };

  // ** Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // ** Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ** Handler functions for navbar
  const handleSearchChange = (value: string) => {
    console.log("Search:", value);
    // Implement your search logic here
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
    // Navigate to notifications or open notifications modal
    navigation('dashboard/notifications');
    // Implement your notification logic here
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    // Navigate to settings or open settings modal
  };

  const handleUserClick = () => {
    console.log("User menu clicked");
    // Open user dropdown menu
  };

  return (
    <>
      <CoreVerticalLayout
        sidebarCollapsed={isCollapsed}
        sidebar={
          <Sidebar
            isCollapsed={isCollapsed}
            onCollapse={handleCollapse}
            userRole={userRole}
            currentPath={currentPath}
          />
        }
        navbar={
          <Navbar
            showSearch={true}
            showNotifications={true}
            showSettings={true}
            showUserAvatar={true}
            notificationCount={3}
            // userInitials="CG"
            searchPlaceholder="Search..."
            onSearchChange={handleSearchChange}
            onNotificationClick={handleNotificationClick}
            onSettingsClick={handleSettingsClick}
            onUserClick={handleUserClick}
          />
        }
        // footer={
        //   <Footer
        //     companyName={companyName}
        //     year={2025}
        //     links={[
        //       { label: 'Privacy Policy', href: '/privacy' },
        //       { label: 'Terms of Service', href: '/terms' },
        //       { label: 'Contact Us', href: '/contact' },
        //     ]}
        //     showMadeWith={true}
        //     madeByName="Cương"
        //   />
        // }
      >
        <Outlet />
      </CoreVerticalLayout>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2.5 bg-linear-to-r from-[#00994C] via-[#008C8C] to-[#0077CC] hover:shadow-xl text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
};

export default VerticalLayout;
