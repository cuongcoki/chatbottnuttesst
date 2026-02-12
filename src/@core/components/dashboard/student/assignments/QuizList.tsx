import { IQuiz } from "@/infra/apiRAG/type/IQuiz";
import { ISubmission } from "@/infra/apiRAG/type/ISubmission";
import QuizCard from "./QuizCard";
import { Loader2, BookOpen } from "lucide-react";

interface QuizListProps {
  quizzes: IQuiz[];
  submissions: ISubmission[];
  isLoading: boolean;
  onViewQuiz: (quiz: IQuiz) => void;
}

const QuizList = ({
  quizzes,
  submissions,
  isLoading,
  onViewQuiz,
}: QuizListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-white  shadow-sm p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16  bg-gray-100 mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chưa có bài tập nào
        </h3>
        <p className="text-gray-500">
          Hiện tại chưa có bài tập được giao. Hãy quay lại sau nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quizzes.map((quiz) => {
        const submission = submissions.find((s) => s.quiz_id === quiz.id);
        return (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            submission={submission}
            onViewQuiz={onViewQuiz}
          />
        );
      })}
    </div>
  );
};

export default QuizList;