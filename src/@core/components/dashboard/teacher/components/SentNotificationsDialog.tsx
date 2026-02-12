import { useState } from "react";
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
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/utility/stores/notificationStore";

interface NotificationFormData {
  title: string;
  content: string;
  type: string;
  link: string;
}

interface SentNotificationsDialogProps {
  userId: string;
}

// 👇 SỬA: Destructure props đúng cách
const SentNotificationsDialog = ({ userId }: SentNotificationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    content: "",
    type: "quiz",
    link: "",
  });

  // 👇 LẤY ACTIONS VÀ STATE TỪ STORE
  const { createNotification, isLoading } = useNotificationStore();

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

    try {
      // 👇 SỬ DỤNG userId TỪ PROPS
      const notificationData: INotification = {
        user_id: userId, // 👈 DÙNG userId TỪ PROPS
        title: formData.title,
        content: formData.content,
        type: formData.type,
        link: formData.link,
      } as INotification;

      // 👇 SỬ DỤNG STORE ACTION
      await createNotification(notificationData);

      // Reset form
      setFormData({
        title: "",
        content: "",
        type: "quiz",
        link: "",
      });

      setOpen(false);
    } catch (error) {
      // Error đã được handle trong store
      console.error("Error sending notification:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      content: "",
      type: "quiz",
      link: "",
    });
    setOpen(false);
  };

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary-light">Gửi thông báo mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để gửi thông báo cho người dùng
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" >
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="em ơi làm bài chưa nhỉ"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thông báo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">ℹ️ Thông tin</SelectItem>
                <SelectItem value="warning">⚠️ Cảnh báo</SelectItem>
                <SelectItem value="success">✅ Thành công</SelectItem>
                <SelectItem value="error">❌ Lỗi</SelectItem>
                <SelectItem value="assignment">📝 Bài tập</SelectItem>
                <SelectItem value="quiz">📋 Bài kiểm tra</SelectItem>
                <SelectItem value="grade">🎯 Điểm số</SelectItem>
                <SelectItem value="announcement">📢 Thông báo</SelectItem>
                <SelectItem value="emill">📧 Email</SelectItem>
                <SelectItem value="other">📌 Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              name="link"
              placeholder="/quiz/123"
              value={formData.link}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 ">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </DialogClose>
            <Button  className="ml-2 bg-primary-light hover:bg-primary-dark text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Gửi thông báo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SentNotificationsDialog;
