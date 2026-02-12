"use client";

import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Send,
  Save,
  Download,
  Eye,
  Mail,
  Award,
  AlertCircle,
  Users,
  BookOpen,
} from "lucide-react";
import { useStudentAssignmentStore } from "@/utility/stores/studentAssignmentStore";
import { useClassStore } from "@/utility/stores/classesStore";
import {
  IStudentInfo,
  StudentAssignmentStatus,
} from "@/domain/interfaces/IStudentAssignment";
import { IAssignment } from "@/domain/interfaces/IAssignment";
import toast from "react-hot-toast";

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStudentName = (studentId: string | IStudentInfo): string => {
  if (typeof studentId === "string") return studentId;
  if (studentId.user_id && typeof studentId.user_id === "object") {
    return studentId.user_id.full_name || studentId.student_code;
  }
  return studentId.student_code;
};

const getStudentCode = (studentId: string | IStudentInfo): string => {
  if (typeof studentId === "string") return studentId;
  return studentId.student_code;
};

const getAssignmentTitle = (assignmentId: string | IAssignment): string => {
  if (typeof assignmentId === "string") return assignmentId;
  return assignmentId.title;
};

const getAssignmentMaxScore = (assignmentId: string | IAssignment): number => {
  if (typeof assignmentId === "string") return 10;
  return assignmentId.max_score;
};

const getStatusBadge = (status: StudentAssignmentStatus) => {
  switch (status) {
    case "graded":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Đã chấm
        </Badge>
      );
    case "submitted":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="w-3 h-3 mr-1" />
          Chờ chấm
        </Badge>
      );
    case "late":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Nộp muộn
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <XCircle className="w-3 h-3 mr-1" />
          Chưa nộp
        </Badge>
      );
  }
};

interface StudentGradeProps {
  subjectId: string;
}

