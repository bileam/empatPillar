"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getQuizAttemptsByUserId,
  type QuizAttempt,
} from "@/data/dummy/quiz-attempts";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";
import { learningQuizzes } from "@/data/dummy/quizzes";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";

type QuizAttemptsSnapshot =
  | { status: "loading" }
  | { status: "loaded"; attempts: QuizAttempt[] };

const loadingSnapshot: QuizAttemptsSnapshot = { status: "loading" };
const emptySnapshot: QuizAttemptsSnapshot = {
  status: "loaded",
  attempts: [],
};
let cachedUserId: string | null = null;
let cachedAttemptsJson: string | undefined;
let cachedAttemptsSnapshot: QuizAttemptsSnapshot = loadingSnapshot;
const quizAttemptsStorageKey = "empat-pilar:quiz-attempts:v1";

function subscribeToQuizAttempts(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key === null || event.key === quizAttemptsStorageKey) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}

function getQuizAttemptsSnapshot(userId: string): QuizAttemptsSnapshot {
  if (typeof window === "undefined") {
    return loadingSnapshot;
  }

  const attempts = getQuizAttemptsByUserId(userId);
  const attemptsJson = JSON.stringify(attempts);
  if (cachedUserId === userId && cachedAttemptsJson === attemptsJson) {
    return cachedAttemptsSnapshot;
  }

  cachedUserId = userId;
  cachedAttemptsJson = attemptsJson;
  cachedAttemptsSnapshot = { status: "loaded", attempts };
  return cachedAttemptsSnapshot;
}

export default function QuizHistoryPage() {
  const participant = useCurrentParticipant();
  const userId = participant?.id ?? null;
  const snapshot = useSyncExternalStore(
    subscribeToQuizAttempts,
    () =>
      userId
        ? getQuizAttemptsSnapshot(userId)
        : emptySnapshot,
    () => loadingSnapshot,
  );

  return (
    <div className="mx-auto w-full max-w-[1100px] text-foreground">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">Aktivitas belajar</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Riwayat Kuis
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Lihat hasil setiap percobaan kuis yang tersimpan di browser ini.
        </p>
      </header>

      {snapshot.status === "loading" ? (
        <div
          aria-label="Memuat riwayat kuis"
          className="space-y-4"
        >
          {[1, 2, 3].map((item) => (
            <div
              aria-hidden="true"
              className="h-40 animate-pulse rounded-2xl border border-border bg-surface"
              key={item}
            />
          ))}
        </div>
      ) : snapshot.attempts.length > 0 ? (
        <section
          aria-label="Daftar riwayat percobaan kuis"
          className="space-y-4"
        >
          {snapshot.attempts.map((attempt) => {
            const learningModule = learningModules.find(
              (module) => module.id === attempt.moduleId,
            );
            const lesson = learningLessons.find(
              (item) => item.id === attempt.lessonId,
            );
            const quiz = learningQuizzes.find(
              (item) => item.id === attempt.quizId,
            );
            const completedAt = new Intl.DateTimeFormat("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(attempt.completedAt));

            return (
              <article
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
                key={attempt.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold">
                        {learningModule?.title ?? "Modul tidak tersedia"}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          attempt.passed
                            ? "bg-success-50 text-success-700"
                            : "bg-primary-50 text-primary-800"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${
                            attempt.passed ? "bg-success-700" : "bg-primary-700"
                          }`}
                        />
                        {attempt.passed ? "Lulus" : "Belum Lulus"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted">
                      {quiz?.title ?? "Kuis tidak tersedia"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Materi: {lesson?.title ?? "Tidak tersedia"}
                    </p>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="text-xs font-medium text-muted">
                      Nilai ujian
                    </p>
                    <p className="mt-0.5 text-2xl font-bold">
                      {attempt.score}
                      <span className="text-base">%</span>
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-muted">Jawaban benar</dt>
                    <dd className="mt-1 text-sm font-semibold text-success-700">
                      {attempt.correctCount} dari {attempt.totalQuestions} soal
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Jawaban salah</dt>
                    <dd className="mt-1 text-sm font-semibold text-primary-800">
                      {Math.max(
                        0,
                        attempt.totalQuestions - attempt.correctCount,
                      )}{" "}
                      soal
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-xs text-muted">Waktu pengerjaan</dt>
                    <dd className="mt-1 text-sm font-medium">{completedAt}</dd>
                  </div>
                </dl>

                <Link
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
                  href={`/User/hasil-ujian/${attempt.id}`}
                >
                  Lihat Hasil
                </Link>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-surface px-5 py-10 text-center shadow-sm sm:px-8">
          <span
            aria-hidden="true"
            className="mx-auto grid size-14 place-items-center rounded-full bg-background text-muted"
          >
            <svg
              className="size-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            >
              <path d="M8 4h8l4 4v12H4V4h4Z" />
              <path d="M8 4v5h8V4M8 14h8m-8 3h5" />
            </svg>
          </span>
          <h2 className="mt-4 text-lg font-bold">Belum ada riwayat kuis</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Riwayat percobaan akan muncul di sini setelah Anda menyelesaikan
            kuis.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/User/modul"
          >
            Jelajahi Modul
          </Link>
        </section>
      )}
    </div>
  );
}
