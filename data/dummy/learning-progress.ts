import { getCurrentUserId } from "@/data/dummy/auth-session";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";
import { getQuizByLessonId } from "@/data/dummy/quizzes";

export type LessonProgress = {
  lessonId: string;
  videoCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number | null;
  isPassed: boolean;
  completedAt: string | null;
};

export type ModuleProgress = {
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  isCompleted: boolean;
  certificateUnlocked: boolean;
};

export const simulatedUserId = "user-001";
const legacyStorageKey = "empat-pilar:learning-progress:v1";
const learningProgressStorageKey = "empat-pilar:learning-progress:v2";
const migrationStorageKey = "empat-pilar:learning-progress:migrated:v2";
const storageVersion = 2;

type StoredProgress = {
  version: 2;
  users: Record<string, Record<string, LessonProgress>>;
};

const moduleIds = new Set(learningModules.map((module) => module.id));
const lessonById = new Map(
  learningLessons.map((lesson) => [lesson.id, lesson]),
);
const lessonsByModule = new Map(
  learningModules.map((module) => [
    module.id,
    learningLessons
      .filter((lesson) => lesson.moduleId === module.id)
      .sort((first, second) => first.order - second.order),
  ]),
);
let progressByUser = new Map<string, Map<string, LessonProgress>>();
const listeners = new Set<() => void>();
const hydrationListeners = new Set<() => void>();
let progressVersion = 0;
let hasHydratedLearningProgress = false;
let hasInvalidStoredProgress = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createEmptyProgress(): Map<string, LessonProgress> {
  return new Map(
    learningLessons.map((lesson) => [
      lesson.id,
      {
        lessonId: lesson.id,
        videoCompleted: false,
        quizCompleted: false,
        quizScore: null,
        isPassed: false,
        completedAt: null,
      },
    ]),
  );
}

function cloneProgressMap(
  progress: Map<string, LessonProgress>,
): Map<string, LessonProgress> {
  return new Map(
    [...progress].map(([lessonId, lessonProgress]) => [
      lessonId,
      { ...lessonProgress },
    ]),
  );
}

function assertValidLessonId(lessonId: string) {
  if (!lessonById.has(lessonId)) {
    throw new Error(`Materi tidak ditemukan: ${lessonId}`);
  }
}

function assertValidModuleId(moduleId: string) {
  if (!moduleIds.has(moduleId)) {
    throw new Error(`Modul tidak ditemukan: ${moduleId}`);
  }
}

function isValidProgress(
  value: unknown,
  lessonId: string,
): value is LessonProgress {
  if (!isRecord(value)) {
    return false;
  }

  const progress = value as Partial<LessonProgress>;
  const quizScore = progress.quizScore;
  const completedAt = progress.completedAt;
  if (
    progress.lessonId !== lessonId ||
    typeof progress.videoCompleted !== "boolean" ||
    typeof progress.quizCompleted !== "boolean" ||
    typeof progress.isPassed !== "boolean" ||
    quizScore === undefined ||
    (quizScore !== null &&
      (typeof quizScore !== "number" ||
        !Number.isInteger(quizScore) ||
        quizScore < 0 ||
        quizScore > 100)) ||
    completedAt === undefined ||
    (completedAt !== null &&
      (typeof completedAt !== "string" ||
        !Number.isFinite(Date.parse(completedAt))))
  ) {
    return false;
  }

  if (progress.quizCompleted !== (quizScore !== null)) {
    return false;
  }
  if (progress.quizCompleted && !progress.videoCompleted) {
    return false;
  }
  if (progress.quizCompleted) {
    const quiz = getQuizByLessonId(lessonId);
    if (
      !quiz ||
      quizScore === null ||
      progress.isPassed !== (quizScore >= quiz.passingScore)
    ) {
      return false;
    }
  }
  if (progress.isPassed) {
    const quiz = getQuizByLessonId(lessonId);
    return Boolean(
      progress.videoCompleted &&
        progress.quizCompleted &&
        quiz &&
        quizScore !== null &&
        quizScore >= quiz.passingScore &&
        completedAt,
    );
  }

  return completedAt === null;
}

function decodeUserProgress(
  value: unknown,
): Map<string, Map<string, LessonProgress>> | undefined {
  if (
    !isRecord(value) ||
    value.version !== storageVersion ||
    !isRecord(value.users)
  ) {
    return undefined;
  }

  const users = new Map<string, Map<string, LessonProgress>>();
  for (const [userId, userProgress] of Object.entries(value.users)) {
    if (!userId || !isRecord(userProgress)) {
      return undefined;
    }

    const lessons = new Map<string, LessonProgress>();
    for (const [lessonId, progress] of Object.entries(userProgress)) {
      if (!lessonById.has(lessonId) || !isValidProgress(progress, lessonId)) {
        return undefined;
      }
      lessons.set(lessonId, { ...progress });
    }
    users.set(userId, lessons);
  }

  return users;
}

function decodeLegacyProgress(value: unknown): Map<string, LessonProgress> | undefined {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !isRecord(value.progress)
  ) {
    return undefined;
  }

  const lessons = new Map<string, LessonProgress>();
  for (const [lessonId, progress] of Object.entries(value.progress)) {
    if (!lessonById.has(lessonId) || !isValidProgress(progress, lessonId)) {
      return undefined;
    }
    lessons.set(lessonId, { ...progress });
  }
  return lessons;
}

function encodeUserProgress(
  users: Map<string, Map<string, LessonProgress>>,
): StoredProgress {
  return {
    version: storageVersion,
    users: Object.fromEntries(
      [...users].map(([userId, lessons]) => [
        userId,
        Object.fromEntries(lessons),
      ]),
    ),
  };
}

function readStoredUserProgress(): Map<string, Map<string, LessonProgress>> {
  const storedValue = window.localStorage.getItem(learningProgressStorageKey);
  if (storedValue === null) {
    return new Map();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    throw new Error(
      "Data progres tersimpan rusak dan dipertahankan tanpa perubahan.",
    );
  }

  const users = decodeUserProgress(parsed);
  if (!users) {
    throw new Error(
      "Format progres peserta tidak valid; data lama dipertahankan tanpa perubahan.",
    );
  }
  return users;
}

function persistUserProgress(
  users: Map<string, Map<string, LessonProgress>>,
) {
  window.localStorage.setItem(
    learningProgressStorageKey,
    JSON.stringify(encodeUserProgress(users)),
  );
}

function notifyProgressChanged() {
  progressVersion += 1;
  listeners.forEach((listener) => listener());
}

function notifyLearningProgressHydrated() {
  hydrationListeners.forEach((listener) => listener());
  notifyProgressChanged();
}

function hydrateLearningProgress() {
  if (typeof window === "undefined" || hasHydratedLearningProgress) {
    return;
  }

  try {
    const storedValue = window.localStorage.getItem(
      learningProgressStorageKey,
    );
    if (storedValue === null) {
      progressByUser = new Map();
    } else {
      let parsed: unknown;
      try {
        parsed = JSON.parse(storedValue);
      } catch {
        throw new Error(
          "Data progres tersimpan rusak dan dipertahankan tanpa perubahan.",
        );
      }

      const users = decodeUserProgress(parsed);
      if (!users) {
        throw new Error(
          "Format progres peserta tidak valid; data lama dipertahankan tanpa perubahan.",
        );
      }
      progressByUser = users;
    }

    if (window.localStorage.getItem(migrationStorageKey) !== "1") {
      const legacyValue = window.localStorage.getItem(legacyStorageKey);
      if (legacyValue !== null && !progressByUser.has(simulatedUserId)) {
        let legacyParsed: unknown;
        try {
          legacyParsed = JSON.parse(legacyValue);
        } catch {
          throw new Error(
            "Data progres lama rusak dan dipertahankan tanpa perubahan.",
          );
        }

        const legacyProgress = decodeLegacyProgress(legacyParsed);
        if (!legacyProgress) {
          throw new Error(
            "Format progres lama tidak valid; data lama dipertahankan tanpa perubahan.",
          );
        }
        progressByUser.set(simulatedUserId, legacyProgress);
        persistUserProgress(progressByUser);
      }
      window.localStorage.setItem(migrationStorageKey, "1");
    }
  } catch (error) {
    hasInvalidStoredProgress = true;
    console.warn(
      "Data progres tidak dapat dimuat atau dimigrasikan; data lama dipertahankan.",
      error,
    );
  }

  hasHydratedLearningProgress = true;
  notifyLearningProgressHydrated();
}

function getActiveUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return getCurrentUserId();
}

function getUserProgress(userId: string): Map<string, LessonProgress> {
  let progress = progressByUser.get(userId);
  if (!progress) {
    progress = createEmptyProgress();
    progressByUser.set(userId, progress);
  }
  return progress;
}

function getActiveLessonProgress(lessonId: string): LessonProgress {
  assertValidLessonId(lessonId);
  const userId = getActiveUserId();
  if (!userId) {
    return createEmptyProgress().get(lessonId)!;
  }

  const progress = getUserProgress(userId).get(lessonId);
  if (!progress) {
    throw new Error(`Progres materi tidak ditemukan: ${lessonId}`);
  }
  return progress;
}

function saveActiveUserProgress(userId: string) {
  if (hasInvalidStoredProgress) {
    throw new Error(
      "Progres tidak dapat disimpan karena data tersimpan tidak valid. Data lama tidak diubah.",
    );
  }

  let latestProgress: Map<string, Map<string, LessonProgress>>;
  try {
    latestProgress = readStoredUserProgress();
  } catch (error) {
    console.warn("Progres peserta tidak dapat dibaca sebelum disimpan.", error);
    throw error;
  }

  const activeProgress = getUserProgress(userId);
  latestProgress.set(userId, cloneProgressMap(activeProgress));

  try {
    persistUserProgress(latestProgress);
  } catch (error) {
    console.warn("Progres peserta tidak dapat disimpan.", error);
    throw new Error("Progres pembelajaran tidak dapat disimpan di browser.");
  }
  progressByUser = latestProgress;
  notifyProgressChanged();
}

function isActiveLessonUnlocked(lessonId: string, userId: string): boolean {
  const lesson = lessonById.get(lessonId);
  if (!lesson) {
    throw new Error(`Materi tidak ditemukan: ${lessonId}`);
  }

  const moduleLessons = lessonsByModule.get(lesson.moduleId);
  if (!moduleLessons || moduleLessons.length === 0) {
    throw new Error(`Materi tidak memiliki daftar modul: ${lessonId}`);
  }

  const lessonIndex = moduleLessons.findIndex(
    (moduleLesson) => moduleLesson.id === lessonId,
  );
  if (lessonIndex < 0) {
    throw new Error(`Materi tidak terdaftar pada modulnya: ${lessonId}`);
  }
  if (lessonIndex === 0) {
    return true;
  }

  const previousLesson = moduleLessons[lessonIndex - 1];
  const previousProgress =
    getUserProgress(userId).get(previousLesson.id) ??
    createEmptyProgress().get(previousLesson.id);
  return Boolean(
    previousProgress?.videoCompleted &&
      previousProgress.quizCompleted &&
      previousProgress.isPassed,
  );
}

export function onLearningProgressHydrated(listener: () => void) {
  hydrationListeners.add(listener);
  if (hasHydratedLearningProgress && typeof window !== "undefined") {
    listener();
  }
  return () => {
    hydrationListeners.delete(listener);
  };
}

export function getLessonProgress(lessonId: string): LessonProgress {
  return { ...getActiveLessonProgress(lessonId) };
}

