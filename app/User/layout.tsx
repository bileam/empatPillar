"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout2/Sidebar";
import { Topbar } from "@/components/layout2/Topbar";
import { clearAuthSession, getCurrentUser } from "@/data/dummy/auth-session";
import type { UserProfile } from "@/data/dummy/users";
import { UserSessionProvider } from "@/components/layout2/UserSessionContext";

export default function DashboardUser({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sessionStatus, setSessionStatus] = useState<
    "checking" | "valid" | "error"
  >("checking");
  const [sessionError, setSessionError] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const user = getCurrentUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        setCurrentUser(user);
        setSessionStatus("valid");
      } catch (error) {
        setSessionError(
          error instanceof Error
            ? error.message
            : "Sesi peserta tidak dapat diperiksa.",
        );
        setSessionStatus("error");
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  useEffect(() => {
    if (!isMobileSidebarOpen && !isLogoutConfirmationOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isLogoutConfirmationOpen) {
        setIsLogoutConfirmationOpen(false);
      } else if (event.key === "Escape" && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLogoutConfirmationOpen, isMobileSidebarOpen]);

  function requestLogout() {
    setLogoutError("");
    setIsLogoutConfirmationOpen(true);
  }

  function confirmLogout() {
    try {
      clearAuthSession();
      setIsLogoutConfirmationOpen(false);
      setIsMobileSidebarOpen(false);
      router.replace("/login");
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Sesi peserta tidak dapat dihapus.",
      );
      setIsLogoutConfirmationOpen(false);
    }
  }

  if (sessionStatus === "checking") {
    return (
      <main
        aria-label="Memeriksa sesi peserta"
        className="grid min-h-dvh place-items-center bg-background px-6 text-foreground"
      >
        <p aria-live="polite" className="text-sm text-muted">
          Memeriksa sesi peserta...
        </p>
      </main>
    );
  }

  if (sessionStatus === "error") {
    return (
      <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
        <section
          aria-labelledby="session-error-heading"
          className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center shadow-sm"
        >
          <h1 className="text-lg font-bold" id="session-error-heading">
            Sesi peserta tidak dapat diperiksa
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{sessionError}</p>
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main
        aria-label="Memeriksa sesi peserta"
        className="grid min-h-dvh place-items-center bg-background px-6 text-foreground"
      >
        <p aria-live="polite" className="text-sm text-muted">
          Memeriksa sesi peserta...
        </p>
      </main>
    );
  }

  return (
    <UserSessionProvider user={currentUser}>
      <div className="flex h-dvh w-full min-w-0 overflow-hidden font-heading transition-colors duration-200">
        <aside className="shrink-0">
          <Suspense
            fallback={
              <div
                aria-hidden
                className="hidden min-h-screen w-[17.625rem] shrink-0 border-r border-border bg-surface md:block"
              />
            }
          >
            <Sidebar
              isMobileOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onLogout={requestLogout}
            />
          </Suspense>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            isMobileMenuOpen={isMobileSidebarOpen}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background px-4 py-7 sm:px-10">
            {logoutError ? (
              <p
                className="mx-auto mb-4 w-full max-w-[1100px] text-sm font-medium text-primary-800"
                role="alert"
              >
                {logoutError}
              </p>
            ) : null}
            {children}
          </main>
        </div>
      </div>
      {isLogoutConfirmationOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsLogoutConfirmationOpen(false);
            }
          }}
        >
          <section
            aria-describedby="logout-confirmation-description"
            aria-labelledby="logout-confirmation-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-foreground shadow-xl"
            role="dialog"
          >
            <h2
              className="text-lg font-bold tracking-tight"
              id="logout-confirmation-title"
            >
              Keluar dari akun?
            </h2>
            <p
              className="mt-2 text-sm leading-6 text-muted"
              id="logout-confirmation-description"
            >
              Apakah Anda yakin ingin keluar?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                autoFocus
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => setIsLogoutConfirmationOpen(false)}
                type="button"
              >
                Tidak, tetap masuk
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={confirmLogout}
                type="button"
              >
                Ya, keluar
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </UserSessionProvider>
  );
}