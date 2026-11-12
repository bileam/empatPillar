"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";
import { getCertificatesByUserId } from "@/data/dummy/certificates";
import {
  getLearningProgressVersion,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";
import { learningModules } from "@/data/dummy/modules";

export default function UserCertificatesPage() {
  const participant = useCurrentParticipant();
  useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const certificates = (participant
    ? getCertificatesByUserId(participant.id)
    : []
  )
    .map((certificate) => ({
      certificate,
      module: learningModules.find(
        (module) => module.id === certificate.moduleId,
      ),
    }))
    .filter(
      (
        item,
      ): item is (typeof item) & {
        module: (typeof learningModules)[number];
      } => Boolean(item.module),
    );

  return (
    <div className="mx-auto w-full max-w-[1100px] text-foreground">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">Pencapaian belajar</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Sertifikat Saya
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Lihat sertifikat yang telah diterbitkan setelah Anda menyelesaikan
          modul pembelajaran.
        </p>
      </header>

      {certificates.length > 0 ? (
        <section
          aria-label="Daftar sertifikat yang telah diterbitkan"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {certificates.map(({ certificate, module }) => (
            <article
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
              key={certificate.id}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-xl bg-success-50 text-success-700"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="m8.5 12-1 8 4.5-2.5 4.5 2.5-1-8M10 8l1.3 1.3L14.5 6" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold">{module.title}</h2>
                  <p className="mt-1 text-xs text-muted">
                    Sertifikat penyelesaian modul
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-success-700"
                  />
                  Diterbitkan
                </span>
              </div>

              <dl className="mt-5 space-y-3 border-t border-border pt-4">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <dt className="text-muted">Nomor sertifikat</dt>
                  <dd className="font-semibold">{certificate.certificateNumber}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <dt className="text-muted">Tanggal penerbitan</dt>
                  <dd className="font-medium">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "long",
                    }).format(new Date(certificate.issuedAt))}
                  </dd>
                </div>
              </dl>

              <Link
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href={`/User/sertifikat/${certificate.id}`}
              >
                Lihat Sertifikat
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
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </Link>
            </article>
          ))}
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
              <circle cx="12" cy="8" r="5" />
              <path d="m8.5 12-1 8 4.5-2.5 4.5 2.5-1-8" />
            </svg>
          </span>
          <h2 className="mt-4 text-lg font-bold">
            Belum ada sertifikat
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Selesaikan seluruh materi dan lulus kuis dalam sebuah modul untuk
            memenuhi syarat penerbitan sertifikat.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/User/modul"
          >
            Jelajahi Modul
          </Link>
        </section>
      )}

      <p className="mt-6 pb-2 text-center text-xs text-muted">
        Sertifikat disimpan sebagai data simulasi lokal di browser.
      </p>
    </div>
  );
}
