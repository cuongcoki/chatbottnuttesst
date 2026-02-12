import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp, BookOpen } from "lucide-react";

interface QuizStatsProps {
  stats: {
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    pendingQuizzes: number;
  };
}

const QuizStats = ({ stats }: QuizStatsProps) => {
  const statItems = [
    {
      label: "Tổng bài tập",
      value: stats.totalQuizzes,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Đã hoàn thành",
      value: stats.completedQuizzes,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Chờ làm bài",
      value: stats.pendingQuizzes,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Điểm trung bình",
      value: stats.averageScore.toFixed(1),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            </div>
            <div className={`p-3  ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuizStats;