import { IQuiz } from "@/infra/apiRAG/type/IQuiz";
import { ISubmission } from "@/infra/apiRAG/type/ISubmission";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  CheckCircle2,
  PlayCircle,
  Trophy,
} from "lucide-react";

interface QuizCardProps {
  quiz: IQuiz;
  submission?: ISubmission;
  onViewQuiz: (quiz: IQuiz) => void;
}

const QuizCard = ({ quiz, submission, onViewQuiz }: QuizCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "dễ":
        return "bg-green-50 text-green-700 border-green-200";
      case "trung bình":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "khó":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6.5) return "text-blue-600 bg-blue-50";
    if (score >= 5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const isCompleted = !!submission;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary-light cursor-pointer rounded-none p-0">
      <div className="p-4 space-y-3">
        {/* Header - Subject & Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0.5 mb-2 bg-blue-50 text-blue-700"
            >
              {quiz.subject}
            </Badge>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
              {quiz.topic}
            </h3>
          </div>

          {/* Score Badge */}
          {isCompleted && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${getScoreColor(
                submission.score
              )}`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-lg font-bold">{submission.score}</span>
            </div>
          )}
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>{quiz.num_questions} câu</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{quiz.time_limit}p</span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0 h-5 ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </Badge>
        </div>

        {/* Status or Action */}
        {isCompleted ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>
                Hoàn thành •{" "}
                {new Date(submission.submitted_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <Button
              onClick={() => onViewQuiz(quiz)}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Xem chi tiết
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => onViewQuiz(quiz)}
            size="sm"
            className="w-full h-8 text-xs gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Bắt đầu làm bài
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizCard;