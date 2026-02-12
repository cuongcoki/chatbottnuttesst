import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, FileText, Target, Upload, X } from "lucide-react";
import { useAssignmentStore } from "@/utility/stores/assignmentStore";
import { IAssignment, IUpdateAssignment } from "@/domain/interfaces/IAssignment";

interface AssignmentUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: IAssignment;
}

const AssignmentUpdateDialog = ({
  isOpen,
  onClose,
  assignment,
}: AssignmentUpdateDialogProps) => {
  const { updateAssignment, isLoading } = useAssignmentStore();

  const [formData, setFormData] = useState<IUpdateAssignment>({
    title: assignment.title,
    description: assignment.description || "",
    due_date: assignment.due_date,
    max_score: assignment.max_score,
    passing_score: assignment.passing_score,
    auto_grade_enabled: assignment.auto_grade_enabled,
    attachments: assignment.attachments || [],
  });

  const [files, setFiles] = useState<File[]>([]);

  // Update form when assignment changes
  useEffect(() => {
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      due_date: assignment.due_date,
      max_score: assignment.max_score,
      passing_score: assignment.passing_score,
      auto_grade_enabled: assignment.auto_grade_enabled,
      attachments: assignment.attachments || [],
    });
  }, [assignment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAssignment(assignment.id!, formData);
      setFiles([]);
      onClose();
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments?.filter((_, i) => i !== index),
    });
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chỉnh sửa bài tập
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin bài học "{assignment.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nhập tiêu đề bài tập"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết bài tập"
              rows={4}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date">
              Hạn nộp <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="due_date"
                type="datetime-local"
                value={formatDateForInput(formData.due_date || "")}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_score">
                Điểm tối đa <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="max_score"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.max_score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_score: parseInt(e.target.value) || 10,
                    })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_score">Điểm đạt</Label>
              <Input
                id="passing_score"
                type="number"
                min="0"
                max={formData.max_score}
                value={formData.passing_score}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passing_score: parseInt(e.target.value) || 5,
                  })
                }
              />
            </div>
          </div>

          {/* Auto Grade */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Checkbox
              id="auto_grade"
              checked={formData.auto_grade_enabled}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, auto_grade_enabled: checked })
              }
            />
            <div>
              <Label htmlFor="auto_grade" className="font-medium cursor-pointer">
                Chấm điểm tự động
              </Label>
              <p className="text-sm text-gray-500">
                Hệ thống tự chấm điểm bài nộp 
              </p>
            </div>
          </div>

          {/* Existing Attachments */}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Tài liệu hiện tại</Label>
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm truncate max-w-[200px]">
                        {file.filename}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Attachments */}
          <div className="space-y-2">
            <Label>Thêm tài liệu</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-update"
              />
              <label
                htmlFor="file-upload-update"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  kéo thả hoặc click vào tải file
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, PPT, XLS (tối đa 10MB)
                </span>
              </label>
            </div>

            {/* New File List */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentUpdateDialog;
