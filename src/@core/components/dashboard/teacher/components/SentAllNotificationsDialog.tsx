import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { INotification } from "@/domain/interfaces/INotification";
import { Bell, Check, Loader2, X } from "lucide-react";
import { useNotificationStore } from "@/utility/stores/notificationStore";
import { useEnrollmentStore } from "@/utility/stores/enrollmentsStore";
import { IEnrollmentItem } from "@/domain/interfaces/IErollment";
import { UserRole } from "@/@core/components/siderbar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationFormData {
  title: string;
  content: string;
  type: string;
  link: string;
}

interface SentNotificationsDialogProps {
  classId: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  avatar?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string; // 👈 Chỉ lấy ID string
  full_name: string; // 👈 Thêm tên để hiển thị
  avatar: string;
  student_code: string;
  grade_level: number;
  current_class: string;
  school_name: string;
  learning_style: string;
  created_at: string;
  difficulty_preference: string;
  last_active: string;
  updated_at: string;
  status: string;
  attendance_count: number;
  enrollment_date: string;
  isOnline?: boolean;
}

// 👇 Trạng thái gửi thông báo cho từng học sinh
interface StudentNotificationStatus {
  studentId: string;
  userId: string;
  fullName: string;
  status: "pending" | "sending" | "success" | "error";
  error?: string;
}