export function isLessonUnlocked(lessonId: string): boolean {
  assertValidLessonId(lessonId);
  const userId = getActiveUserId();
  if (userId) {
    return isActiveLessonUnlocked(lessonId, userId);
  }
  const lesson = lessonById.get(lessonId)!;
  return lessonsByModule.get(lesson.moduleId)?.[0]?.id === lessonId;
}

export function completeLessonVideo(lessonId: string): LessonProgress {
  hydrateLearningProgress();
  const userId = getActiveUserId();
  if (!userId) {
    throw new Error("Peserta harus login untuk menyimpan progres pembelajaran.");
  }
  if (!isActiveLessonUnlocked(lessonId, userId)) {
    throw new Error(`Materi masih terkunci: ${lessonId}`);
  }

  const progress = getActiveLessonProgress(lessonId);
  const previousProgress = { ...progress };
  if (!progress.videoCompleted) {
    progress.videoCompleted = true;
    try {
      saveActiveUserProgress(userId);
    } catch (error) {
      Object.assign(progress, previousProgress);
      throw error;
    }
  }
  return { ...progress };
}

export function submitLessonQuiz(
  lessonId: string,
  score: number,
): LessonProgress {
  hydrateLearningProgress();
  const userId = getActiveUserId();
  if (!userId) {
    throw new Error("Peserta harus login untuk menyimpan progres kuis.");
  }
  const progress = getActiveLessonProgress(lessonId);
  const quiz = getQuizByLessonId(lessonId);

  if (!quiz) {
    throw new Error(`Kuis tidak ditemukan untuk materi: ${lessonId}`);
  }
  if (!isActiveLessonUnlocked(lessonId, userId)) {
    throw new Error(`Materi masih terkunci: ${lessonId}`);
  }
  if (!progress.videoCompleted) {
    throw new Error(`Video materi belum selesai: ${lessonId}`);
  }
  if (progress.isPassed) {
    throw new Error(`Kuis materi sudah lulus: ${lessonId}`);
  }
  if (!Number.isInteger(score) || score < 0 || score > 100) {
    throw new RangeError("Nilai kuis harus bilangan bulat antara 0 dan 100.");
  }

  const previousProgress = { ...progress };
  progress.quizCompleted = true;
  progress.quizScore = score;
  progress.isPassed = score >= quiz.passingScore;
  progress.completedAt = progress.isPassed ? new Date().toISOString() : null;
  try {
    saveActiveUserProgress(userId);
  } catch (error) {
    Object.assign(progress, previousProgress);
    throw error;
  }

  return { ...progress };
}

export function getModuleProgress(moduleId: string): ModuleProgress {
  assertValidModuleId(moduleId);

  const userId = getActiveUserId();
  const userProgress = userId
    ? getUserProgress(userId)
    : createEmptyProgress();
  const moduleLessons = lessonsByModule.get(moduleId) ?? [];
  const completedLessons = moduleLessons.filter(
    (lesson) => userProgress.get(lesson.id)?.isPassed,
  ).length;
  const totalLessons = moduleLessons.length;
  const isCompleted =
    totalLessons > 0 && completedLessons === totalLessons;

  return {
    moduleId,
    completedLessons,
    totalLessons,
    progressPercentage:
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100),
    isCompleted,
    certificateUnlocked: isCompleted,
  };
}

export function isModuleCompleted(moduleId: string): boolean {
  return getModuleProgress(moduleId).isCompleted;
}

export function subscribeToLearningProgress(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  listeners.add(listener);
  hydrateLearningProgress();

  function handleStorageChange(event: StorageEvent) {
    if (event.key === learningProgressStorageKey || event.key === null) {
      hasHydratedLearningProgress = false;
      hasInvalidStoredProgress = false;
      hydrateLearningProgress();
    }
  }
  window.addEventListener("storage", handleStorageChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function getLearningProgressVersion() {
  return progressVersion;
}
