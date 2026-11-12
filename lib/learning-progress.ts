import type { LearningLesson } from "@/data/dummy/lessons";
import { learningLessons } from "@/data/dummy/lessons";
import {
  type SimulatedLessonProgress,
  simulatedLessonProgress,
} from "@/data/dummy/lesson-progress";

export const QUIZ_PASSING_SCORE = 80;

export type LessonAccess = {
  lesson: LearningLesson;
  progress: SimulatedLessonProgress;
  isUnlocked: boolean;
  isCompleted: boolean;
};

export function getModuleLessonAccess(moduleId: string): LessonAccess[] {
  const lessons = learningLessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((first, second) => first.order - second.order);
  let previousLessonCompleted = true;

  return lessons.map((lesson) => {
    const progress = simulatedLessonProgress[lesson.id];

    if (!progress) {
      throw new Error(`Progress simulasi tidak ditemukan: ${lesson.id}`);
    }

    const isUnlocked = previousLessonCompleted;
    const isCompleted =
      isUnlocked &&
      progress.videoCompleted &&
      progress.quizScore !== null &&
      progress.quizScore >= QUIZ_PASSING_SCORE;

    previousLessonCompleted = isCompleted;

    return { lesson, progress, isUnlocked, isCompleted };
  });
}

export function getModuleProgress(moduleId: string) {
  const lessons = getModuleLessonAccess(moduleId);
  const completedLessons = lessons.filter((lesson) => lesson.isCompleted).length;
  const totalLessons = lessons.length;

  return {
    completedLessons,
    totalLessons,
    percent:
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100),
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
  };
}