const SentAllNotificationsDialog = ({
  classId,
}: SentNotificationsDialogProps) => {
  // Store
  const { enrollments, getEnrollmentsByClass } = useEnrollmentStore();
  const { createNotification } = useNotificationStore();

  useEffect(() => {
    if (classId) {
      getEnrollmentsByClass(classId);
    }
  }, [classId, getEnrollmentsByClass]);

  // 👇 Lấy user_id từ studentsData
  const studentsData = useMemo<Student[]>(() => {
    return enrollments.map((enrollment: IEnrollmentItem) => ({
      id: enrollment.id,
      user_id: enrollment.student_id.user_id._id, // 👈 LẤY _id từ user_id object
      full_name: enrollment.student_id.user_id.full_name, // 👈 Lấy tên
      avatar: enrollment.student_id.avatar,
      student_code: enrollment.student_id.student_code,
      grade_level: enrollment.student_id.grade_level,
      current_class: enrollment.student_id.current_class,
      school_name: enrollment.student_id.school_name,
      learning_style: enrollment.student_id.learning_style,
      difficulty_preference: enrollment.student_id.difficulty_preference,
      last_active: enrollment.student_id.last_active,
      created_at: enrollment.student_id.created_at,
      updated_at: enrollment.student_id.updated_at,
      status: enrollment.status,
      attendance_count: enrollment.attendance_count,
      enrollment_date: enrollment.enrollment_date,
    }));
  }, [enrollments]);

  console.log("Students data:", studentsData);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    content: "",
    type: "quiz",
    link: "",
  });

  // 👇 STATE ĐỂ TRACK TIẾN TRÌNH GỬI
  const [isSending, setIsSending] = useState(false);
  const [notificationStatuses, setNotificationStatuses] = useState<
    StudentNotificationStatus[]
  >([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  // 👇 HÀM GỬI THÔNG BÁO HÀNG LOẠT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    if (studentsData.length === 0) {
      toast.error("Không có học sinh nào trong lớp");
      return;
    }

    setIsSending(true);

    // 👇 Khởi tạo trạng thái cho tất cả học sinh
    const initialStatuses: StudentNotificationStatus[] = studentsData.map(
      (student) => ({
        studentId: student.id,
        userId: student.user_id,
        fullName: student.full_name,
        status: "pending",
      })
    );
    setNotificationStatuses(initialStatuses);

    // 👇 Gửi tuần tự cho từng học sinh
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < studentsData.length; i++) {
      const student = studentsData[i];

      // Cập nhật trạng thái đang gửi
      setNotificationStatuses((prev) =>
        prev.map((item) =>
          item.userId === student.user_id
            ? { ...item, status: "sending" }
            : item
        )
      );

      try {
        const notificationData: INotification = {
          user_id: student.user_id,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          link: formData.link,
        } as INotification;

        await createNotification(notificationData);

        // Cập nhật trạng thái thành công
        setNotificationStatuses((prev) =>
          prev.map((item) =>
            item.userId === student.user_id
              ? { ...item, status: "success" }
              : item
          )
        );
        successCount++;
      } catch (error) {
        // Cập nhật trạng thái lỗi
        setNotificationStatuses((prev) =>
          prev.map((item) =>
            item.userId === student.user_id
              ? {
                  ...item,
                  status: "error",
                  error: error instanceof Error ? error.message : "Lỗi không xác định",
                }
              : item
          )
        );
        errorCount++;
      }

      // Delay nhỏ giữa các request để tránh quá tải server
      if (i < studentsData.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    setIsSending(false);

    // Hiển thị kết quả
    if (errorCount === 0) {
      toast.success(
        `✅ Đã gửi thành công thông báo cho ${successCount} học sinh!`
      );
    } else {
      toast.error(
        `⚠️ Gửi thành công: ${successCount}, Thất bại: ${errorCount}`
      );
    }
  };

  const handleCancel = () => {
    if (!isSending) {
      setFormData({
        title: "",
        content: "",
        type: "quiz",
        link: "",
      });
      setNotificationStatuses([]);
      setOpen(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      content: "",
      type: "quiz",
      link: "",
    });
    setNotificationStatuses([]);
  };

  // 👇 Tính toán tiến trình
  const progress = useMemo(() => {
    if (notificationStatuses.length === 0) return 0;
    const completed = notificationStatuses.filter(
      (s) => s.status === "success" || s.status === "error"
    ).length;
    return Math.round((completed / notificationStatuses.length) * 100);
  }, [notificationStatuses]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-100 dark:hover:bg-blue-950"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-primary-light">
            Gửi thông báo hàng loạt
          </DialogTitle>
          <DialogDescription>
            Gửi thông báo cho tất cả {studentsData.length} học sinh trong lớp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="em ơi làm bài chưa nhỉ"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isSending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Nội dung <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Bạn có 1 bài tập mới cần hoàn thành..."
              value={formData.content}
              onChange={handleInputChange}
              disabled={isSending}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Loại thông báo <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={handleSelectChange}
              disabled={isSending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thông báo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">📋 Bài kiểm tra</SelectItem>
                <SelectItem value="assignment">📝 Bài tập</SelectItem>
                <SelectItem value="announcement">📢 Thông báo</SelectItem>
                <SelectItem value="reminder">⏰ Nhắc nhở</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link (không bắt buộc)</Label>
            <Input
              id="link"
              name="link"
              placeholder="/quiz/123"
              value={formData.link}
              onChange={handleInputChange}
              disabled={isSending}
            />
          </div>

          {/* 👇 HIỂN THỊ TIẾN TRÌNH GỬI */}
          {notificationStatuses.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">
                  Tiến trình gửi
                </Label>
                <span className="text-sm text-muted-foreground">
                  {progress}% ({" "}
                  {
                    notificationStatuses.filter(
                      (s) => s.status === "success" || s.status === "error"
                    ).length
                  }{" "}
                  / {notificationStatuses.length} )
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Danh sách học sinh */}
              <ScrollArea className="h-[200px] rounded-md border p-3">
                <div className="space-y-2">
                  {notificationStatuses.map((studentStatus) => (
                    <div
                      key={studentStatus.userId}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium truncate">
                          {studentStatus.fullName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {studentStatus.status === "pending" && (
                          <span className="text-xs text-gray-400">
                            Chờ gửi...
                          </span>
                        )}
                        {studentStatus.status === "sending" && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        {studentStatus.status === "success" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {studentStatus.status === "error" && (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {!isSending && notificationStatuses.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSending}
              >
                Gửi lại
              </Button>
            )}

            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSending}
              >
                {isSending ? "Đang gửi..." : "Đóng"}
              </Button>
            </DialogClose>

            {notificationStatuses.length === 0 && (
              <Button
                className="ml-2 bg-primary-light hover:bg-primary-dark text-white"
                type="submit"
                disabled={isSending || studentsData.length === 0}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  `Gửi cho ${studentsData.length} học sinh`
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SentAllNotificationsDialog;