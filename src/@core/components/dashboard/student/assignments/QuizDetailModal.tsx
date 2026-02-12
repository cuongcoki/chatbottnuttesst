import { useState, useEffect } from "react";
import { IQuiz } from "@/infra/apiRAG/type/IQuiz";
import { ISubmission } from "@/infra/apiRAG/type/ISubmission";
import { useQuizStore } from "@/services/useQuizStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  FileText,
  AlertCircle,
  PlayCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { parseAnswers } from "@/infra/apiRAG/type/quiz/helpers";

interface QuizDetailModalProps {
  quiz: IQuiz;
  submission?: ISubmission; // Thêm submission prop
  isOpen: boolean;
  onClose: () => void;
}

const QuizDetailModal = ({
  quiz,
  submission,
  isOpen,
  onClose,
}: QuizDetailModalProps) => {
  const { setCurrentQuiz, parseCurrentQuiz, parsedQuiz, calculateQuizResult } =
    useQuizStore();
  const [isStarting, setIsStarting] = useState(false);
  console.log("quiz", quiz);
  

  useEffect(() => {
    if (isOpen && quiz) {
      setCurrentQuiz(quiz);
      parseCurrentQuiz(quiz);

      // Nếu có submission, tính toán kết quả
      if (submission) {
        calculateQuizResult(submission, quiz);
      }
    }
  }, [isOpen, quiz, submission]);

  const handleStartQuiz = () => {
    setIsStarting(true);
    // TODO: Navigate to quiz taking page
    setTimeout(() => {
      setIsStarting(false);
      onClose();
      // router.push(`/student/quiz/${quiz.id}`);
    }, 1000);
  };

  const formatLatexContent = (content: string) => {
    return content
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!--\s*ANSWER_KEY:.*?-->/gi, "")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$");
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6.5) return "text-blue-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-50 border-green-200";
    if (score >= 6.5) return "bg-blue-50 border-blue-200";
    if (score >= 5) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  // Parse answers if submission exists
  const correctAnswers = submission ? parseAnswers(quiz.answer_key) : null;
  const studentAnswers = submission
    ? parseAnswers(submission.student_answers)
    : null;

  const isCompleted = !!submission;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{quiz.topic}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{quiz.subject}</Badge>
                <Badge
                  variant="outline"
                  className={
                    quiz.difficulty === "dễ"
                      ? "bg-green-100 text-green-700"
                      : quiz.difficulty === "trung bình"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {quiz.difficulty}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Đã hoàn thành
                  </Badge>
                )}
              </div>
            </div>

            {/* Score Display */}
            {submission && (
              <div
                className={`flex flex-col items-center p-4 rounded-lg border-2 ${getScoreBgColor(
                  submission.score
                )}`}
              >
                <Award className="w-6 h-6 mb-1 text-yellow-500" />
                <span
                  className={`text-3xl font-bold ${getScoreColor(
                    submission.score
                  )}`}
                >
                  {submission.score}
                </span>
                <span className="text-xs text-gray-600">điểm</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {isCompleted ? (
          // Hiển thị kết quả nếu đã làm bài
          <Tabs defaultValue="result" className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="result">Kết quả</TabsTrigger>
              <TabsTrigger value="preview">Nội dung đề</TabsTrigger>
            </TabsList>

            {/* Result Tab */}
            <TabsContent value="result" className="mt-4">
              <ScrollArea className="max-h-[55vh] pr-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <FileText className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {quiz.num_questions}
                    </p>
                    <p className="text-xs text-gray-600">Tổng số câu</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {
                        Object.keys(correctAnswers || {}).filter(
                          (key) =>
                            correctAnswers![parseInt(key)] ===
                            studentAnswers![parseInt(key)]
                        ).length
                      }
                    </p>
                    <p className="text-xs text-gray-600">Câu đúng</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <XCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {
                        Object.keys(correctAnswers || {}).filter(
                          (key) =>
                            correctAnswers![parseInt(key)] !==
                            studentAnswers![parseInt(key)]
                        ).length
                      }
                    </p>
                    <p className="text-xs text-gray-600">Câu sai</p>
                  </div>
                </div>

                {/* Submission Info */}
                <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Thời gian làm bài:</span>
                      <span className="font-semibold ml-2">
                        {submission?.duration} phút
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày nộp:</span>
                      <span className="font-semibold ml-2">
                        {new Date(
                          submission?.submitted_at || ""
                        ).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Answers */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Chi tiết từng câu
                  </h3>

                  {parsedQuiz?.questions.map((question) => {
                    const questionNum = question.number;
                    const studentAnswer = studentAnswers?.[questionNum] || "";
                    const correctAnswer = correctAnswers?.[questionNum] || "";
                    const isCorrect = studentAnswer === correctAnswer;

                    return (
                      <div
                        key={questionNum}
                        className={`mb-4 p-4 rounded-lg border-2 ${
                          isCorrect
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">
                              Câu {questionNum}: {question.content}
                            </h4>

                            <div className="space-y-2">
                              {question.options.map((option) => {
                                const isStudentAnswer =
                                  option.key === studentAnswer;
                                const isCorrectAnswer =
                                  option.key === correctAnswer;

                                return (
                                  <div
                                    key={option.key}
                                    className={`p-2 rounded ${
                                      isCorrectAnswer
                                        ? "bg-green-100 border-2 border-green-400"
                                        : isStudentAnswer && !isCorrect
                                        ? "bg-red-100 border-2 border-red-400"
                                        : "bg-white"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">
                                        {option.key}.
                                      </span>
                                      <ReactMarkdown
                                        children={formatLatexContent(
                                          option.value
                                        )}
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                      />
                                      {isCorrectAnswer && (
                                        <Badge className="bg-green-600 text-white text-xs">
                                          Đáp án đúng
                                        </Badge>
                                      )}
                                      {isStudentAnswer && !isCorrect && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          Bạn chọn
                                        </Badge>
                                      )}
                                      {isStudentAnswer && isCorrect && (
                                        <Badge className="bg-green-600 text-white text-xs">
                                          Bạn chọn đúng
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-4">
              <ScrollArea className="max-h-[55vh] pr-4">
                <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4">
                  <ReactMarkdown
                    children={formatLatexContent(quiz.content)}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          // Hiển thị preview và nút bắt đầu nếu chưa làm bài
          <ScrollArea className="max-h-[60vh] pr-4">
            {/* Quiz Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Số câu hỏi</p>
                    <p className="font-semibold text-gray-900">
                      {quiz.num_questions} câu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Thời gian</p>
                    <p className="font-semibold text-gray-900">
                      {quiz.time_limit} phút
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">
                    Lưu ý quan trọng
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Đề thi chỉ được làm một lần duy nhất</li>
                    <li>
                      • Thời gian làm bài sẽ bắt đầu ngay khi bạn nhấn "Bắt đầu"
                    </li>
                    <li>• Hãy chuẩn bị kỹ trước khi bắt đầu</li>
                    <li>• Không được sử dụng tài liệu khi làm bài</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quiz Content Preview */}
            {parsedQuiz && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Nội dung đề thi</h3>
                <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4">
                  <ReactMarkdown
                    children={formatLatexContent(quiz.content)}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  />
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Đề thi gồm{" "}
                    <strong>{parsedQuiz.questions.length} câu hỏi</strong> trắc
                    nghiệm. Mỗi câu có 4 đáp án A, B, C, D.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>

          {!isCompleted && (
            <Button
              onClick={handleStartQuiz}
              disabled={isStarting}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang chuẩn bị...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Bắt đầu làm bài
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizDetailModal;
