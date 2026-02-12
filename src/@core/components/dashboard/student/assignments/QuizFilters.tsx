import { useState } from "react";
import { useQuizStore } from "@/services/useQuizStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";

const QuizFilters = () => {
  const { setQuizFilters, getAllQuiz, quizFilters } = useQuizStore();
  const [searchTerm, setSearchTerm] = useState("");

  const subjects = ["Toán", "Lý", "Hóa", "Sinh", "Văn", "Anh", "Sử", "Địa"];
  const difficulties = ["dễ", "trung bình", "khó"];

  const handleSubjectChange = (value: string) => {
    setQuizFilters({ subject: value === "all" ? null : value });
    getAllQuiz();
  };

  const handleDifficultyChange = (value: string) => {
    setQuizFilters({ difficulty: value === "all" ? null : value });
    getAllQuiz();
  };

  const handleClearFilters = () => {
    setQuizFilters({
      subject: null,
      difficulty: null,
      date_from: null,
      date_to: null,
    });
    setSearchTerm("");
    getAllQuiz();
  };

  const hasActiveFilters =
    quizFilters.subject || quizFilters.difficulty || searchTerm;

  return (
    <Card className="py-2 rounded-none shadow-none w-[50%] border-none">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bài tập..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-none"
          />
        </div>

        {/* Subject Filter */}
        <Select
          value={quizFilters.subject || "all"}
          onValueChange={handleSubjectChange}
        >
          <SelectTrigger className="min-w-[130px] rounded-none">
            <SelectValue placeholder="Môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={quizFilters.difficulty || "all"}
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger className="min-w-[130px] rounded-none">
            <SelectValue placeholder="Độ khó" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizFilters;
