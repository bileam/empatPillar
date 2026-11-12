"use client";

import Link from "next/link";
import { Suspense, use, useSyncExternalStore } from "react";
import {
  getQuizAttemptById,
  type QuizAttempt,
} from "@/data/dummy/quiz-attempts";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";
import { learningQuizzes } from "@/data/dummy/quizzes";

type QuizResultPageProps = {
  params: Promise<{ attemptId: string }>;
};

type QuizAttemptSnapshot =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "found"; attempt: QuizAttempt };

const loadingSnapshot: QuizAttemptSnapshot = { status: "loading" };
const missingSnapshot: QuizAttemptSnapshot = { status: "not-found" };
let cachedAttemptId: string | null = null;
let cachedAttemptJson: string | null | undefined;
let cachedAttemptSnapshot: QuizAttemptSnapshot = loadingSnapshot;

function subscribeToAttemptStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorageChange(event: StorageEvent) {
    if (
      event.key === null ||
      event.key === "empat-pilar:quiz-attempts:v1"
    ) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}

function getAttemptSnapshot(attemptId: string, userId: string | null) {
  if (typeof window === "undefined") {
    return loadingSnapshot;
  }

  const attempt = userId
    ? getQuizAttemptById(attemptId, userId)
    : undefined;
  const attemptJson = attempt ? JSON.stringify(attempt) : null;
  if (
    cachedAttemptId === `${userId ?? ""}:${attemptId}` &&
    cachedAttemptJson === attemptJson
  ) {
    return cachedAttemptSnapshot;
  }

  cachedAttemptId = `${userId ?? ""}:${attemptId}`;
  cachedAttemptJson = attemptJson;
  cachedAttemptSnapshot = attempt
    ? { status: "found", attempt }
    : missingSnapshot;
  return cachedAttemptSnapshot;
}

export default function QuizResultPage({ params }: QuizResultPageProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Memuat hasil ujian"
          className="mx-auto min-h-96 w-full max-w-[1000px] animate-pulse rounded-2xl bg-surface"
        />
      }
    >
      <QuizResultContent params={params} />
    </Suspense>
  );
}

