"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Suspense,
  use,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { ModuleIcon } from "@/components/modules/ModuleIcon";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import {
  getCertificateByModuleId,
  issueCertificate,
  type LearningCertificate,
} from "@/data/dummy/certificates";
import {
  hasModuleRating,
  saveModuleRating,
} from "@/data/dummy/module-ratings";
import {
  getLearningProgressVersion,
  getLessonProgress,
  getModuleProgress,
  isModuleCompleted,
  isLessonUnlocked,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";
import { QUIZ_PASSING_SCORE } from "@/lib/learning-progress";

type ModuleDetailPageProps = {
  params: Promise<{ moduleId: string }>;
};

function StatusIcon({
  status,
}: {
  status: "completed" | "available" | "locked";
}) {
  if (status === "completed") {
    return (
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
    );
  }

  if (status === "locked") {
    return (
      <svg
        aria-hidden="true"
        className="size-5"
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
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M8 5H5v14h14v-3M9 15l10-10M12 5h7v7" />
    </svg>
  );
}

export default function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Memuat detail modul"
          className="mx-auto min-h-64 w-full max-w-[1100px] animate-pulse rounded-2xl bg-surface"
        />
      }
    >
      <ModuleDetail params={params} />
    </Suspense>
  );
}

function ModuleDetail({ params }: ModuleDetailPageProps) {
  const { moduleId } = use(params);
  const participant = useCurrentParticipant();
  const progressVersion = useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const [issuedCertificate, setIssuedCertificate] = useState<
    LearningCertificate | undefined
  >(undefined);
  const [certificateMessage, setCertificateMessage] = useState<string | null>(
    null,
  );
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [isRatingFormOpen, setIsRatingFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const learningModule = learningModules.find(
    (item) => item.id === moduleId,
  );

  if (!learningModule) {
    notFound();
  }
  if (!participant) {
    return (
      <p className="text-sm font-medium text-primary-800" role="alert">
        Identitas peserta tidak tersedia.
      </p>
    );
  }
  const activeParticipant = participant;

  const resolvedModuleId = learningModule.id;
  const moduleLessons = learningLessons
    .filter((lesson) => lesson.moduleId === resolvedModuleId)
    .sort((first, second) => first.order - second.order);
  const progress = getModuleProgress(resolvedModuleId);
  const moduleCompleted = isModuleCompleted(resolvedModuleId);
  const certificate =
    issuedCertificate ??
    getCertificateByModuleId(activeParticipant.id, resolvedModuleId);

  function issueModuleCertificate() {
    setCertificateMessage(null);
    setCertificateError(null);

    try {
      const newCertificate = issueCertificate(
        activeParticipant.id,
        resolvedModuleId,
        activeParticipant.name,
      );
      if (!newCertificate) {
        setCertificateError(
          "Sertifikat belum dapat diterbitkan. Selesaikan seluruh materi dan lulus setiap kuis terlebih dahulu.",
        );
        return;
      }

      setIssuedCertificate(newCertificate);
      setCertificateMessage("Sertifikat berhasil diterbitkan.");
    } catch (error) {
      setCertificateError(
        error instanceof Error
          ? error.message
          : "Sertifikat belum dapat diterbitkan. Silakan coba kembali.",
      );
    }
  }

  function handleIssueCertificate() {
    setRatingError(null);
    setRatingMessage(null);

    try {
      if (!hasModuleRating(activeParticipant.id, resolvedModuleId)) {
        setIsRatingFormOpen(true);
        return;
      }

      setIsRatingFormOpen(false);
      issueModuleCertificate();
    } catch (error) {
      setCertificateError(
        error instanceof Error
          ? error.message
          : "Status penilaian tidak dapat diperiksa. Silakan coba kembali.",
      );
    }
  }

  function handleSubmitRating(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRatingError(null);
    setRatingMessage(null);

    if (selectedRating === null) {
      setRatingError("Pilih rating bintang 1 sampai 5 terlebih dahulu.");
      return;
    }

    const trimmedReview = review.trim();
    if (!trimmedReview) {
      setRatingError("Ulasan wajib diisi.");
      return;
    }

    try {
      const result = saveModuleRating(
        activeParticipant.id,
        resolvedModuleId,
        selectedRating,
        trimmedReview,
      );
      setIsRatingFormOpen(false);
      setRatingMessage(
        result.status === "saved"
          ? "Penilaian berhasil disimpan. Anda sekarang dapat menerbitkan sertifikat."
          : "Penilaian untuk modul ini sudah pernah diberikan. Anda sekarang dapat menerbitkan sertifikat.",
      );
    } catch (error) {
      setRatingError(
        error instanceof Error
          ? error.message
          : "Penilaian tidak dapat disimpan. Silakan coba kembali.",
      );
    }
  }

  return (
    <div
      className="mx-auto w-full max-w-[1100px] text-foreground"
      data-progress-version={progressVersion}
    >
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
        href="/User/modul"
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
        Kembali ke daftar modul
      </Link>

      <section className="mb-7 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <span
            className={`grid size-14 shrink-0 place-items-center rounded-xl text-white shadow-sm sm:size-16 ${learningModule.colorClass}`}
          >
            <ModuleIcon name={learningModule.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-primary">
              Modul Pembelajaran
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              {learningModule.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              {learningModule.description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold">Progres pembelajaran</span>
              <span className="text-muted">
                {progress.completedLessons} dari {progress.totalLessons} materi
                selesai
              </span>
            </div>
            <div
              aria-label={`Progres ${learningModule.title}: ${progress.progressPercentage}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress.progressPercentage}
              className="h-2.5 overflow-hidden rounded-full bg-secondary-50"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-primary sm:text-right">
            {progress.progressPercentage}%
          </span>
        </div>
      </section>

      {moduleCompleted ? (
        <section
          aria-labelledby="certificate-heading"
          className="mb-7 rounded-2xl border border-success-100 bg-success-50 p-5 sm:p-6"
        >
          <h2
            className="text-base font-bold text-success-700"
            id="certificate-heading"
          >
            Modul berhasil diselesaikan
          </h2>
          {certificate ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-success-700">
                  Sertifikat Anda sudah tersedia.
                </p>
                <p className="mt-1 text-xs text-success-700">
                  Nomor {certificate.certificateNumber}
                </p>
                <p className="mt-1 text-xs text-success-700">
                  Diterbitkan{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "long",
                  }).format(new Date(certificate.issuedAt))}
                </p>
              </div>
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-success-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-success-800"
                href={`/User/sertifikat/${certificate.id}`}
              >
                Lihat sertifikat
              </Link>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm leading-6 text-success-700">
                Anda memenuhi syarat untuk mendapatkan sertifikat modul.
              </p>
              <button
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-success-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-success-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success-700"
                onClick={handleIssueCertificate}
                type="button"
              >
                Terbitkan Sertifikat
              </button>
              {isRatingFormOpen ? (
                <form
                  className="mt-5 rounded-xl border border-success-100 bg-white p-4 sm:p-5"
                  onSubmit={handleSubmitRating}
                >
                  <h3 className="text-sm font-bold text-foreground">
                    Penilaian Modul {learningModule.title}
                  </h3>
                  <fieldset className="mt-4">
                    <legend className="text-sm font-medium text-foreground">
                      Rating bintang <span aria-hidden="true">*</span>
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <label
                          className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition ${
                            selectedRating === rating
                              ? "border-warning-500 bg-warning-50 text-warning-700"
                              : "border-border bg-white text-muted hover:border-warning-300"
                          }`}
                          key={rating}
                        >
                          <input
                            checked={selectedRating === rating}
                            className="sr-only"
                            name="module-rating"
                            onChange={() => setSelectedRating(rating)}
                            required={rating === 1}
                            type="radio"
                            value={rating}
                          />
                          <span aria-hidden="true">
                            {selectedRating !== null &&
                            rating <= selectedRating
                              ? "★"
                              : "☆"}
                          </span>
                          {rating}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label
                    className="mt-4 block text-sm font-medium text-foreground"
                    htmlFor="module-review"
                  >
                    Ulasan <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                    id="module-review"
                    onChange={(event) => setReview(event.target.value)}
                    placeholder="Ceritakan pengalaman Anda mempelajari modul ini."
                    required
                    value={review}
                  />

                  {ratingError ? (
                    <p className="mt-3 text-sm font-medium text-primary-800" role="alert">
                      {ratingError}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
                    <button
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:bg-background"
                      onClick={() => {
                        setIsRatingFormOpen(false);
                        setRatingError(null);
                      }}
                      type="button"
                    >
                      Batal
                    </button>
                    <button
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      type="submit"
                    >
                      Kirim Penilaian
                    </button>
                  </div>
                </form>
              ) : null}
              {ratingMessage ? (
                <div className="mt-4">
                  <p className="text-sm font-medium text-success-700" role="status">
                    {ratingMessage}
                  </p>
                  <button
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl bg-success-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-success-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success-700"
                    onClick={issueModuleCertificate}
                    type="button"
                  >
                    Terbitkan Sertifikat
                  </button>
                </div>
              ) : null}
            </div>
          )}
          {certificateMessage ? (
            <p className="mt-3 text-sm font-medium text-success-700" role="status">
              {certificateMessage}
            </p>
          ) : null}
          {certificateError ? (
            <p className="mt-3 text-sm font-medium text-primary-800" role="alert">
              {certificateError}
            </p>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="lessons-heading">
        <div className="mb-4">
          <h2 className="text-lg font-bold" id="lessons-heading">
            Materi Pembelajaran
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Selesaikan video dan lulus kuis dengan nilai minimal{" "}
            {QUIZ_PASSING_SCORE} untuk membuka materi berikutnya.
          </p>
        </div>

        <ol className="space-y-3">
          {moduleLessons.map((lesson) => {
            const lessonProgress = getLessonProgress(lesson.id);
            const isUnlocked = isLessonUnlocked(lesson.id);
            const isCompleted = lessonProgress.isPassed;
            const needsQuizRetake =
              lessonProgress.quizCompleted && !lessonProgress.isPassed;
            const statusType = isCompleted
              ? "completed"
              : isUnlocked
                ? "available"
                : "locked";
            const statusLabel = isCompleted
              ? "Selesai"
              : !isUnlocked
                ? "Terkunci"
                : needsQuizRetake
                  ? "Ulangi kuis"
                  : lessonProgress.videoCompleted
                    ? "Lanjutkan kuis"
                    : "Dapat diakses";
            const statusStyle = isCompleted
              ? "bg-success-50 text-success-700"
              : isUnlocked
                ? "bg-primary-50 text-primary-800"
                : "bg-background text-muted";
            const lessonCard = (
              <article
                className={`rounded-2xl border border-border bg-surface p-4 shadow-sm transition sm:p-5 ${
                  isUnlocked
                    ? "hover:border-primary-200 hover:shadow-md"
                    : "opacity-80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                      isCompleted
                        ? "bg-success-50 text-success-700"
                        : isUnlocked
                          ? "bg-primary-50 text-primary-800"
                          : "bg-background text-muted"
                    }`}
                  >
                    {lesson.order}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold">
                          {lesson.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-5 text-muted">
                          {lesson.description}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle}`}
                      >
                        <StatusIcon status={statusType} />
                        {statusLabel}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                      <span>{lesson.duration} menit</span>
                      {isUnlocked ? (
                        <span>
                          {lessonProgress.videoCompleted
                            ? "Video selesai"
                            : "Video belum selesai"}
                        </span>
                      ) : (
                        <span>
                          Selesaikan materi sebelumnya dan lulus kuis minimal{" "}
                          {QUIZ_PASSING_SCORE}.
                        </span>
                      )}
                      {needsQuizRetake ? (
                        <span>
                          Nilai kuis terakhir {lessonProgress.quizScore}; Anda
                          dapat mengulang kuis.
                        </span>
                      ) : null}
                      {lessonProgress.videoCompleted &&
                      !lessonProgress.quizCompleted &&
                      isUnlocked ? (
                        <span>Kuis masih harus dikerjakan dan diluluskan.</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );

            return (
              <li key={lesson.id}>
                {isUnlocked ? (
                  <Link
                    aria-label={`Buka materi ${lesson.order}: ${lesson.title}`}
                    className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    href={`/User/pembelajaran/${lesson.id}`}
                  >
                    {lessonCard}
                  </Link>
                ) : (
                  lessonCard
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <p className="mt-6 pb-2 text-center text-xs text-muted">
        Progres dan status materi menggunakan data simulasi lokal.
      </p>
    </div>
  );
}