// Main Component
const StudentGrade = ({ subjectId }:StudentGradeProps) => {
  const { getIdClass } = useClassStore();
  const selectedClassId = getIdClass();
console.log(subjectId);
  // Student Assignment store
  const {
    studentAssignments,
    currentStudentAssignment,
    isLoading,
    fetchStudentAssignmentById,
    gradeAssignment,
  } = useStudentAssignmentStore();

  const [selectedStudentAssignmentId, setSelectedStudentAssignmentId] =
    useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Grading form state
  const [score, setScore] = useState<string>("");
  const [letterGrade, setLetterGrade] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Load selected student assignment details
  useEffect(() => {
    if (selectedStudentAssignmentId) {
      fetchStudentAssignmentById(selectedStudentAssignmentId);
    }
  }, [selectedStudentAssignmentId, fetchStudentAssignmentById]);

  // Update form when currentStudentAssignment changes
  useEffect(() => {
    if (currentStudentAssignment) {
      if (
        currentStudentAssignment.score !== undefined &&
        currentStudentAssignment.score !== null
      ) {
        setScore(currentStudentAssignment.score.toString());
        const maxScore = getAssignmentMaxScore(
          currentStudentAssignment.assignment_id
        );
        setLetterGrade(
          calculateLetterGrade(currentStudentAssignment.score, maxScore)
        );
      } else {
        setScore("");
        setLetterGrade("");
      }
      setFeedback(currentStudentAssignment.feedback || "");
    }
  }, [currentStudentAssignment]);

  // Calculate stats
  const stats = {
    total: studentAssignments.length,
    submitted: studentAssignments.filter(
      (s) => s.status === "submitted" || s.status === "late"
    ).length,
    graded: studentAssignments.filter((s) => s.status === "graded").length,
    pending: studentAssignments.filter((s) => s.status === "not_submitted")
      .length,
  };

  // Filter and sort students
  const filteredAssignments = studentAssignments
    .filter((sa) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "graded") return sa.status === "graded";
      if (filterStatus === "submitted")
        return sa.status === "submitted" || sa.status === "late";
      if (filterStatus === "pending") return sa.status === "not_submitted";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return getStudentName(a.student_id).localeCompare(
          getStudentName(b.student_id)
        );
      }
      if (sortBy === "score") {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
      }
      if (sortBy === "date") {
        const dateA = a.submitted_at || "";
        const dateB = b.submitted_at || "";
        return dateB.localeCompare(dateA);
      }
      return 0;
    });

  // Auto-calculate letter grade
  const calculateLetterGrade = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "B+";
    if (percentage >= 75) return "B";
    if (percentage >= 70) return "C+";
    if (percentage >= 65) return "C";
    if (percentage >= 60) return "D+";
    if (percentage >= 50) return "D";
    return "F";
  };

  // Handle save grade
  const handleSaveGrade = async () => {
    if (!currentStudentAssignment || !score) return;

    setIsSaving(true);
    try {
      await gradeAssignment(currentStudentAssignment.id!, {
        score: parseFloat(score),
        feedback: feedback,
      });
      toast.success("Đã lưu điểm thành công!");
    } catch (error) {
      console.log(error);
      toast.error("Lưu điểm thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle send grade
  const handleSendGrade = async () => {
    if (!currentStudentAssignment || !score) return;

    setIsSaving(true);
    try {
      await gradeAssignment(currentStudentAssignment.id!, {
        score: parseFloat(score),
        feedback: feedback,
      });
      toast.success("Đã gửi điểm cho học sinh!");
    } catch (error) {
      console.log(error);
      toast.error("Gửi điểm thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-update letter grade when score changes
  const handleScoreChange = (value: string) => {
    setScore(value);
    if (value && currentStudentAssignment) {
      const numScore = parseFloat(value);
      if (!isNaN(numScore)) {
        const maxScore = getAssignmentMaxScore(
          currentStudentAssignment.assignment_id
        );
        setLetterGrade(calculateLetterGrade(numScore, maxScore));
      }
    }
  };

  if (!selectedClassId) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Vui lòng chọn một lớp học</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Chấm điểm bài tập
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Chấm điểm và nhận xét cho học sinh
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats Summary */}
          <div className="flex items-center gap-6 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {stats.graded}
              </div>
              <div className="text-xs text-gray-500">Đã chấm</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {stats.submitted}
              </div>
              <div className="text-xs text-gray-500">Chờ chấm</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600">
                {stats.pending}
              </div>
              <div className="text-xs text-gray-500">Chưa nộp</div>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Main Content with Resizable Panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Student List */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
          <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Sidebar Header */}
            <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Danh sách bài nộp ({filteredAssignments.length}/{stats.total})
                </span>
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="submitted">Chờ chấm</SelectItem>
                  <SelectItem value="graded">Đã chấm</SelectItem>
                  <SelectItem value="pending">Chưa nộp</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sắp xếp theo tên</SelectItem>
                  <SelectItem value="score">Sắp xếp theo điểm</SelectItem>
                  <SelectItem value="date">Sắp xếp theo ngày nộp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có bài nộp nào</p>
                </div>
              ) : (
                filteredAssignments.map((sa) => {
                  const isSelected = selectedStudentAssignmentId === sa.id;

                  return (
                    <div
                      key={sa.id}
                      onClick={() => setSelectedStudentAssignmentId(sa.id!)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-600"
                          : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {getStudentName(sa.student_id).charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {getStudentName(sa.student_id)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getStudentCode(sa.student_id)}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(sa.status)}
                        {sa.score !== undefined && sa.score !== null && (
                          <span className="text-sm font-bold text-green-600">
                            {sa.score}/{getAssignmentMaxScore(sa.assignment_id)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Grading Area */}
        <ResizablePanel defaultSize={70}>
          <div className="h-full flex flex-col overflow-y-auto">
            {!selectedStudentAssignmentId && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Chọn một bài nộp để bắt đầu chấm điểm</p>
                </div>
              </div>
            )}

            {selectedStudentAssignmentId && !currentStudentAssignment && (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            )}

            {currentStudentAssignment &&
              currentStudentAssignment.status === "not_submitted" && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-2">Chưa có bài nộp</p>
                    <p className="text-sm">Học sinh chưa nộp bài tập</p>
                  </div>
                </div>
              )}

            {currentStudentAssignment &&
              currentStudentAssignment.status !== "not_submitted" && (
                <div className="flex-1 p-6 space-y-6">
                  {/* Student Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                        {getStudentName(currentStudentAssignment.student_id)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {getStudentName(currentStudentAssignment.student_id)}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {getStudentCode(
                              currentStudentAssignment.student_id
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(currentStudentAssignment.status)}
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Bài tập
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getAssignmentTitle(
                              currentStudentAssignment.assignment_id
                            )}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Thời gian nộp
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {currentStudentAssignment.submitted_at
                            ? formatDate(currentStudentAssignment.submitted_at)
                            : "Chưa nộp"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Hạn nộp
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(currentStudentAssignment.due_date)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Trạng thái
                        </div>
                        <div className="text-sm font-medium">
                          {currentStudentAssignment.is_late ? (
                            <span className="text-orange-600">
                              Nộp muộn {currentStudentAssignment.days_late} ngày
                            </span>
                          ) : (
                            <span className="text-green-600">Đúng hạn</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submission Content */}
                    {(currentStudentAssignment.submission_text ||
                      currentStudentAssignment.submission_file) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {currentStudentAssignment.submission_text && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">
                              Nội dung bài làm:
                            </div>
                            <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 p-3 rounded border">
                              {currentStudentAssignment.submission_text}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Xem bài làm
                          </Button>
                          {currentStudentAssignment.submission_file && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Tải xuống
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grading Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <Award className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Chấm điểm
                      </h3>
                    </div>

                    {/* Score Input */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Điểm số <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max={getAssignmentMaxScore(
                              currentStudentAssignment.assignment_id
                            )}
                            step="0.5"
                            value={score}
                            onChange={(e) => handleScoreChange(e.target.value)}
                            placeholder="Nhập điểm"
                            className="pr-20 text-lg font-semibold"
                            disabled={
                              currentStudentAssignment.status === "graded"
                            }
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            /{" "}
                            {getAssignmentMaxScore(
                              currentStudentAssignment.assignment_id
                            )}
                          </span>
                        </div>
                        {score &&
                          parseFloat(score) >
                            getAssignmentMaxScore(
                              currentStudentAssignment.assignment_id
                            ) && (
                            <p className="text-xs text-red-500 mt-1">
                              Điểm không được vượt quá{" "}
                              {getAssignmentMaxScore(
                                currentStudentAssignment.assignment_id
                              )}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Điểm chữ
                        </label>
                        <Input
                          type="text"
                          value={letterGrade}
                          onChange={(e) => setLetterGrade(e.target.value)}
                          placeholder="A+, A, B+..."
                          className="text-lg font-semibold"
                          disabled={
                            currentStudentAssignment.status === "graded"
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phần trăm
                        </label>
                        <div className="h-10 flex items-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {score
                              ? Math.round(
                                  (parseFloat(score) /
                                    getAssignmentMaxScore(
                                      currentStudentAssignment.assignment_id
                                    )) *
                                    100
                                )
                              : 0}
                            %
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nhận xét
                      </label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Nhập nhận xét, góp ý cho học sinh..."
                        rows={5}
                        className="resize-none"
                        disabled={currentStudentAssignment.status === "graded"}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {feedback.length} ký tự
                      </p>
                    </div>

                    {/* Previous Grade (if exists) */}
                    {currentStudentAssignment.status === "graded" && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                              Đã chấm điểm
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-green-700 dark:text-green-300">
                                  Điểm:
                                </span>
                                <span className="font-bold text-green-900 dark:text-green-100">
                                  {currentStudentAssignment.score}/
                                  {getAssignmentMaxScore(
                                    currentStudentAssignment.assignment_id
                                  )}{" "}
                                  ({letterGrade})
                                </span>
                              </div>
                              {currentStudentAssignment.feedback && (
                                <div>
                                  <span className="text-green-700 dark:text-green-300">
                                    Nhận xét:
                                  </span>
                                  <p className="text-green-800 dark:text-green-200 mt-1 p-2 bg-white dark:bg-gray-800 rounded">
                                    {currentStudentAssignment.feedback}
                                  </p>
                                </div>
                              )}
                              <div className="text-xs text-green-600 dark:text-green-400 pt-2 border-t border-green-200 dark:border-green-800">
                                Chấm lúc:{" "}
                                {currentStudentAssignment.graded_at &&
                                  formatDate(
                                    currentStudentAssignment.graded_at
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {currentStudentAssignment.status !== "graded" && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          onClick={handleSaveGrade}
                          disabled={
                            !score ||
                            parseFloat(score) >
                              getAssignmentMaxScore(
                                currentStudentAssignment.assignment_id
                              ) ||
                            isSaving
                          }
                          variant="outline"
                          className="flex-1"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? "Đang lưu..." : "Lưu nháp"}
                        </Button>

                        <Button
                          onClick={handleSendGrade}
                          disabled={
                            !score ||
                            parseFloat(score) >
                              getAssignmentMaxScore(
                                currentStudentAssignment.assignment_id
                              ) ||
                            isSaving
                          }
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {isSaving ? "Đang gửi..." : "Gửi điểm"}
                        </Button>
                      </div>
                    )}

                    {currentStudentAssignment.status === "graded" && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            // Reset to allow editing
                            setScore(
                              currentStudentAssignment.score?.toString() || ""
                            );
                            setFeedback(
                              currentStudentAssignment.feedback || ""
                            );
                          }}
                        >
                          Chỉnh sửa điểm
                        </Button>

                        <Button variant="outline" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Gửi lại thông báo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StudentGrade;