function QuizResultContent({ params }: QuizResultPageProps) {
  const { attemptId } = use(params);
  const participant = useCurrentParticipant();
  const result = useSyncExternalStore(
    subscribeToAttemptStorage,
    () => getAttemptSnapshot(attemptId, participant?.id ?? null),
    () => loadingSnapshot,
  );

  if (result.status === "loading") {
    return (
      <div
        aria-label="Memuat hasil ujian"
        className="mx-auto min-h-96 w-full max-w-[1000px] animate-pulse rounded-2xl bg-surface"
      />
    );
  }

  if (result.status === "not-found") {
    return (
      <main className="mx-auto w-full max-w-[900px] text-center text-foreground">
        <section className="rounded-2xl border border-border bg-surface px-6 py-10 shadow-sm sm:px-10">
          <span
            aria-hidden="true"
            className="mx-auto grid size-14 place-items-center rounded-full bg-primary-50 text-primary-700"
          >
            <svg
              className="size-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            >
              <path d="M12 8v4m0 4h.01" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <h1 className="mt-4 text-xl font-bold">Hasil ujian tidak tersedia</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
            Data percobaan ini tidak ditemukan di penyimpanan browser. Silakan
            kembali ke daftar modul untuk melanjutkan pembelajaran.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/User/modul"
          >
            Kembali ke Modul
          </Link>
        </section>
      </main>
    );
  }

  const { attempt } = result;
  const learningModule = learningModules.find(
    (module) => module.id === attempt.moduleId,
  );
  const lesson = learningLessons.find(
    (item) => item.id === attempt.lessonId,
  );
  const quiz = learningQuizzes.find((item) => item.id === attempt.quizId);
  const wrongCount = Math.max(0, attempt.totalQuestions - attempt.correctCount);
  const completedAt = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(attempt.completedAt));

  return (
    <main className="mx-auto w-full max-w-[1000px] text-foreground">
      <header className="mb-6">
        <p className="text-sm font-medium text-primary">Ringkasan percobaan</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Hasil Ujian
        </h1>
      </header>

      <section
        aria-label="Ringkasan hasil ujian"
        className={`rounded-2xl border p-5 shadow-sm sm:p-7 ${
          attempt.passed
            ? "border-success-100 bg-success-50"
            : "border-primary-100 bg-primary-50"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                attempt.passed
                  ? "bg-white text-success-700"
                  : "bg-white text-primary-800"
              }`}
            >
              <span aria-hidden="true">{attempt.passed ? "✓" : "!"}</span>
              {attempt.passed ? "Lulus" : "Belum Lulus"}
            </span>
            <h2 className="mt-4 text-lg font-bold">
              {learningModule?.title ?? "Modul tidak tersedia"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {lesson?.title ?? quiz?.title ?? "Materi tidak tersedia"}
            </p>
            {quiz && lesson ? (
              <p className="mt-1 text-xs text-muted">{quiz.title}</p>
            ) : null}
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-medium text-muted">Nilai Akhir</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {attempt.score}
              <span className="text-2xl">%</span>
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/80 bg-white/80 p-3">
            <dt className="text-xs text-muted">Jawaban benar</dt>
            <dd className="mt-1 text-lg font-bold text-success-700">
              {attempt.correctCount}
            </dd>
          </div>
          <div className="rounded-xl border border-white/80 bg-white/80 p-3">
            <dt className="text-xs text-muted">Jawaban salah</dt>
            <dd className="mt-1 text-lg font-bold text-primary-700">
              {wrongCount}
            </dd>
          </div>
          <div className="rounded-xl border border-white/80 bg-white/80 p-3">
            <dt className="text-xs text-muted">Total soal</dt>
            <dd className="mt-1 text-lg font-bold">{attempt.totalQuestions}</dd>
          </div>
          <div className="col-span-2 rounded-xl border border-white/80 bg-white/80 p-3 sm:col-span-1">
            <dt className="text-xs text-muted">Waktu pengerjaan</dt>
            <dd className="mt-1 text-sm font-semibold">{completedAt}</dd>
          </div>
        </dl>

        <nav aria-label="Navigasi hasil ujian" className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href={`/User/modul/${attempt.moduleId}`}
          >
            Kembali ke Modul
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/User/riwayat-kuis"
          >
            Lihat Riwayat Kuis
          </Link>
          {!attempt.passed ? (
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              href={`/User/kuis/${attempt.quizId}`}
            >
              Ulangi Kuis
            </Link>
          ) : null}
        </nav>
      </section>

      <section aria-labelledby="discussion-heading" className="mt-8">
        <h2 className="text-lg font-bold" id="discussion-heading">
          Pembahasan Jawaban
        </h2>
        <ol className="mt-4 space-y-3">
          {attempt.questionSnapshots.map((question, index) => {
            const answer = attempt.answers.find(
              (item) => item.questionId === question.id,
            );
            const selectedAnswer = answer?.selectedAnswer;
            const isCorrect = selectedAnswer === question.correctAnswer;
            const selectedOption = question.options.find(
              (option) => option.id === selectedAnswer,
            );
            const correctOption = question.options.find(
              (option) => option.id === question.correctAnswer,
            );

            return (
              <li key={`${question.id}-${index}`}>
                <article
                  className={`rounded-2xl border bg-surface p-4 shadow-sm sm:p-5 ${
                    isCorrect ? "border-success-100" : "border-primary-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        isCorrect
                          ? "bg-success-50 text-success-700"
                          : "bg-primary-50 text-primary-800"
                      }`}
                    >
                      {isCorrect ? "✓" : "×"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Soal {index + 1}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold leading-6">
                        {question.question}
                      </h3>
                      <p
                        className={`mt-3 text-sm font-semibold ${
                          isCorrect ? "text-success-700" : "text-primary-800"
                        }`}
                      >
                        {isCorrect ? "Jawaban Anda benar" : "Jawaban Anda salah"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        Jawaban peserta:{" "}
                        <span className="font-medium text-foreground">
                          {selectedAnswer
                            ? `${selectedAnswer}. ${selectedOption?.text ?? "Pilihan tidak tersedia"}`
                            : "Tidak tersedia"}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        Jawaban benar:{" "}
                        <span className="font-medium text-foreground">
                          {correctOption
                            ? `${correctOption.id}. ${correctOption.text}`
                            : question.correctAnswer}
                        </span>
                      </p>
                      <p className="mt-3 border-t border-border pt-3 text-sm leading-6 text-muted">
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
