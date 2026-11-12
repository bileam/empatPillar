
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
  icon: "dashboard" | "module" | "history" | "certificate" | "profile" | "logout";
};

const navigation: NavigationItem[] = [
  { label: "Dashboard", href: "/User", icon: "dashboard" },
  { label: "Modul", href: "/User/modul", icon: "module" },
  { label: "Riwayat Kuis", href: "/User/riwayat-kuis", icon: "history" },
  { label: "Sertifikat", href: "/User/sertifikat", icon: "certificate" },
  { label: "Profil", href: "/User/profil", icon: "profile" },
];

function NavigationIcon({ name }: { name: NavigationItem["icon"] }) {
  const paths: Record<NavigationItem["icon"], React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),

    module: (
      <>
        <path d="M5 4.5h14v15H5z" />
        <path d="M8 8h8M8 11.5h8M8 15h5" />
      </>
    ),

    history: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    certificate: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="m8.5 14-1 7 4.5-2.5 4.5 2.5-1-7M9.5 9l1.5 1.5L14.5 7" />
      </>
    ),

    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="size-[18px] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  );
}

type SidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onLogout: () => void;
};

export function Sidebar({
  isMobileOpen,
  onClose,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <button
          aria-label="Tutup menu navigasi"
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        aria-label="Menu navigasi peserta"
        className={`fixed inset-y-0 left-0 z-50 h-dvh w-[17.625rem] shrink-0 overflow-y-auto border-r border-border bg-surface px-[19px] pt-[26px] transition-transform duration-200 md:static md:z-auto md:h-screen md:translate-x-0 ${
          isMobileOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full md:visible"
        }`}
        id="user-navigation-drawer"
      >
        <div className="mb-12 flex h-11 items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-[43px] shrink-0 place-items-center rounded-[15px] bg-primary-50 text-sm font-medium text-primary-700"
            >
              ID
            </span>

            <span className="text-[15px] font-bold tracking-tight text-foreground">
              4 Pilar Kebangsaan
            </span>
          </div>
          <button
            aria-label="Tutup menu navigasi"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            onClick={onClose}
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
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/User"
                ? pathname === "/User"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`flex h-12 items-center gap-4 rounded-[10px] px-4 text-[15px] font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
                href={item.href}
                key={item.href}
                onClick={onNavigate}
              >
                <NavigationIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="mt-4 flex h-12 w-full items-center gap-4 rounded-[10px] px-4 text-left text-[15px] font-medium text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onLogout}
          type="button"
        >
          <NavigationIcon name="logout" />
          Logout
        </button>

        <p className="mt-8 rounded-[15px] border border-border bg-background px-[14px] py-[16px] text-[13px] leading-6 text-muted">
          Terus belajar dan kenali nilai-nilai kebangsaan Indonesia.
        </p>
      </aside>
    </>
  );
}
