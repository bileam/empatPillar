import Link from "next/link";

type NavigationItem = {
  label: string;
  href: string;
  icon: "dashboard" | "modules" | "certificate" | "profile";
};

const navigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Modul", href: "/modul", icon: "modules" },
  { label: "Sertifikat", href: "/User/sertifikat", icon: "certificate" },
  { label: "Profil", href: "/profil", icon: "profile" },
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
    modules: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 6h12M8 10h8m-8 4h6" />
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
  };

  return (
    <svg
      aria-hidden="true"
      className="size-4.5 shrink-0"
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

export function Sidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="border-b border-border bg-surface px-4 py-4 md:min-h-dvh md:w-60 md:shrink-0 md:border-b-0 md:border-r md:px-5 md:py-7">
      <Link
        aria-label="4 Pilar Kebangsaan, dashboard"
        className="mb-5 flex items-center gap-2.5 px-1 md:mb-10"
        href="/dashboard"
      >
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-xl bg-primary-50 text-lg"
        >
          🇮🇩
        </span>
        <span className="text-sm font-bold tracking-tight text-foreground">
          4 Pilar Kebangsaan
        </span>
      </Link>

      <nav
        aria-label="Navigasi utama"
        className="flex gap-2 overflow-x-auto md:flex-col"
      >
        {navigation.map((item) => {
          const isActive = item.href === activePath;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:bg-background hover:text-foreground"
              }`}
              href={item.href}
              key={item.href}
            >
              <NavigationIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-8 hidden rounded-xl border border-border bg-background p-3 text-xs leading-5 text-muted md:block">
        Terus belajar dan kenali nilai-nilai kebangsaan Indonesia.
      </p>
    </aside>
  );
}
