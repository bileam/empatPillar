"use client";

import { useSyncExternalStore } from "react";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import { getCertificatesByUserId } from "@/data/dummy/certificates";
import {
  getLearningProgressVersion,
  getModuleProgress,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";
import { learningModules } from "@/data/dummy/modules";

export default function UserProfilePage() {
  const participant = useCurrentParticipant();
  const progressVersion = useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const progressReady = progressVersion > 0;
  const moduleProgress = learningModules.map((module) =>
    getModuleProgress(module.id),
  );
  const completedModules = progressReady
    ? moduleProgress.filter((progress) => progress.isCompleted).length
    : 0;
  const completedLessons = progressReady
    ? moduleProgress.reduce(
        (total, progress) => total + progress.completedLessons,
        0,
      )
    : 0;
  const totalLessons = moduleProgress.reduce(
    (total, progress) => total + progress.totalLessons,
    0,
  );
  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);
  const certificateCount = progressReady
    ? participant
      ? getCertificatesByUserId(participant.id).length
      : 0
    : 0;
  const participantName = participant?.name.trim() || "Peserta";
  const participantInitials =
    participantName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase("id-ID"))
      .join("") || "P";

  return (
    <div className="mx-auto w-full max-w-[1100px] text-foreground">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">Akun peserta</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Profil Peserta
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Informasi peserta dan ringkasan pembelajaran Anda.
        </p>
      </header>

      <section
        aria-label="Informasi peserta"
        className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7"
      >
        <div className="flex items-center gap-4 sm:gap-5">
          <span
            aria-label={`Inisial ${participantName}`}
            className="grid size-16 shrink-0 place-items-center rounded-full border border-secondary-200 bg-secondary-50 text-xl font-semibold text-secondary-700 sm:size-20 sm:text-2xl"
          >
            {participantInitials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Nama peserta
            </p>
            <h2 className="mt-1 break-words text-xl font-bold sm:text-2xl">
              {participantName}
            </h2>
            <p className="mt-1 text-sm text-muted">Peserta belajar</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="learning-summary-heading" className="mt-6">
        <div className="mb-4">
          <h2
            className="text-lg font-bold tracking-tight"
            id="learning-summary-heading"
          >
            Ringkasan Pembelajaran
          </h2>
          <p className="mt-1 text-sm text-muted">
            Progres dihitung dari materi yang telah diselesaikan di setiap
            modul.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">Modul selesai</p>
            <p className="mt-2 text-2xl font-bold">
              {progressReady ? completedModules : "--"}
            </p>
            <p className="mt-1 text-xs text-muted">
              dari {learningModules.length} modul
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">Seluruh modul</p>
            <p className="mt-2 text-2xl font-bold">{learningModules.length}</p>
            <p className="mt-1 text-xs text-muted">modul pembelajaran</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">Progres belajar</p>
            <p className="mt-2 text-2xl font-bold">
              {progressReady ? `${progressPercentage}%` : "--"}
            </p>
            <div
              aria-label={
                progressReady
                  ? `Progres belajar ${progressPercentage}%`
                  : "Memuat progres belajar"
              }
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progressReady ? progressPercentage : 0}
              className="mt-3 h-2 overflow-hidden rounded-full bg-secondary-50"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${progressReady ? progressPercentage : 0}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {progressReady
                ? `${completedLessons} dari ${totalLessons} materi selesai`
                : "Memuat progres..."}
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">Sertifikat diperoleh</p>
            <p className="mt-2 text-2xl font-bold">
              {progressReady ? certificateCount : "--"}
            </p>
            <p className="mt-1 text-xs text-muted">
              sertifikat yang telah diterbitkan
            </p>
          </article>
        </div>
      </section>

      <p className="mt-7 pb-2 text-center text-xs text-muted">
        Informasi ini menggunakan data simulasi peserta pada prototipe.
      </p>
    </div>
  );
}
