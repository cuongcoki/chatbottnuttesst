// ============================================
// HELPER FUNCTIONS
// ============================================

import { IAnswerMap, IParsedQuestion } from "./types";

/**
 * Parse answer string to map
 * @example parseAnswers("1-B,2-C,3-A") => { 1: "B", 2: "C", 3: "A" }
 */
export const parseAnswers = (answerString: string): IAnswerMap => {
  const map: IAnswerMap = {};
  const pairs = answerString.split(",");
  
  pairs.forEach((pair) => {
    const [num, answer] = pair.split("-");
    map[parseInt(num)] = answer;
  });
  
  return map;
};

/**
 * Convert answer map to string
 * @example answersToString({ 1: "B", 2: "C" }) => "1-B,2-C"
 */
export const answersToString = (answers: IAnswerMap): string => {
  return Object.entries(answers)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([num, answer]) => `${num}-${answer}`)
    .join(",");
};

/**
 * Calculate score
 */
export const calculateScore = (
  studentAnswers: string,
  correctAnswers: string,
  totalQuestions: number
): number => {
  const studentMap = parseAnswers(studentAnswers);
  const correctMap = parseAnswers(correctAnswers);
  
  let correctCount = 0;
  
  Object.keys(correctMap).forEach((key) => {
    if (studentMap[parseInt(key)] === correctMap[parseInt(key)]) {
      correctCount++;
    }
  });
  
  return Math.round((correctCount / totalQuestions) * 10 * 10) / 10; // Round to 1 decimal
};

/**
 * Parse quiz markdown content to questions
 */
export const parseQuizContent = (content: string): IParsedQuestion[] => {
  const questions: IParsedQuestion[] = [];
  const questionRegex = /##\s+\*\*Câu\s+(\d+)\*\*:\s+(.*?)(?=##|---|\n\n|$)/gs;
  
  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    const questionNumber = parseInt(match[1]);
    const questionBlock = match[2];
    
    // Extract question content and options
    const lines = questionBlock.split("\n").filter(line => line.trim());
    const questionContent = lines[0].trim();
    
    const options: { key: string; value: string }[] = [];
    lines.slice(1).forEach((line) => {
      const optionMatch = line.match(/\*\*([A-D])\.\*\*\s+(.*)/);
      if (optionMatch) {
        options.push({
          key: optionMatch[1],
          value: optionMatch[2].trim(),
        });
      }
    });
    
    questions.push({
      number: questionNumber,
      content: questionContent,
      options,
    });
  }
  
  return questions;
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "dễ":
      return "text-green-600 bg-green-50";
    case "trung bình":
      return "text-yellow-600 bg-yellow-50";
    case "khó":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

/**
 * Get score color
 */
export const getScoreColor = (score: number): string => {
  if (score >= 8) return "text-green-600";
  if (score >= 6.5) return "text-blue-600";
  if (score >= 5) return "text-yellow-600";
  return "text-red-600";
};
