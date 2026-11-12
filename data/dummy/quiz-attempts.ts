import { getCurrentUserId } from "@/data/dummy/auth-session";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";
import {
  calculateQuizScore,
  learningQuizzes,
  type QuizQuestion,
} from "@/data/dummy/quizzes";

type AnswerOptionId = QuizQuestion["correctAnswer"];

export type QuizAttemptAnswer = {
  questionId: string;
  selectedAnswer: AnswerOptionId;
};

export type QuizAttemptQuestionSnapshot = {
  id: string;
  question: string;
  options: QuizQuestion["options"];
  correctAnswer: AnswerOptionId;
  explanation: string;
};

export type QuizAttempt = {
  id: string;
  userId: string;
  quizId: string;
  lessonId: string;
  moduleId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  completedAt: string;
  answers: QuizAttemptAnswer[];
  questionSnapshots: QuizAttemptQuestionSnapshot[];
};

export type SaveQuizAttemptInput = {
  userId: string;
  quizId: string;
  answers: Record<string, string>;
};

const quizAttemptsStorageKey = "empat-pilar:quiz-attempts:v1";
const storageVersion = 1;
const optionIds = new Set<AnswerOptionId>(["A", "B", "C", "D"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionId(value: unknown): value is AnswerOptionId {
  return typeof value === "string" && optionIds.has(value as AnswerOptionId);
}

function isValidQuestionSnapshot(
  value: unknown,
): value is QuizAttemptQuestionSnapshot {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id ||
    typeof value.question !== "string" ||
    typeof value.explanation !== "string" ||
    !isOptionId(value.correctAnswer) ||
    !Array.isArray(value.options)
  ) {
    return false;
  }

  const optionIdsInQuestion = value.options.map((option) =>
    isRecord(option) ? option.id : undefined,
  );
  return (
    optionIdsInQuestion.length > 0 &&
    optionIdsInQuestion.every(isOptionId) &&
    new Set(optionIdsInQuestion).size === optionIdsInQuestion.length &&
    optionIdsInQuestion.includes(value.correctAnswer) &&
    value.options.every(
      (option) => isRecord(option) && typeof option.text === "string",
    )
  );
}

function isValidAttemptAnswer(value: unknown): value is QuizAttemptAnswer {
  return (
    isRecord(value) &&
    typeof value.questionId === "string" &&
    isOptionId(value.selectedAnswer)
  );
}

function isValidQuizAttempt(value: unknown): value is QuizAttempt {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id ||
    typeof value.userId !== "string" ||
    !value.userId ||
    typeof value.quizId !== "string" ||
    !value.quizId ||
    typeof value.lessonId !== "string" ||
    !value.lessonId ||
    typeof value.moduleId !== "string" ||
    !value.moduleId ||
    !Number.isInteger(value.score) ||
    Number(value.score) < 0 ||
    Number(value.score) > 100 ||
    !Number.isInteger(value.correctCount) ||
    Number(value.correctCount) < 0 ||
    !Number.isInteger(value.totalQuestions) ||
    Number(value.totalQuestions) <= 0 ||
    Number(value.correctCount) > Number(value.totalQuestions) ||
    !Number.isInteger(value.passingScore) ||
    Number(value.passingScore) < 0 ||
    Number(value.passingScore) > 100 ||
    typeof value.passed !== "boolean" ||
    typeof value.completedAt !== "string" ||
    !Number.isFinite(Date.parse(value.completedAt)) ||
    !Array.isArray(value.answers) ||
    !Array.isArray(value.questionSnapshots)
  ) {
    return false;
  }

  const answers = value.answers.filter(isValidAttemptAnswer);
  const questionSnapshots =
    value.questionSnapshots.filter(isValidQuestionSnapshot);
  if (
    answers.length !== value.answers.length ||
    questionSnapshots.length !== value.questionSnapshots.length ||
    answers.length !== value.totalQuestions ||
    questionSnapshots.length !== value.totalQuestions
  ) {
    return false;
  }

  const snapshotIds = questionSnapshots.map((question) => question.id);
  const answerIds = answers.map((answer) => answer.questionId);
  if (
    new Set(snapshotIds).size !== snapshotIds.length ||
    new Set(answerIds).size !== answerIds.length ||
    !answerIds.every((id) => typeof id === "string" && snapshotIds.includes(id)) ||
    !answers.every(
      (answer) =>
        questionSnapshots.some(
          (question) =>
            question.id === answer.questionId &&
            question.options.some(
              (option) => option.id === answer.selectedAnswer,
            ),
        ),
    )
  ) {
    return false;
  }

  const correctCount = answers.filter((answer) =>
    questionSnapshots.some(
      (question) =>
        question.id === answer.questionId &&
        question.correctAnswer === answer.selectedAnswer,
    ),
  ).length;
  const expectedScore = Math.round(
    (correctCount / Number(value.totalQuestions)) * 100,
  );

  return (
    correctCount === value.correctCount &&
    expectedScore === value.score &&
    value.passed === (Number(value.score) >= Number(value.passingScore))
  );
}

function cloneQuizAttempt(attempt: QuizAttempt): QuizAttempt {
  return {
    ...attempt,
    answers: attempt.answers.map((answer) => ({ ...answer })),
    questionSnapshots: attempt.questionSnapshots.map((question) => ({
      ...question,
      options: question.options.map((option) => ({ ...option })),
    })),
  };
}

