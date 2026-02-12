import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useAssignmentStore } from "@/utility/stores/assignmentStore";
import { IAssignment } from "@/domain/interfaces/IAssignment";

interface AssignmentDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: IAssignment;
}

const AssignmentDeleteDialog = ({
  isOpen,
  onClose,
  assignment,
}: AssignmentDeleteDialogProps) => {
  const { deleteAssignment, isLoading } = useAssignmentStore();

  const handleDelete = async () => {
    try {
      await deleteAssignment(assignment.id!);
      onClose();
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận xóa bài tập
          </DialogTitle>
          <DialogDescription className="pt-4">
            Bạn có chắc chắn muốn xóa bài tập{" "}
            <strong className="text-gray-900 dark:text-gray-100">
              "{assignment.title}"
            </strong>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-200">
                <p className="font-medium mb-2">Hành động này sẽ:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Xóa vĩnh viễn bài tập</li>
                  <li>Xóa tất cả bài nộp của học sinh</li>
                  <li>Xóa điểm số nộp chậm</li>
                </ul>
                <p className="mt-2 font-medium">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">MÃ bài tập:</span>
                <span className="font-medium">{assignment.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Đã nộp:</span>
                <span className="font-medium">{assignment.total_submitted} bài</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chưa nộp:</span>
                <span className="font-medium">{assignment.total_unsubmitted} bài</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Đang xóa..." : "Xóa bài tập"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDeleteDialog;
