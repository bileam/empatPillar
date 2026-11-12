"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, use, useSyncExternalStore } from "react";
import { getCertificateById } from "@/data/dummy/certificates";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import { dashboardUser } from "@/data/dummy/dashboard";
import {
  getLearningProgressVersion,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";
import { learningModules } from "@/data/dummy/modules";
import { simulatedUserId } from "@/data/dummy/learning-progress";

type CertificateDetailPageProps = {
  params: Promise<{ certificateId: string }>;
};

export default function CertificateDetailPage({
  params,
}: CertificateDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Memuat sertifikat"
          className="mx-auto min-h-96 w-full max-w-[1100px] animate-pulse rounded-2xl bg-surface"
        />
      }
    >
      <CertificateDetail params={params} />
    </Suspense>
  );
}

function CertificateDetail({ params }: CertificateDetailPageProps) {
  const { certificateId } = use(params);
  const participant = useCurrentParticipant();
  const progressVersion = useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );

  if (progressVersion === 0) {
    return (
      <div
        aria-label="Memuat sertifikat"
        className="mx-auto min-h-96 w-full max-w-[1100px] animate-pulse rounded-2xl bg-surface"
      />
    );
  }

  const certificate = getCertificateById(certificateId);
  if (!certificate || certificate.userId !== participant?.id) {
    notFound();
  }
  const participantName =
    certificate.participantName ??
    (certificate.userId === simulatedUserId
      ? dashboardUser.name
      : participant?.name.trim() || "Peserta");

  const learningModule = learningModules.find(
    (module) => module.id === certificate.moduleId,
  );
  if (!learningModule) {
    notFound();
  }

  const issuedDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(new Date(certificate.issuedAt));

  return (
    <div
      className="mx-auto w-full max-w-[1100px] text-foreground"
      data-progress-version={progressVersion}
      id="certificate-print-root"
    >
      <div className="certificate-actions mb-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href="/User/sertifikat"
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
            <path d="m15 18-6-6 6-6M9 12h12" />
          </svg>
          Kembali ke Sertifikat
        </Link>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => window.print()}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          >
            <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <path d="M7 14h10v7H7zM17 11h.01" />
          </svg>
          Cetak / Simpan PDF
        </button>
      </div>

      <article
        aria-label={`Sertifikat ${learningModule.title} atas nama ${participantName}`}
        className="certificate-document relative isolate overflow-hidden rounded-2xl border border-amber-300 bg-white px-5 py-9 shadow-lg shadow-slate-900/5 sm:px-10 sm:py-12 lg:px-16 lg:py-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-xl border border-amber-200 sm:inset-4"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-primary"
        />

        <div className="relative mx-auto flex min-h-[440px] max-w-4xl flex-col items-center justify-center text-center sm:min-h-[470px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
            Empat Pilar Kebangsaan
          </p>
          <div
            aria-hidden="true"
            className="my-5 flex items-center gap-3 sm:my-6"
          >
            <span className="h-px w-12 bg-amber-400 sm:w-20" />
            <span className="size-2 rotate-45 border border-amber-500" />
            <span className="h-px w-12 bg-amber-400 sm:w-20" />
          </div>

          <h1 className="text-3xl font-serif font-bold tracking-[0.12em] text-primary sm:text-5xl">
            SERTIFIKAT
          </h1>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            Penyelesaian Pembelajaran
          </p>

          <p className="mt-8 text-sm text-slate-600 sm:mt-10 sm:text-base">
            Dengan ini menyatakan bahwa
          </p>
          <p className="mt-3 border-b border-amber-300 px-5 pb-2 text-2xl font-semibold text-slate-900 sm:px-12 sm:text-4xl">
            {participantName}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            telah menyelesaikan modul pembelajaran
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {learningModule.title}
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
            dalam program pembelajaran Empat Pilar Kebangsaan.
          </p>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-5 border-t border-amber-200 pt-5 text-left sm:mt-10 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Nomor Sertifikat
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-slate-800 sm:text-base">
                {certificate.certificateNumber}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Tanggal Penerbitan
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 sm:text-base">
                {issuedDate}
              </p>
            </div>
          </div>

          <div className="mt-7 sm:mt-8">
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-px w-40 bg-amber-400"
            />
            <p className="text-sm font-bold text-slate-800">
              Empat Pilar Kebangsaan
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Penyelenggara
            </p>
          </div>
        </div>
      </article>

      <p className="certificate-note mt-4 text-center text-xs text-muted">
        Sertifikat ini merupakan simulasi yang diterbitkan oleh prototipe
        pembelajaran.
      </p>

      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 10mm;
        }

        @media print {
          html,
          body {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          #certificate-print-root,
          #certificate-print-root * {
            visibility: visible !important;
          }

          #certificate-print-root {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #certificate-print-root .certificate-actions,
          #certificate-print-root .certificate-note {
            display: none !important;
          }

          #certificate-print-root .certificate-document {
            width: 100% !important;
            min-height: 180mm !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            break-inside: avoid;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
