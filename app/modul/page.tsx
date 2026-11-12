import { Sidebar } from "../../components/layout/Sidebar";
import { ModuleIcon } from "../../components/modules/ModuleIcon";
import { learningLessons } from "../../data/dummy/lessons";
import { learningModules } from "../../data/dummy/modules";
import { dashboardUser } from "../../data/dummy/dashboard";
import { getModuleProgress } from "../../lib/learning-progress";

export default function ModulesPage() {
  const totalLessons = learningLessons.length;
  const completedLessons = learningModules.reduce(
    (total, learningModule) =>
      total + getModuleProgress(learningModule.id).completedLessons,
    0,
  );

  return (
    <div className="min-h-dvh bg-background text-foreground md:flex">
      <Sidebar activePath="/modul" />

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1120px]">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Pembelajaran</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Modul Pembelajaran
              </h1>
              <p className="mt-2 text-sm text-muted">
                Pilih salah satu dari empat pilar untuk mulai belajar.
              </p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-right">
                <span className="block text-sm font-semibold text-foreground">
                  {dashboardUser.name}
                </span>
                <span className="block text-xs text-muted">Peserta belajar</span>
              </span>
              <span
                aria-label={`Profil ${dashboardUser.name}`}
                className="grid size-10 place-items-center rounded-full border border-secondary-100 bg-secondary-50 text-sm font-bold text-secondary-800"
                role="img"
              >
                {dashboardUser.initials}
              </span>
            </div>
          </header>

          <section
            aria-label="Ringkasan modul"
            className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                Progres seluruh modul
              </p>
              <p className="mt-1 text-xs text-muted">
                {completedLessons} dari {totalLessons} materi selesai
              </p>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800">
              {learningModules.length} modul tersedia
            </span>
          </section>

          <section aria-label="Daftar empat modul pembelajaran">
            <ol className="space-y-4">
              {learningModules.map((learningModule, index) => {
                const progress = getModuleProgress(learningModule.id);

                return (
                  <li key={learningModule.id}>
                    <article className="grid gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:border-primary-200 hover:shadow-md sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-5 sm:p-5">
                      <span
                        className={`grid size-14 place-items-center rounded-xl text-white shadow-sm ${learningModule.colorClass}`}
                      >
                        <ModuleIcon name={learningModule.icon} />
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-xs font-semibold text-muted">
                            {index + 1}.
                          </span>
                          <h2 className="text-sm font-bold text-foreground">
                            {learningModule.title}
                          </h2>
                        </div>
                        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-muted">
                          {learningModule.description}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <div
                            aria-label={`Progres ${learningModule.title}: ${progress.percent}%`}
                            aria-valuemax={100}
                            aria-valuemin={0}
                            aria-valuenow={progress.percent}
                            className="h-1.5 max-w-48 flex-1 overflow-hidden rounded-full bg-secondary-50"
                            role="progressbar"
                          >
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted">
                            {progress.completedLessons}/{progress.totalLessons} materi
                          </span>
                        </div>
                      </div>

                      <span className="justify-self-start rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted sm:justify-self-end">
                        {progress.isCompleted
                          ? "Selesai"
                          : progress.completedLessons > 0
                            ? "Sedang dipelajari"
                            : "Belum dimulai"}
                      </span>
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>

          <p className="mt-7 text-center text-xs text-muted">
            Progres pembelajaran ini merupakan data simulasi.
          </p>
        </div>
      </main>
    </div>
  );
}
