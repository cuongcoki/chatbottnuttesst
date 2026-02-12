import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { IAssignment, IAssignmentStatistics, IAttachment } from "@/domain/interfaces/IAssignment";
import { IStudentAssignment, IStudentInfo } from "@/domain/interfaces/IStudentAssignment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Edit,
//   Trash2,
  Calendar,
  Target,
  BookOpen,
} from "lucide-react";
import { formatDate, getTimeAgo, isOverdue } from "../helper";

// Download file function
const handleDownload = (attachment: IAttachment) => {
  // Remove /api from base URL since upload is served from root
  const baseUrl = API_BASE_URL.replace('/api', '');
  const downloadUrl = `${baseUrl}${attachment.url}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = attachment.filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Get file icon based on type
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-600" />;
    case 'word':
      return <FileText className="h-4 w-4 text-blue-600" />;
    case 'image':
      return <FileText className="h-4 w-4 text-green-600" />;
    case 'video':
      return <FileText className="h-4 w-4 text-purple-600" />;
    case 'zip':
      return <FileText className="h-4 w-4 text-yellow-600" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

// Get student name from populated data
const getStudentName = (studentId: string | IStudentInfo): string => {
  if (typeof studentId === "string") return studentId;
  if (studentId.user_id && typeof studentId.user_id === "object") {
    return (studentId.user_id ).full_name || studentId.student_code;
  }
  return studentId.student_code;
};

const getStudentCode = (studentId: string | IStudentInfo): string => {
  if (typeof studentId === "string") return studentId;
  return studentId.student_code;
};


const AssignmentDetailDialog = ({
  assignment,
  submissions,
  statistics,
  isOpen,
  onClose,
  onLoadSubmissions,
}: {
  assignment: IAssignment;
  submissions: IStudentAssignment[];
  statistics: IAssignmentStatistics | null;
  isOpen: boolean;
  onClose: () => void;
  onLoadSubmissions: () => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      onLoadSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const graded = statistics?.graded || 0;
  const submitted = statistics?.submitted || 0;
  const pending = statistics?.not_submitted || assignment.total_unsubmitted;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                {assignment.title}
              </DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {assignment.code}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Hạn nộp: {formatDate(assignment.due_date)}
                </span>
                {isOverdue(assignment.due_date) && (
                  <Badge variant="destructive">Đã quá hạn</Badge>
                )}
              </DialogDescription>
            </div>
            {/* <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Sửa
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                Xóa
              </Button>
            </div> */}
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="submissions">
              Bài nộp ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Mô tả
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {assignment.description || "Không có mô tả"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <Target className="h-4 w-4" />
                  Điểm tối đa
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {assignment.max_score}
                </div>
              </div>

              <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Điểm đạt
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {assignment.passing_score}
                </div>
              </div>
            </div>

            {/* Attachments */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Tài liệu đính kèm ({assignment.attachments.length} file)</h3>
                <div className="space-y-2">
                  {assignment.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <span className="text-sm font-medium">{file.filename}</span>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {file.type.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        title="Tải xuống"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto Grade */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Chấm điểm tự động</span>
              <Badge
                variant={
                  assignment.auto_grade_enabled ? "default" : "secondary"
                }
              >
                {assignment.auto_grade_enabled ? "Bật" : "Tắt"}
              </Badge>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div>Tạo lúc: {formatDate(assignment.created_at || "")}</div>
              {assignment.updated_at && (
                <div>Cập nhật: {getTimeAgo(assignment.updated_at)}</div>
              )}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Danh sách bài nộp</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Tải tất cả
                </Button>
              </div>

              {submissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Mã HS</TableHead>
                      <TableHead>Thời gian nộp</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {getStudentName(submission.student_id)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {getStudentCode(submission.student_id)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {submission.submitted_at
                            ? formatDate(submission.submitted_at)
                            : "Chưa nộp"}
                        </TableCell>
                        <TableCell>
                          {submission.score !== undefined && submission.score !== null ? (
                            <span className="font-semibold text-green-600">
                              {submission.score}/{assignment.max_score}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              submission.status === "graded"
                                ? "default"
                                : submission.status === "submitted"
                                ? "secondary"
                                : submission.status === "late"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {submission.status === "graded"
                              ? "Đã chấm"
                              : submission.status === "submitted"
                              ? "Đã nộp"
                              : submission.status === "late"
                              ? "Nộp muộn"
                              : "Chưa nộp"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có bài nộp nào</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {graded}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Đã chấm điểm
                  </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {submitted - graded}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Chờ chấm
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {pending}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Chưa nộp
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-4">Tỷ lệ hoàn thành</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Đã nộp</span>
                    <span className="font-semibold">
                      {statistics?.submission_rate?.toFixed(0) ||
                        Math.round(
                          (assignment.total_submitted /
                            (assignment.total_submitted +
                              assignment.total_unsubmitted)) *
                            100
                        )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: `${
                          statistics?.submission_rate ||
                          (assignment.total_submitted /
                            (assignment.total_submitted +
                              assignment.total_unsubmitted)) *
                            100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Average Score */}
              {statistics && statistics.graded > 0 && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                  <h3 className="font-semibold mb-4">Điểm trung bình</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {statistics.average_score.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      / {assignment.max_score} điểm
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-green-600 font-semibold">{statistics.passed}</div>
                      <div className="text-gray-500">Đạt</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-semibold">{statistics.failed}</div>
                      <div className="text-gray-500">Không đạt</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDetailDialog;