function readStoredQuizAttempts(): QuizAttempt[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(quizAttemptsStorageKey);
    if (!storedValue) {
      return [];
    }

    const parsed: unknown = JSON.parse(storedValue);
    if (
      !isRecord(parsed) ||
      parsed.version !== storageVersion ||
      !Array.isArray(parsed.attempts)
    ) {
      console.warn(
        "Data riwayat kuis tersimpan memiliki format atau versi yang tidak valid; riwayat tidak dapat dimuat.",
      );
      return [];
    }

    const attempts: QuizAttempt[] = [];
    const seenIds = new Set<string>();
    for (const item of parsed.attempts) {
      if (!isValidQuizAttempt(item) || seenIds.has(item.id)) {
        continue;
      }

      attempts.push(cloneQuizAttempt(item));
      seenIds.add(item.id);
    }

    return attempts.sort(
      (first, second) =>
        Date.parse(second.completedAt) - Date.parse(first.completedAt),
    );
  } catch (error) {
    console.warn("Data riwayat kuis tersimpan tidak dapat dibaca.", error);
    return [];
  }
}

function createAttemptId(existingIds: Set<string>) {
  let id: string;

  do {
    const randomId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    id = `quiz-attempt-${randomId}`;
  } while (existingIds.has(id));

  return id;
}

export function getQuizAttempts(): QuizAttempt[] {
  return readStoredQuizAttempts();
}

export function getQuizAttemptById(
  attemptId: string,
  userId?: string,
): QuizAttempt | undefined {
  const attempt = readStoredQuizAttempts().find(
    (item) =>
      item.id === attemptId && (userId === undefined || item.userId === userId),
  );
  return attempt ? cloneQuizAttempt(attempt) : undefined;
}

export function getQuizAttemptsByUserId(userId: string): QuizAttempt[] {
  if (typeof userId !== "string" || !userId.trim()) {
    throw new Error("ID pengguna wajib diisi untuk membaca riwayat kuis.");
  }

  return readStoredQuizAttempts().filter(
    (attempt) => attempt.userId === userId,
  );
}

export function saveQuizAttempt(data: SaveQuizAttemptInput): QuizAttempt {
  if (typeof window === "undefined") {
    throw new Error("Percobaan kuis hanya dapat disimpan di browser.");
  }
  const activeUserId = getCurrentUserId();
  if (!activeUserId || data.userId !== activeUserId) {
    throw new Error(
      "Peserta harus login untuk menyimpan percobaan kuis miliknya sendiri.",
    );
  }

  const quiz = learningQuizzes.find((item) => item.id === data.quizId);
  if (!quiz) {
    throw new Error(`Kuis tidak ditemukan: ${data.quizId}`);
  }

  const lesson = learningLessons.find((item) => item.id === quiz.lessonId);
  if (!lesson || !learningModules.some((item) => item.id === lesson.moduleId)) {
    throw new Error(`Materi atau modul kuis tidak ditemukan: ${quiz.id}`);
  }

  const questionIds = new Set(quiz.questions.map((question) => question.id));
  const providedQuestionIds = Object.keys(data.answers);
  if (
    providedQuestionIds.length !== quiz.questions.length ||
    providedQuestionIds.some((questionId) => !questionIds.has(questionId)) ||
    quiz.questions.some((question) => {
      const selectedAnswer = data.answers[question.id];
      return (
        !isOptionId(selectedAnswer) ||
        !question.options.some((option) => option.id === selectedAnswer)
      );
    })
  ) {
    throw new Error("Jawaban percobaan kuis tidak lengkap atau tidak valid.");
  }

  const scoreResult = calculateQuizScore(quiz.questions, data.answers);
  const attemptAnswers: QuizAttemptAnswer[] = quiz.questions.map((question) => {
    const selectedAnswer = data.answers[question.id];
    if (!isOptionId(selectedAnswer)) {
      throw new Error("Jawaban percobaan kuis tidak lengkap atau tidak valid.");
    }

    return { questionId: question.id, selectedAnswer };
  });
  const attempts = readStoredQuizAttempts();
  const attempt: QuizAttempt = {
    id: createAttemptId(new Set(attempts.map((item) => item.id))),
    userId: data.userId,
    quizId: quiz.id,
    lessonId: lesson.id,
    moduleId: lesson.moduleId,
    score: scoreResult.score,
    correctCount: scoreResult.correctCount,
    totalQuestions: scoreResult.totalQuestions,
    passed: scoreResult.passed,
    passingScore: quiz.passingScore,
    completedAt: new Date().toISOString(),
    answers: attemptAnswers,
    questionSnapshots: quiz.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options.map((option) => ({ ...option })),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    })),
  };

  const updatedAttempts = [...attempts, attempt].sort(
    (first, second) =>
      Date.parse(second.completedAt) - Date.parse(first.completedAt),
  );

  try {
    window.localStorage.setItem(
      quizAttemptsStorageKey,
      JSON.stringify({ version: storageVersion, attempts: updatedAttempts }),
    );
  } catch (error) {
    console.warn("Percobaan kuis tidak dapat disimpan.", error);
    throw new Error("Percobaan kuis tidak dapat disimpan di browser.");
  }

  return cloneQuizAttempt(attempt);
}

export function removeQuizAttempt(attemptId: string): void {
  if (typeof window === "undefined") {
    throw new Error("Percobaan kuis hanya dapat dihapus di browser.");
  }

  const attempts = readStoredQuizAttempts();
  const updatedAttempts = attempts.filter((attempt) => attempt.id !== attemptId);
  if (updatedAttempts.length === attempts.length) {
    return;
  }

  try {
    window.localStorage.setItem(
      quizAttemptsStorageKey,
      JSON.stringify({ version: storageVersion, attempts: updatedAttempts }),
    );
  } catch (error) {
    console.warn("Percobaan kuis tidak dapat dibatalkan.", error);
    throw new Error("Catatan percobaan kuis tidak dapat dibatalkan.");
  }
}
