import { useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  FileText,
  ClipboardList,
  Award,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCheck,
  // Trash2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotificationStore } from "@/utility/stores/notificationStore";
import { INotification } from "@/domain/interfaces/INotification";
import { useEffect } from "react";

export interface FetchNotificationParams {
  page: number;
  limit: number;
  type?: string;
  unreadOnly?: boolean;
}

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const limit = 15;

  // Lấy từ store
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  } = useNotificationStore();

  // Fetch notifications khi component mount hoặc filter thay đổi
  useEffect(() => {
    const params: FetchNotificationParams   = {
      page,
      limit,
    };

    if (activeFilter !== "all") {
      params.type = activeFilter;
    }

    if (showUnreadOnly) {
      params.unreadOnly = true;
    }

    fetchNotifications(params);
  }, [page, limit, activeFilter, showUnreadOnly, fetchNotifications]);

  const filterOptions = [
    { value: "all", label: "Tất cả", icon: Bell, count: notifications.length },
    { value: "announcement", label: "Thông báo", icon: Megaphone },
    { value: "assignment", label: "Bài tập", icon: FileText },
    { value: "quiz", label: "Kiểm tra", icon: ClipboardList },
    { value: "grade", label: "Điểm số", icon: Award },
    { value: "success", label: "Thành công", icon: CheckCircle2 },
    { value: "warning", label: "Cảnh báo", icon: AlertTriangle },
    { value: "error", label: "Lỗi", icon: AlertCircle },
    { value: "info", label: "Thông tin", icon: Info },
  ];

  const getTypeConfig = (type: INotification['type']) => {
    const configs = {
      success: { color: "text-green-500", bgColor: "bg-green-50", borderColor: "border-green-200" },
      error: { color: "text-red-500", bgColor: "bg-red-50", borderColor: "border-red-200" },
      warning: { color: "text-yellow-500", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
      info: { color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      assignment: { color: "text-purple-500", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
      quiz: { color: "text-indigo-500", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
      grade: { color: "text-amber-500", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
      announcement: { color: "text-pink-500", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
      emill: { color: "text-cyan-500", bgColor: "bg-cyan-50", borderColor: "border-cyan-200" },
      other: { color: "text-gray-500", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
    };
    return configs[type] || configs.info;
  };

  const getTypeIcon = (type: INotification['type']) => {
    const iconMap = {
      success: CheckCircle2,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
      assignment: FileText,
      quiz: ClipboardList,
      grade: Award,
      announcement: Megaphone,
      emill: Bell,
      other: Bell,
    };
    const Icon = iconMap[type] || Info;
    const config = getTypeConfig(type);
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  const handleNotificationClick = async (notif: INotification) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    // if (notif.link) {
    //   window.location.href = notif.link;
    // }
  };

  const handleDeleteClick = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent notification click
    setNotificationToDelete(notificationId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (notificationToDelete) {
      await deleteNotification(notificationToDelete);
      setShowDeleteDialog(false);
      setNotificationToDelete(null);
    }
  };

  const confirmDeleteAll = async () => {
    await deleteAllRead();
    setShowDeleteAllDialog(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const totalPages = Math.ceil(notifications.length / limit);
  const readNotificationsCount = notifications.filter(n => n.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar - Navigation & Filters */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold">Thông báo</h1>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold text-blue-600">{unreadCount}</span> chưa đọc
            </p>
          )}
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            {/* Unread Filter Toggle */}
            <Button
              variant={showUnreadOnly ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 mb-3"
              onClick={() => { setShowUnreadOnly(!showUnreadOnly); setPage(1); }}
            >
              <Check className="w-4 h-4" />
              <span className="flex-1 text-left">Chưa đọc</span>
              {showUnreadOnly && (
                <Badge variant="secondary" className="ml-auto">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <Separator className="my-3" />

            {/* Filter Options */}
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = activeFilter === option.value;
              
              return (
                <Button
                  key={option.value}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => { setActiveFilter(option.value); setPage(1); }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.value === "all" && (
                    <Badge variant="outline" className="ml-auto">
                      {option.count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-3 border-t space-y-2">
          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}

          {/* Delete All Read */}
          {/* {readNotificationsCount > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteAllDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả đã đọc ({readNotificationsCount})
            </Button>
          )} */}
        </div>
      </aside>

      {/* Main Content - Notifications List */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {filterOptions.find(f => f.value === activeFilter)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                {notifications.length} thông báo
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const config = getTypeConfig(notif.type);
                
                return (
                  <Card
                    key={notif.id}
                    className={`group cursor-pointer transition-all hover:shadow-md ${
                      !notif.is_read 
                        ? `border-l-4 ${config.borderColor} ${config.bgColor}` 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
                          {getTypeIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-medium text-sm leading-tight">
                              {notif.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {!notif.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => handleDeleteClick(e, notif.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {notif.content && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {notif.content}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{formatTimeAgo(notif.created_at)}</span>
                            {notif.link && (
                              <>
                                <span>•</span>
                                <span className="text-blue-500 hover:underline">
                                  Xem chi tiết
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Không có thông báo</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {showUnreadOnly ? "Bạn đã đọc hết thông báo" : "Chưa có thông báo nào"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white border-t p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Trang {page} / {totalPages}
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Single Notification Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Read Notifications Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tất cả thông báo đã đọc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {readNotificationsCount} thông báo đã đọc? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAll}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;