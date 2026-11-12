import Link from "next/link";
import {
  dashboardProgress,
  dashboardUser,
} from "../../data/dummy/dashboard";
import { Sidebar } from "../../components/layout/Sidebar";
import { ModuleIcon } from "../../components/modules/ModuleIcon";
import { learningLessons } from "../../data/dummy/lessons";
import { learningModules } from "../../data/dummy/modules";
import { getModuleProgress } from "../../lib/learning-progress";

function MetricIcon({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-white ${tone}`}>
      {children}
    </span>
  );
}

export default function DashboardPage() {
  const moduleProgress = learningModules.map((learningModule) =>
    getModuleProgress(learningModule.id),
  );
  const completedModules = moduleProgress.filter(
    (progress) => progress.isCompleted,
  ).length;
  const totalLessons = learningLessons.length;
  const completedLessons = moduleProgress.reduce(
    (total, progress) => total + progress.completedLessons,
    0,
  );
  const overallPercent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-dvh bg-background text-foreground md:flex">
      <Sidebar activePath="/dashboard" />

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1440px]">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Halaman utama</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold text-foreground">
                  {dashboardUser.name}
                </span>
                <span className="block text-xs text-muted">Peserta belajar</span>
              </span>
              <span
                aria-label={`Foto profil ${dashboardUser.name}`}
                className="grid size-10 place-items-center rounded-full border border-secondary-100 bg-secondary-50 text-sm font-bold text-secondary-800"
                role="img"
              >
                {dashboardUser.initials}
              </span>
            </div>
          </header>

          <section aria-labelledby="welcome-heading" className="mb-7">
            <h2
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              id="welcome-heading"
            >
              Halo, {dashboardUser.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Terus semangat untuk belajar nilai-nilai kebangsaan!
            </p>
          </section>

          <section
            aria-label="Ringkasan progres pembelajaran"
            className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Progres Pembelajaran
                  </h2>
                  <p className="mt-1.5 text-xs text-muted">
                    {completedModules} dari {learningModules.length} modul selesai
                  </p>
                </div>
                <span className="text-sm font-semibold text-secondary-800">
                  {overallPercent}%
                </span>
              </div>
              <div
                aria-label={`${overallPercent}% selesai`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={overallPercent}
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary-50"
                role="progressbar"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${overallPercent}%` }}
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
                <p className="mt-1 text-xl font-bold text-foreground">
                  {completedModules}
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
                <p className="mt-1 text-xl font-bold text-foreground">
                  {dashboardProgress.totalScore}
                </p>
              </div>
            </article>
          </section>

          <section aria-labelledby="modules-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  className="text-lg font-bold tracking-tight text-foreground"
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
                href="/modul"
              >
                Lihat semua modul
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {learningModules.map((learningModule, index) => {
                const progress = getModuleProgress(learningModule.id);

                return (
                <article
                  className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                  key={learningModule.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`grid size-12 place-items-center rounded-xl text-white shadow-sm ${learningModule.colorClass}`}
                    >
                      <ModuleIcon name={learningModule.icon} />
                    </span>
                    <span className="text-xs font-medium text-muted">
                      {index + 1} / 4
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-bold text-foreground">
                    {learningModule.title}
                  </h3>
                  <p className="mt-1.5 min-h-10 text-xs leading-5 text-muted">
                    {learningModule.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted">
                      {progress.completedLessons}/{progress.totalLessons} materi
                    </span>
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

          <p className="mt-8 text-center text-xs text-muted">
            Data dashboard ini merupakan simulasi untuk prototipe.
          </p>
        </div>
      </main>
    </div>
  );
}
