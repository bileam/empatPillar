"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, use, useState, useSyncExternalStore } from "react";
import { getQuizByLessonId } from "@/data/dummy/quizzes";
import {
  completeLessonVideo,
  getLearningProgressVersion,
  getLessonProgress,
  isLessonUnlocked,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

function isValidYouTubeVideoId(videoId: string) {
  return /^[A-Za-z0-9_-]{11}$/.test(videoId);
}

export default function LearningLessonPage({ params }: LessonPageProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Memuat materi pembelajaran"
          className="mx-auto aspect-video w-full max-w-[1100px] animate-pulse rounded-2xl bg-surface"
        />
      }
    >
      <LearningLessonContent params={params} />
    </Suspense>
  );
}

function LearningLessonContent({ params }: LessonPageProps) {
  const { lessonId } = use(params);
  const progressVersion = useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const lesson = learningLessons.find((item) => item.id === lessonId);
  if (!lesson) {
    notFound();
  }

  const learningModule = learningModules.find(
    (item) => item.id === lesson.moduleId,
  );
  if (!learningModule) {
    notFound();
  }

  const moduleLessons = learningLessons
    .filter((item) => item.moduleId === learningModule.id)
    .sort((first, second) => first.order - second.order);
  const lessonIndex = moduleLessons.findIndex((item) => item.id === lesson.id);
  if (lessonIndex < 0) {
    notFound();
  }

  const previousLesson = moduleLessons[lessonIndex - 1];
  const nextLesson = moduleLessons[lessonIndex + 1];
  const unlocked = isLessonUnlocked(lesson.id);
  const progress = getLessonProgress(lesson.id);
  const quiz = getQuizByLessonId(lesson.id);

  if (!unlocked) {
    return (
      <main className="mx-auto w-full max-w-[900px] text-foreground">
        <section
          aria-labelledby="locked-heading"
          className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-10"
        >
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
          <h1
            className="mt-4 text-xl font-bold tracking-tight"
            id="locked-heading"
          >
            Materi masih terkunci
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
            Selesaikan video dan lulus kuis materi sebelumnya terlebih dahulu
            untuk membuka materi ini.
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

  const videoAvailable = isValidYouTubeVideoId(lesson.videoId);

  function handleCompleteVideo() {
    setActionError(null);
    try {
      completeLessonVideo(lessonId);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Video belum dapat ditandai selesai.",
      );
    }
  }

  return (
    <main
      className="mx-auto w-full max-w-[1100px] text-foreground"
      data-progress-version={progressVersion}
    >
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
        href={`/User/modul/${learningModule.id}`}
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
        Kembali ke modul {learningModule.title}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <section aria-label="Video pembelajaran" className="mb-6">
            {videoAvailable ? (
              <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="size-full"
                  src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(lesson.videoId)}`}
                  title={`Video pembelajaran: ${lesson.title}`}
                />
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-border bg-slate-900 px-6 text-center text-white shadow-sm">
                <span className="grid size-16 place-items-center rounded-full border border-white/20 bg-white/10">
                  <svg
                    aria-hidden="true"
                    className="size-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m10 9 5 3-5 3V9Z" />
                  </svg>
                </span>
                <p className="mt-4 text-base font-semibold">
                  Video belum tersedia
                </p>
                <p className="mt-1 max-w-md text-sm leading-6 text-white/70">
                  Video untuk materi ini belum ditambahkan. Area ini akan
                  menampilkan video pembelajaran saat tersedia.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {learningModule.title} · Materi {lesson.order} dari{" "}
              {moduleLessons.length}
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              {lesson.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              {lesson.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted">
              <span>Durasi {lesson.duration} menit</span>
              <span>
                Status: {progress.isPassed ? "Lulus" : "Sedang dipelajari"}
              </span>
              {progress.quizCompleted && !progress.isPassed ? (
                <span>Nilai kuis terakhir: {progress.quizScore}</span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {progress.videoCompleted ? (
                <p className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-success-50 px-4 py-2.5 text-sm font-semibold text-success-700">
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  Video telah diselesaikan
                </p>
              ) : (
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={handleCompleteVideo}
                  type="button"
                >
                  Tandai Video Selesai
                </button>
              )}

              {progress.videoCompleted && quiz ? (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-50"
                  href={`/User/kuis/${quiz.id}`}
                >
                  {progress.quizCompleted && !progress.isPassed
                    ? "Ulangi Kuis"
                    : progress.isPassed
                      ? "Lihat Kuis"
                      : "Lanjut ke Kuis"}
                </Link>
              ) : null}
            </div>

            {progress.videoCompleted && !quiz ? (
              <p className="mt-3 text-sm text-muted">
                Kuis untuk materi ini belum tersedia.
              </p>
            ) : null}
            {actionError ? (
              <p className="mt-3 text-sm font-medium text-primary" role="alert">
                {actionError}
              </p>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-sm font-bold">Navigasi Materi</h2>
            <div className="mt-4 space-y-3">
              {previousLesson ? (
                <Link
                  className="block rounded-xl border border-border p-3 transition hover:border-primary-200 hover:bg-background"
                  href={`/User/pembelajaran/${previousLesson.id}`}
                >
                  <span className="text-xs text-muted">Materi sebelumnya</span>
                  <span className="mt-1 block text-sm font-medium">
                    {previousLesson.title}
                  </span>
                </Link>
              ) : (
                <p className="rounded-xl bg-background p-3 text-xs text-muted">
                  Ini adalah materi pertama.
                </p>
              )}

              {nextLesson ? (
                isLessonUnlocked(nextLesson.id) ? (
                  <Link
                    className="block rounded-xl border border-border p-3 transition hover:border-primary-200 hover:bg-background"
                    href={`/User/pembelajaran/${nextLesson.id}`}
                  >
                    <span className="text-xs text-muted">Materi berikutnya</span>
                    <span className="mt-1 block text-sm font-medium">
                      {nextLesson.title}
                    </span>
                  </Link>
                ) : (
                  <div className="rounded-xl bg-background p-3">
                    <span className="text-xs text-muted">
                      Materi berikutnya · Terkunci
                    </span>
                    <span className="mt-1 block text-sm font-medium text-muted">
                      {nextLesson.title}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-muted">
                      Selesaikan video ini dan lulus kuis untuk membukanya.
                    </span>
                  </div>
                )
              ) : (
                <p className="rounded-xl bg-background p-3 text-xs text-muted">
                  Ini adalah materi terakhir dalam modul.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>

      <p className="mt-6 pb-2 text-center text-xs text-muted">
        Progres pembelajaran menggunakan data simulasi lokal.
      </p>
    </main>
  );
}
