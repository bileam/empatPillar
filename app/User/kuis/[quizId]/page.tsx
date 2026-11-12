"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  Suspense,
  use,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { learningQuizzes, type QuizQuestion } from "@/data/dummy/quizzes";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import {
  saveQuizAttempt,
  type QuizAttempt,
} from "@/data/dummy/quiz-attempts";
import {
  getLearningProgressVersion,
  getLessonProgress,
  isLessonUnlocked,
  subscribeToLearningProgress,
  submitLessonQuiz,
} from "@/data/dummy/learning-progress";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";

type QuizPageProps = {
  params: Promise<{ quizId: string }>;
};

type QuizResult = Pick<
  QuizAttempt,
  "score" | "correctCount" | "totalQuestions" | "passed"
>;

export default function UserQuizPage({ params }: QuizPageProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Memuat kuis"
          className="mx-auto min-h-96 w-full max-w-[1000px] animate-pulse rounded-2xl bg-surface"
        />
      }
    >
      <QuizContent params={params} />
    </Suspense>
  );
}

function QuizContent({ params }: QuizPageProps) {
  const { quizId } = use(params);
  const router = useRouter();
  const participant = useCurrentParticipant();
  useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const submissionInProgress = useRef(false);

  const quiz = learningQuizzes.find((item) => item.id === quizId);
  if (!quiz) {
    notFound();
  }
  const resolvedQuizId = quiz.id;
  const quizLessonId = quiz.lessonId;
  const quizQuestions = quiz.questions;

  const lesson = learningLessons.find((item) => item.id === quiz.lessonId);
  if (!lesson) {
    notFound();
  }

  const learningModule = learningModules.find(
    (item) => item.id === lesson.moduleId,
  );
  if (!learningModule) {
    notFound();
  }

  const lessonProgress = getLessonProgress(quiz.lessonId);
  const unlocked = isLessonUnlocked(quiz.lessonId);
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = quiz.questions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const allQuestionsAnswered = answeredCount === quiz.questions.length;
  const nextLesson = learningLessons
    .filter((item) => item.moduleId === learningModule.id)
    .sort((first, second) => first.order - second.order)
    .find((item) => item.order > lesson.order);
  const nextLessonUnlocked = nextLesson
    ? isLessonUnlocked(nextLesson.id)
    : false;

  function chooseAnswer(questionId: string, optionId: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionId,
    }));
    setActionError(null);
  }

  function handleSubmitQuiz() {
    if (submissionInProgress.current || result) {
      return;
    }

    if (!allQuestionsAnswered) {
      setActionError(
        `Jawab semua pertanyaan terlebih dahulu. ${quizQuestions.length - answeredCount} soal belum dijawab.`,
      );
      return;
    }

    if (!window.confirm("Yakin ingin mengumpulkan jawaban kuis ini?")) {
      return;
    }

    submissionInProgress.current = true;
    setActionError(null);
    let attempt: QuizAttempt;
    try {
      if (!participant) {
        throw new Error("Silakan masuk kembali sebelum mengirimkan kuis.");
      }
      attempt = saveQuizAttempt({
        userId: participant.id,
        quizId: resolvedQuizId,
        answers,
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Jawaban kuis belum dapat disimpan.",
      );
      submissionInProgress.current = false;
      return;
    }

    try {
      submitLessonQuiz(quizLessonId, attempt.score);
    } catch (error) {
      const progressError =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui progres pembelajaran.";
      setActionError(
        `Hasil kuis sudah tersimpan di riwayat, tetapi progres pembelajaran belum berhasil diperbarui. ${progressError} Pengiriman ulang akan membuat percobaan baru di riwayat.`,
      );
      submissionInProgress.current = false;
      return;
    }

    setResult({
      score: attempt.score,
      correctCount: attempt.correctCount,
      totalQuestions: attempt.totalQuestions,
      passed: attempt.passed,
    });
    router.push(`/User/hasil-ujian/${attempt.id}`);
  }

  function retryQuiz() {
    submissionInProgress.current = false;
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setActionError(null);
  }

  if (!unlocked || !lessonProgress.videoCompleted) {
    return (
      <main className="mx-auto w-full max-w-[900px] text-foreground">
        <section className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-background text-muted">
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 1 1 8 0v3" />
            </svg>
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight">
            Kuis belum dapat diakses
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
            {!unlocked
              ? "Selesaikan materi sebelumnya dan lulus kuisnya terlebih dahulu."
              : "Selesaikan video materi ini sebelum mengerjakan kuis."}
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            href={`/User/pembelajaran/${lesson.id}`}
          >
            Kembali ke materi
          </Link>
        </section>
      </main>
    );
  }

  if (lessonProgress.isPassed && !result) {
    return (
      <main className="mx-auto w-full max-w-[900px] text-foreground">
        <section className="rounded-2xl border border-success-100 bg-success-50 p-6 text-center sm:p-10">
          <h1 className="text-xl font-bold text-success-700">
            Kuis sudah lulus
          </h1>
          <p className="mt-2 text-sm text-success-700">
            Nilai terbaik Anda untuk materi ini adalah{" "}
            <strong>{lessonProgress.quizScore}</strong>.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            href={`/User/modul/${learningModule.id}`}
          >
            Kembali ke modul
          </Link>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="mx-auto w-full max-w-[900px] text-foreground">
        <section className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold">Kuis belum memiliki soal</h1>
          <p className="mt-2 text-sm text-muted">
            Silakan kembali ke halaman materi.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
            href={`/User/pembelajaran/${lesson.id}`}
          >
            Kembali ke materi
          </Link>
        </section>
      </main>
    );
  }

  if (result) {
    return (
      <QuizResultView
        answers={answers}
        learningModuleId={learningModule.id}
        lessonId={lesson.id}
        nextLessonId={nextLessonUnlocked ? nextLesson?.id : undefined}
        questions={quiz.questions}
        result={result}
        retryQuiz={retryQuiz}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1000px] text-foreground">
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
        href={`/User/pembelajaran/${lesson.id}`}
      >
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali ke materi
      </Link>

      <header className="mb-6">
        <p className="text-sm font-medium text-primary">
          {learningModule.title} · {lesson.title}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {quiz.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {quiz.description}
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-foreground">
              Soal {currentQuestionIndex + 1} dari {quiz.questions.length}
            </span>
            <span className="text-muted">
              {answeredCount}/{quiz.questions.length} dijawab
            </span>
          </div>
          <div
            aria-label={`Progres kuis: ${Math.round((answeredCount / quiz.questions.length) * 100)}%`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.round(
              (answeredCount / quiz.questions.length) * 100,
            )}
            className="h-2 overflow-hidden rounded-full bg-secondary-50"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${(answeredCount / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_190px]">
          <div>
            <div className="rounded-xl bg-background p-4 sm:p-5">
              <p className="text-base font-semibold leading-7 sm:text-lg">
                {currentQuestion.question}
              </p>
            </div>

            <fieldset className="mt-5 space-y-3">
              <legend className="mb-3 text-sm font-semibold">
                Pilih satu jawaban:
              </legend>
              {currentQuestion.options.map((option) => {
                const isSelected =
                  answers[currentQuestion.id] === option.id;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isSelected
                        ? "border-primary bg-primary-50 text-foreground"
                        : "border-border bg-white hover:border-primary-200 hover:bg-background"
                    }`}
                    key={option.id}
                    onClick={() =>
                      chooseAnswer(currentQuestion.id, option.id)
                    }
                    type="button"
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-background text-muted"
                      }`}
                    >
                      {option.id}
                    </span>
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </fieldset>
          </div>

          <aside aria-label="Navigasi nomor soal">
            <h2 className="text-sm font-semibold">Navigasi Soal</h2>
            <div className="mt-3 grid grid-cols-5 gap-2 lg:grid-cols-4">
              {quiz.questions.map((question: QuizQuestion, index: number) => {
                const isCurrent = currentQuestionIndex === index;
                const isAnswered = answers[question.id] !== undefined;

                return (
                  <button
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Soal ${index + 1}${isAnswered ? ", sudah dijawab" : ", belum dijawab"}`}
                    className={`grid aspect-square place-items-center rounded-lg border text-sm font-semibold transition ${
                      isCurrent
                        ? "border-primary bg-primary text-white"
                        : isAnswered
                          ? "border-primary-200 bg-primary-50 text-primary-800"
                          : "border-border bg-white text-muted hover:border-primary-200"
                    }`}
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Pilih nomor soal untuk berpindah. Jawaban tersimpan selama kuis
              berlangsung.
            </p>
          </aside>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentQuestionIndex === 0}
            onClick={() =>
              setCurrentQuestionIndex((index) => Math.max(0, index - 1))
            }
            type="button"
          >
            Soal Sebelumnya
          </button>

          <div className="flex flex-wrap gap-3">
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-50"
                onClick={() =>
                  setCurrentQuestionIndex((index) =>
                    Math.min(quiz.questions.length - 1, index + 1),
                  )
                }
                type="button"
              >
                Soal Berikutnya
              </button>
            ) : null}
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              onClick={handleSubmitQuiz}
              type="button"
            >
              Kumpulkan Jawaban
            </button>
          </div>
        </div>

        {actionError ? (
          <p
            className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800"
            role="alert"
          >
            {actionError}
          </p>
        ) : null}
      </section>
    </main>
  );
}

function QuizResultView({
  answers,
  learningModuleId,
  lessonId,
  nextLessonId,
  questions,
  result,
  retryQuiz,
}: {
  answers: Record<string, string>;
  learningModuleId: string;
  lessonId: string;
  nextLessonId?: string;
  questions: QuizQuestion[];
  result: QuizResult;
  retryQuiz: () => void;
}) {
  const wrongCount = result.totalQuestions - result.correctCount;

  return (
    <main className="mx-auto w-full max-w-[1000px] text-foreground">
      <section
        className={`rounded-2xl border p-5 shadow-sm sm:p-7 ${
          result.passed
            ? "border-success-100 bg-success-50"
            : "border-primary-100 bg-primary-50"
        }`}
      >
        <p className="text-sm font-semibold">
          {result.passed ? "Selamat, Anda lulus!" : "Kuis belum lulus"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Nilai {result.score}
        </h1>
        <p className="mt-2 text-sm">
          {result.correctCount} jawaban benar · {wrongCount} jawaban salah dari{" "}
          {result.totalQuestions} soal
        </p>
        <p className="mt-1 text-sm">
          {result.passed
            ? "Nilai Anda memenuhi batas kelulusan 80."
            : "Nilai minimal untuk lulus adalah 80. Anda dapat mengulang kuis."}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {result.passed ? (
            <>
              {nextLessonId ? (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                  href={`/User/pembelajaran/${nextLessonId}`}
                >
                  Lanjut ke materi berikutnya
                </Link>
              ) : null}
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/70"
                href={`/User/modul/${learningModuleId}`}
              >
                Kembali ke detail modul
              </Link>
            </>
          ) : (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
              onClick={retryQuiz}
              type="button"
            >
              Ulangi Kuis
            </button>
          )}
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
            href={`/User/pembelajaran/${lessonId}`}
          >
            Kembali ke materi
          </Link>
        </div>
      </section>

      <section aria-labelledby="discussion-heading" className="mt-7">
        <h2 className="text-lg font-bold" id="discussion-heading">
          Pembahasan Jawaban
        </h2>
        <ol className="mt-4 space-y-3">
          {questions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = selectedAnswer === question.correctAnswer;
            const correctOption = question.options.find(
              (option) => option.id === question.correctAnswer,
            );
            const selectedOption = question.options.find(
              (option) => option.id === selectedAnswer,
            );

            return (
              <li key={question.id}>
                <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        isCorrect
                          ? "bg-success-50 text-success-700"
                          : "bg-primary-50 text-primary-800"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">
                        {question.question}
                      </h3>
                      <p
                        className={`mt-2 text-xs font-semibold ${
                          isCorrect ? "text-success-700" : "text-primary-800"
                        }`}
                      >
                        {isCorrect
                          ? "Jawaban Anda benar"
                          : `Jawaban Anda: ${selectedAnswer ?? "Belum dijawab"}${selectedOption ? `. ${selectedOption.text}` : ""}`}
                      </p>
                      {!isCorrect && correctOption ? (
                        <p className="mt-1 text-xs font-medium text-success-700">
                          Jawaban benar: {correctOption.id}. {correctOption.text}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
