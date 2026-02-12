import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEvalStore } from "@/services/useEvalStore";
import { useState } from "react"; // Thêm useState
import { IEvalHistoryItem } from "@/infra/apiRAG/type/IEval";

// ========================
// Helper Functions
// ========================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getRatingColor = (rating: string) => {
  if (rating.includes("Xuất sắc")) return "bg-[#00994c] text-white";
  if (rating.includes("Tốt")) return "bg-[#008c8c] text-white";
  if (rating.includes("Khá")) return "bg-[#0077cc] text-white";
  if (rating.includes("Trung bình")) return "bg-yellow-500 text-white";
  return "bg-gray-500 text-white";
};

// ========================
// Main Component
// ========================

interface EvaluatedStudentDialogProps {
  userId: string;
  studentCode?: string;
}

export default function EvaluatedStudentDialog({
  userId,
  studentCode,
}: EvaluatedStudentDialogProps) {
  const { getAllEval, evalHistory, evalSummary, isLoading, error } =
    useEvalStore();

  const [isOpen, setIsOpen] = useState(false); // Thêm state để track dialog

  // Xóa useEffect cũ
  // useEffect(() => {
  //   if (userId) {
  //     getAllEval(userId);
  //   }
  // }, [userId, getAllEval]);

  // Hàm xử lý khi dialog mở/đóng
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Chỉ call API khi dialog được mở
    if (open && userId) {
      getAllEval(userId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          <BadgeCheck className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bảng Đánh Giá Học Sinh</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error State */}
        {/* {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-lg font-medium">Có lỗi xảy ra</p>
            <p className="text-sm text-gray-500">{error}</p>
            <Button
              onClick={() => getAllEval(userId)}
              className="mt-4"
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        )} */}

        {/* No Data State */}
        {!isLoading && !error && (!evalHistory || evalHistory.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Award className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-lg font-medium">Chưa có dữ liệu đánh giá</p>
            <p className="text-sm">
              {studentCode ? `Học sinh ${studentCode}` : "Học sinh này"} chưa
              có lịch sử đánh giá nào
            </p>
          </div>
        )}

        {/* Main Content */}
        {!isLoading &&
          !error &&
          evalHistory &&
          evalHistory.length > 0 &&
          evalSummary && (
            <div className="bg-gray-50 p-4">
              <div className="max-w-5xl mx-auto space-y-4">
                {/* Compact Header */}
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00994c] flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900">
                        {studentCode || "Học sinh"}
                      </h1>
                      <p className="text-xs text-gray-500">
                        ID: {userId.slice(-8)}
                      </p>
                    </div>
                  </div>
                  {evalSummary.date_range && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Thời gian đánh giá
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(evalSummary.date_range.from)} -{" "}
                        {formatDate(evalSummary.date_range.to)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Compact Summary Grid */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="w-3.5 h-3.5 text-[#00994c]" />
                      <p className="text-xs text-gray-600">Số ngày</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {evalSummary.total_days}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#008c8c]" />
                      <p className="text-xs text-gray-600">Điểm TB</p>
                    </div>
                    <p className="text-2xl font-bold text-[#008c8c]">
                      {evalSummary.avg_score.toFixed(1)}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-[#0077cc]" />
                      <p className="text-xs text-gray-600">Bài/ngày</p>
                    </div>
                    <p className="text-2xl font-bold text-[#0077cc]">
                      {evalSummary.avg_daily_submissions.toFixed(1)}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-3.5 h-3.5 text-[#006633]" />
                      <p className="text-xs text-gray-600">Tổng điểm</p>
                    </div>
                    <p className="text-2xl font-bold text-[#006633]">
                      {evalSummary.avg_total_score.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Rating Distribution */}
                {evalSummary.rating_distribution && (
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Phân bố đánh giá
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(evalSummary.rating_distribution).map(
                        ([rating, count]) => (
                          <Badge
                            key={rating}
                            className={`${getRatingColor(rating)} px-3 py-1`}
                          >
                            {rating}: {count} ngày
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* History - Compact */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00994c]" />
                    Lịch sử đánh giá ({evalHistory.length} ngày)
                  </h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {evalHistory.map((entry: IEvalHistoryItem) => (
                      <div
                        key={entry.id}
                        className="border rounded-lg p-3 hover:shadow-sm transition-shadow hover:border-[#00994c]"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatDate(entry.date)}
                            </span>
                            <Badge
                              className={`${getRatingColor(
                                entry.rating
                              )} text-xs px-2 py-0`}
                            >
                              {entry.rating}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <div className="text-center px-2 py-1 bg-[#00994c] rounded text-white min-w-[45px]">
                              <div className="text-[10px] leading-tight">
                                Năng lực
                              </div>
                              <div className="text-sm font-bold">
                                {entry.competence_score.toFixed(1)}
                              </div>
                            </div>
                            <div className="text-center px-2 py-1 bg-[#008c8c] rounded text-white min-w-[45px]">
                              <div className="text-[10px] leading-tight">
                                Kỷ luật
                              </div>
                              <div className="text-sm font-bold">
                                {entry.discipline_score.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                          <div className="bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-500">Nộp:</span>
                            <span className="ml-1 font-semibold">
                              {entry.total_submissions}
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-500">Điểm:</span>
                            <span className="ml-1 font-semibold">
                              {entry.avg_score.toFixed(1)}
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-500">Đúng giờ:</span>
                            <span className="ml-1 font-semibold text-[#00994c]">
                              {entry.on_time_rate.toFixed(0)}%
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-500">Tổng:</span>
                            <span className="ml-1 font-semibold text-[#006633]">
                              {entry.total_score.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* Comment */}
                        {entry.teacher_comment && (
                          <p className="text-xs text-gray-600 italic bg-amber-50 p-2 rounded">
                            {entry.teacher_comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}