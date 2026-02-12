import { useEffect, useState } from "react";
import { useQuizStore } from "@/services/useQuizStore";
import { useAuthStore } from "@/utility/stores/authStore";
import QuizList from "@/@core/components/dashboard/student/assignments/QuizList";
import QuizFilters from "@/@core/components/dashboard/student/assignments/QuizFilters";
import QuizStats from "@/@core/components/dashboard/student/assignments/QuizStats";
import QuizDetailModal from "@/@core/components/dashboard/student/assignments/QuizDetailModal";
import { IQuiz } from "@/infra/apiRAG/type/IQuiz";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, History, BarChart3 } from "lucide-react";
import QuizStatistics from "@/@core/components/dashboard/student/assignments/QuizStatistics";

const StudentAssignments = () => {
  const { user } = useAuthStore();
  const { quizzes, submissions, isLoading, getAllQuiz, getSubmissions } =
    useQuizStore();
    console.log('🎨 StudentAssignments - quizzes:', quizzes, 'submissions:', submissions, 'isLoading:', isLoading);

  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (user?.id) {
      getAllQuiz({ student_id: user.id });
      getSubmissions({ student_id: user.id });
    }
  }, [user?.id]);

  const handleViewQuiz = (quiz: IQuiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedQuiz(null);
    setIsModalOpen(false);
  };

  // Calculate stats
  const stats = {
    totalQuizzes: quizzes.length,
    completedQuizzes: submissions.length,
    averageScore:
      submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + sub.score, 0) /
          submissions.length
        : 0,
    pendingQuizzes: quizzes.filter(
      (q) => !submissions.some((s) => s.quiz_id === q.id)
    ).length,
  };

  return (
    <div className="min-h-screen bg-white p-2 ">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bài tập & Kiểm tra
              </h1>
              <p className="text-sm text-gray-500">
                Quản lý và hoàn thành bài tập được giao
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <QuizStats stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="assignments" className="space-y-2 ">
          <TabsList className="bg-white p-2 shadow-sm rounded-none">
            <TabsTrigger value="assignments"className="gap-2 py-3 data-[state=active]:bg-[var(--color-primary-light)] data-[state=active]:text-white" >
              <BookOpen className="w-4 h-4" />
              Bài tập mới
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 py-3 data-[state=active]:bg-[var(--color-primary-light)] data-[state=active]:text-white">
              <History className="w-4 h-4" />
              Lịch sử làm bài
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2 py-3 data-[state=active]:bg-[var(--color-primary-light)] data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Thống kê
            </TabsTrigger>
          </TabsList>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <QuizFilters />
            <QuizList
              quizzes={quizzes}
              submissions={submissions}
              isLoading={isLoading}
              onViewQuiz={handleViewQuiz}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="bg-white  shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Lịch sử làm bài ({submissions.length})
              </h2>
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có bài làm nào</p>
                  </div>
                ) : (
                  submissions.map((submission) => {
                    const quiz = quizzes.find((q) => q.id === submission.quiz_id);
                    return (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 border  hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {quiz?.topic || "Unknown Quiz"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {quiz?.subject} • {quiz?.difficulty}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Nộp lúc:{" "}
                            {new Date(submission.submitted_at).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              submission.score >= 8
                                ? "text-green-600"
                                : submission.score >= 6.5
                                ? "text-blue-600"
                                : submission.score >= 5
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {submission.score}
                          </div>
                          <p className="text-xs text-gray-500">
                            {submission.duration} phút
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Thống kê chi tiết</h2>
             <QuizStatistics quizzes={quizzes} submissions={submissions}/>
              {/* <p className="text-gray-500">Tính năng đang được phát triển...</p> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <QuizDetailModal
          quiz={selectedQuiz}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          submission={submissions.find((s) => s.quiz_id === selectedQuiz.id)}
        />
      )}
    </div>
  );
};

export default StudentAssignments;