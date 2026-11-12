"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ModuleIcon } from "@/components/modules/ModuleIcon";
import { learningLessons } from "@/data/dummy/lessons";
import { learningModules } from "@/data/dummy/modules";
import {
  getLearningProgressVersion,
  getModuleProgress,
  subscribeToLearningProgress,
} from "@/data/dummy/learning-progress";

export default function UserModulesPage() {
  useSyncExternalStore(
    subscribeToLearningProgress,
    getLearningProgressVersion,
    () => 0,
  );
  const moduleCards = learningModules.map((module) => {
    const totalLessons = learningLessons.filter(
      (lesson) => lesson.moduleId === module.id,
    ).length;
    const progress = getModuleProgress(module.id);

    return {
      ...module,
      totalLessons,
      completedLessons: progress.completedLessons,
      progressPercentage:
        totalLessons === 0
          ? 0
          : Math.round((progress.completedLessons / totalLessons) * 100),
    };
  });

  return (
    <div className="mx-auto w-full max-w-[1300px] text-foreground">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">Pembelajaran</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Modul Pembelajaran
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Pelajari empat pilar kebangsaan dan lihat progres belajar Anda di
          setiap modul.
        </p>
      </header>

      <section
        aria-label="Daftar modul pembelajaran"
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {moduleCards.map((module, index) => (
          <article
            className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md sm:p-6"
            key={module.id}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`grid size-14 shrink-0 place-items-center rounded-xl text-white shadow-sm sm:size-16 ${module.colorClass}`}
              >
                <ModuleIcon name={module.icon} />
              </span>
              <span className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-muted">
                Pilar {index + 1}
              </span>
            </div>

            <div className="mt-5 flex-1">
              <h2 className="text-lg font-bold">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {module.description}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">
                  Progres materi
                </span>
                <span className="text-muted">
                  {module.completedLessons}/{module.totalLessons} selesai
                </span>
              </div>
              <div
                aria-label={`Progres ${module.title}: ${module.progressPercentage}%`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={module.progressPercentage}
                className="h-2 overflow-hidden rounded-full bg-secondary-50"
                role="progressbar"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${module.progressPercentage}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-semibold text-secondary-800">
                {module.progressPercentage}%
              </p>
            </div>

            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              href={`/User/modul/${module.id}`}
            >
              Pelajari Modul
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
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </article>
        ))}
      </section>

      <p className="mt-7 pb-2 text-center text-xs text-muted">
        Progres pembelajaran ini merupakan data simulasi.
      </p>
    </div>
  );
}
