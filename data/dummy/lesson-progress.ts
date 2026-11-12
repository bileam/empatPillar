import { learningLessons } from "@/data/dummy/lessons";

export type SimulatedLessonProgress = {
  videoCompleted: boolean;
  quizScore: number | null;
};

export const simulatedLessonProgress: Record<
  string,
  SimulatedLessonProgress
> = Object.fromEntries(
  learningLessons.map((lesson) => [
    lesson.id,
    { videoCompleted: false, quizScore: null },
  ]),
);
