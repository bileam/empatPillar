import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useCurrentParticipant } from "@/components/layout2/UserSessionContext";

type TopbarProps = {
  isMobileMenuOpen: boolean;
  onMenuClick: () => void;
};

function getPageTitle(pathname: string) {
  const exactTitles: Record<string, string> = {
    "/User": "Dashboard",
    "/User/profil": "Profil",
    "/User/modul": "Modul Pembelajaran",
    "/User/pembelajaran": "Pembelajaran",
    "/User/kuis": "Kuis",
    "/User/hasil-ujian": "Hasil Ujian",
    "/User/riwayat-kuis": "Riwayat Kuis",
    "/User/sertifikat": "Sertifikat",
  };
  const exactTitle = exactTitles[pathname];

  if (exactTitle) {
    return exactTitle;
  }
  if (/^\/User\/modul\/[^/]+$/.test(pathname)) {
    return "Detail Modul";
  }
  if (/^\/User\/pembelajaran\/[^/]+$/.test(pathname)) {
    return "Pembelajaran";
  }
  if (/^\/User\/kuis\/[^/]+$/.test(pathname)) {
    return "Kuis";
  }
  if (/^\/User\/hasil-ujian\/[^/]+$/.test(pathname)) {
    return "Hasil Ujian";
  }
  if (/^\/User\/sertifikat\/[^/]+$/.test(pathname)) {
    return "Detail Sertifikat";
  }

  return "Halaman Peserta";
}

export function Topbar({
  isMobileMenuOpen,
  onMenuClick,
}: TopbarProps) {
  const participant = useCurrentParticipant();
  const participantName = participant?.name.trim() || "Peserta";
  const initials =
    participantName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase("id-ID"))
      .join("") || "P";

  return (
    <header className="flex min-h-[123px] shrink-0 items-center justify-between gap-3 bg-background px-4 py-5 sm:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-controls="user-navigation-drawer"
          aria-expanded={isMobileMenuOpen}
          aria-label="Buka menu navigasi"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-foreground hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
          onClick={onMenuClick}
          type="button"
        >
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
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="mb-1 text-[15px] leading-5 text-muted">
            Halaman utama
          </p>
          <Suspense
            fallback={
              <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground md:text-[28px]">
                Dashboard
              </h1>
            }
          >
            <PageTitle />
          </Suspense>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="text-right">
          <p className="text-[13px] font-semibold leading-5 text-foreground sm:text-[15px]">
            {participantName}
          </p>
          <p className="hidden text-[13px] leading-5 text-muted sm:block">
            Peserta belajar
          </p>
        </div>
        <span
          aria-label={`Inisial ${participantName}`}
          className="grid size-10 place-items-center rounded-full border border-secondary-200 bg-secondary-50 text-base font-semibold text-secondary-700 sm:size-12"
        >
          {initials}
        </span>
      </div>
    </header>
  );
}

function PageTitle() {
  const pathname = usePathname();

  return (
    <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground md:text-[28px]">
      {getPageTitle(pathname)}
    </h1>
  );
}
