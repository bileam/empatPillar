"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ModuleIcon } from "@/components/modules/ModuleIcon";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import { getCertificatesByUserId } from "@/data/dummy/certificates";
import {
  getLearningProgressVersion,
  getModuleProgress,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";
import { learningModules } from "@/data/dummy/modules";
import { getQuizAttemptsByUserId } from "@/data/dummy/quiz-attempts";

function MetricIcon({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: string;
}) {
  return (
    <span
      className={`grid size-12 shrink-0 place-items-center rounded-xl text-white ${tone}`}
    >
      {children}
    </span>
  );
}

export default function UserDashboardPage() {
  const participant = useCurrentParticipant();
  const progressVersion = useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const progressReady = progressVersion > 0;
  const moduleProgress = learningModules.map((learningModule) =>
    getModuleProgress(learningModule.id),
  );
  const completedModules = progressReady
    ? moduleProgress.filter((progress) => progress.isCompleted).length
    : 0;
  const totalLessons = moduleProgress.reduce(
    (total, progress) => total + progress.totalLessons,
    0,
  );
  const completedLessons = progressReady
    ? moduleProgress.reduce(
        (total, progress) => total + progress.completedLessons,
        0,
      )
    : 0;
  const overallPercent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);
  const certificates = progressReady
    ? participant
      ? getCertificatesByUserId(participant.id)
      : []
    : [];
  const quizAttempts = progressReady
    ? participant
      ? getQuizAttemptsByUserId(participant.id).filter((attempt) =>
          learningModules.some((module) => module.id === attempt.moduleId),
        )
      : []
    : [];
  const averageScore =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((total, attempt) => total + attempt.score, 0) /
            quizAttempts.length,
        )
      : null;

  return (
    <div className="mx-auto w-full max-w-[1440px] text-foreground">
      <section aria-labelledby="welcome-heading" className="mb-8">
        <h2
          className="text-xl font-bold tracking-tight sm:text-2xl"
          id="welcome-heading"
        >
          Halo, {participant?.name.trim() || "Peserta"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Terus semangat untuk belajar nilai-nilai kebangsaan!
        </p>
      </section>

      <section
        aria-label="Ringkasan progres pembelajaran"
        className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Progres Pembelajaran</h2>
              <p className="mt-1.5 text-xs text-muted">
                {progressReady
                  ? `${completedModules} dari ${learningModules.length} modul selesai`
                  : "Memuat progres pembelajaran..."}
              </p>
            </div>
            <span className="text-sm font-semibold text-secondary-800">
              {progressReady ? `${overallPercent}%` : "--"}
            </span>
          </div>
          <div
            aria-label={
              progressReady
                ? `${overallPercent}% selesai`
                : "Memuat progres pembelajaran"
            }
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressReady ? overallPercent : 0}
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary-50"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressReady ? overallPercent : 0}%` }}
            />
          </div>
        </article>

        <article className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <MetricIcon tone="bg-primary">
            <svg
              aria-hidden="true"
              className="size-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            >
              <circle cx="12" cy="9" r="6" />
              <path d="m8.5 14-1 7 4.5-2.5 4.5 2.5-1-7" />
            </svg>
          </MetricIcon>
          <div>
            <p className="text-xs text-muted">Sertifikat</p>
            <p className="mt-1 text-xl font-bold">
              {progressReady ? certificates.length : "--"}
            </p>
          </div>
        </article>

        <article className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <MetricIcon tone="bg-warning">
            <svg
              aria-hidden="true"
              className="size-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.7"
            >
              <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
            </svg>
          </MetricIcon>
          <div>
            <p className="text-xs text-muted">Total Nilai</p>
            <p className="mt-1 text-xl font-bold">
              {!progressReady
                ? "Memuat..."
                : averageScore === null
                  ? "Belum ada nilai"
                  : `${averageScore}/100`}
            </p>
          </div>
        </article>
      </section>

      <section aria-labelledby="modules-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              className="text-lg font-bold tracking-tight"
              id="modules-heading"
            >
              Modul Pembelajaran
            </h2>
            <p className="mt-1 text-sm text-muted">
              Pilih salah satu modul untuk mulai belajar.
            </p>
          </div>
          <Link
            className="text-sm font-semibold text-primary transition hover:text-primary-800"
            href="/User/modul"
          >
            Lihat semua modul
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {learningModules.map((learningModule, index) => {
            const progress = getModuleProgress(learningModule.id);
            const progressPercentage = progressReady
              ? progress.progressPercentage
              : 0;

            return (
            <article
              className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
              key={learningModule.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`grid size-14 place-items-center rounded-xl text-white shadow-sm ${learningModule.colorClass}`}
                >
                  <ModuleIcon name={learningModule.icon} />
                </span>
                <span className="text-xs font-medium text-muted">
                  {index + 1} / {learningModules.length}
                </span>
              </div>

              <h3 className="mt-5 text-sm font-bold">{learningModule.title}</h3>
              <p className="mt-1.5 min-h-10 text-xs leading-5 text-muted">
                {learningModule.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 text-xs">
                <span className="text-xs text-muted">
                  {progressReady
                    ? `${progress.completedLessons}/${progress.totalLessons} materi selesai`
                    : "Memuat progres..."}
                </span>
                <span
                  className={`shrink-0 font-semibold ${
                    progressReady && progress.isCompleted
                      ? "text-success-700"
                      : "text-secondary-800"
                  }`}
                >
                  {progressReady
                    ? progress.isCompleted
                      ? "Selesai"
                      : `${progressPercentage}%`
                    : "--"}
                </span>
              </div>
              <div
                aria-label={
                  progressReady
                    ? `Progres ${learningModule.title}: ${progressPercentage}%`
                    : `Memuat progres ${learningModule.title}`
                }
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={progressPercentage}
                className="mt-2 h-2 overflow-hidden rounded-full bg-secondary-50"
                role="progressbar"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-end border-t border-border pt-3">
                <Link
                  aria-label={`Buka modul ${learningModule.title}`}
                  className="grid size-8 place-items-center rounded-full text-muted transition group-hover:bg-primary-50 group-hover:text-primary"
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
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <p className="mt-8 pb-2 text-center text-xs text-muted">
        Data dashboard ini merupakan simulasi untuk prototipe.
      </p>
    </div>
  );
}