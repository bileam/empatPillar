"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type IconName = "book" | "medal" | "chart" | "users";

function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    book: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z" />
      </>
    ),
    medal: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m8.2 13-1.4 8L12 18l5.2 3-1.4-8M12 5v6m-3-3h6" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-5 5" />
        <path d="M15 9h4v4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const navigation = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Fitur", href: "#fitur" },
  { label: "Manfaat", href: "#manfaat" },
];

const features: {
  title: string;
  description: string;
  icon: IconName;
  color: string;
}[] = [
  {
    title: "Pembelajaran Interaktif",
    description: "Materi yang mudah dipahami dengan video, kuis, dan latihan.",
    icon: "book",
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Sertifikat & Penghargaan",
    description: "Dapatkan sertifikat setelah menyelesaikan setiap modul.",
    icon: "medal",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Pantau Progres",
    description: "Lihat perkembangan belajar secara real-time.",
    icon: "chart",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Untuk Semua Generasi",
    description: "Dari pelajar hingga masyarakat umum, semua bisa belajar.",
    icon: "users",
    color: "bg-violet-50 text-violet-600",
  },
];

const pillars = [
  {
    title: "Pancasila",
    description:
      "Dasar dan ideologi negara yang menjadi pedoman hidup berbangsa dan bernegara.",
    image: "/landing-page/pancasila.png",
    color: "border-rose-200 bg-rose-50/60",
  },
  {
    title: "UUD 1945",
    description:
      "Konstitusi negara yang mengatur kehidupan berbangsa, bernegara, dan bermasyarakat.",
    image: "/landing-page/uud-1945.png",
    color: "border-blue-200 bg-blue-50/60",
  },
  {
    title: "Bhinneka Tunggal Ika",
    description:
      "Semboyan yang mencerminkan persatuan dalam keberagaman bangsa Indonesia.",
    image: "/landing-page/bhinneka.png",
    color: "border-emerald-200 bg-emerald-50/60",
  },
  {
    title: "NKRI",
    description:
      "Bentuk negara kesatuan yang menyatukan seluruh wilayah dan rakyat Indonesia.",
    image: "/landing-page/nkri.png",
    color: "border-orange-200 bg-orange-50/60",
  },
];

function Brand() {
  return (
    <a
      aria-label="Empat Pilar Kebangsaan - Beranda"
      className="shrink-0"
      href="#beranda"
    >
      <Image
        alt="Empat Pilar Kebangsaan"
        className="h-[35px] w-[106px] object-contain"
        height={35}
        priority
        src="/landing-page/brand.png"
        width={106}
      />
    </a>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen scroll-smooth bg-[#193b5b] text-[#1d3858]">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <nav
          aria-label="Navigasi utama"
          className="relative mx-auto flex h-12 max-w-[1440px] items-center justify-between px-[5.7%]"
        >
          <Brand />

          <div className="absolute left-[48%] hidden -translate-x-1/2 items-center gap-6 md:flex">
            {navigation.map((item, index) => (
              <a
                className={`relative py-4 text-[8px] font-medium transition-colors hover:text-rose-600 ${
                  index === 0
                    ? "text-[#16375a] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-rose-600"
                    : "text-[#334b67]"
                }`}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            className="hidden h-[25px] items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-2.5 text-[8px] font-semibold text-white transition-colors hover:bg-rose-700 md:inline-flex"
            href="/login"
          >
            <svg
              aria-hidden="true"
              className="size-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="3" />
              <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
            </svg>
            Login
          </a>

          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isMenuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-5 py-3 shadow-lg md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navigation.map((item) => (
                <a
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                className="mt-1 rounded-lg bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                href="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section
          className="relative isolate overflow-hidden bg-[#eef7ff]"
          id="beranda"
        >
          <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center px-[5.7%] py-8 md:h-[282px] md:grid-cols-[minmax(0,1fr)_52.62%] md:py-0">
            <div className="relative z-10 max-w-[380px] md:-translate-y-[6px] md:py-0">
              <span className="inline-flex h-[21px] items-center gap-1.5 rounded-full border border-[#d6e5f2] bg-white/75 px-2.5 text-[8px] font-medium text-[#234766] shadow-sm">
                <svg
                  aria-hidden="true"
                  className="size-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 4h14v15H5zM8 8h8m-8 4h8m-8 4h5" />
                </svg>
                Belajar · Pahami · Amalkan
              </span>
              <h1 className="mt-2 text-[27px] font-bold leading-[1.18] tracking-[-0.035em] text-[#1c3858]">
                Kenali, Pahami, dan
                <br />
                Amalkan{" "}
                <span className="text-rose-600">4 Pilar Kebangsaan</span>
              </h1>
              <p
                className="mt-2 max-w-[300px] text-[10px] leading-[1.45] text-[#55708e]"
                id="tentang"
              >
                Mari bersama membangun generasi yang cinta tanah air, berpikir
                kritis, dan berkomitmen menjaga keutuhan bangsa melalui
                pembelajaran interaktif tentang 4 Pilar Kebangsaan Republik
                Indonesia.
              </p>
              <a
                className="mt-3 inline-flex h-[34px] items-center gap-2 rounded-full bg-rose-600 px-6 text-[9px] font-semibold text-white shadow-sm transition hover:bg-rose-700"
                href="/login"
              >
                <svg
                  aria-hidden="true"
                  className="size-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
                Login Sekarang
              </a>
            </div>

            <div className="relative order-2 -mx-[6.4%] mt-7 h-[210px] overflow-hidden md:absolute md:inset-y-0 md:right-0 md:order-none md:m-0 md:h-full md:w-[52.62%]">
              <Image
                alt="Generasi muda Indonesia di depan bendera Merah Putih dan Monas"
                className="object-cover object-center"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 53vw"
                src="/landing-page/hero.png"
              />
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 hidden w-[18%] bg-gradient-to-r from-[#eef7ff] via-[#eef7ff]/50 to-transparent md:block"
              />
            </div>
          </div>
        </section>

        <section
          aria-label="Keunggulan platform"
          className="mx-auto grid max-w-[1440px] grid-cols-2 bg-white px-[5.7%] pb-5 pt-5 md:grid-cols-4 md:pb-6"
          id="fitur"
        >
          {features.map((feature, index) => (
            <article
              className={`min-h-[82px] px-3 first:pl-0 sm:px-5 md:px-[clamp(12px,3vw,26px)] ${
                index % 2 === 0 ? "" : "border-l border-slate-200"
              } ${index < 2 ? "border-b border-slate-200 pb-4 md:border-b-0 md:pb-0" : "pt-4 md:pt-0"} ${
                index === 2 ? "md:border-l" : ""
              } ${index === 3 ? "md:border-l" : ""} ${
                index === 1 ? "md:pl-[clamp(12px,3vw,26px)] md:border-l" : ""
              }`}
              key={feature.title}
            >
              <span
                className={`grid size-9 place-items-center rounded-xl ${feature.color}`}
              >
                <Icon name={feature.icon} className="size-[18px]" />
              </span>
              <h2 className="mt-2 text-[11px] font-bold leading-4 text-[#193858]">
                {feature.title}
              </h2>
              <p className="mt-1 max-w-[180px] text-[9px] leading-[1.45] text-[#71839a]">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section
          aria-labelledby="pillars-title"
          className="relative z-10 bg-white pb-0 pt-3"
          id="manfaat"
        >
          <div className="mx-auto max-w-[1440px] px-[5.5%]">
            <div className="text-center">
              <h2
                className="text-[22px] font-bold leading-7 tracking-tight text-[#1d3858]"
                id="pillars-title"
              >
                4 Pilar Kebangsaan
              </h2>
              <span
                aria-hidden="true"
                className="mx-auto mt-1.5 block h-[2px] w-6 rounded-full bg-rose-600"
              />
              <p className="mx-auto mt-2 max-w-[520px] text-[9px] leading-[1.45] text-[#71839a]">
                Empat pilar kebangsaan adalah landasan utama dalam kehidupan
                berbangsa dan bernegara
                <br className="hidden sm:block" /> untuk menjaga persatuan,
                kesatuan, dan keutuhan Negara Kesatuan Republik Indonesia.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 pb-0 md:grid-cols-4 md:gap-[14px]">
              {pillars.map((pillar) => (
                <article
                  className={`overflow-hidden rounded-[6px] border pb-[5px] text-center ${pillar.color}`}
                  key={pillar.title}
                >
                  <div className="relative aspect-[2.13/1] w-full">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="(max-width: 767px) 42vw, 18vw"
                      src={pillar.image}
                    />
                  </div>
                  <div className="px-2 pb-2 pt-0.5">
                    <h3 className="text-[11px] font-bold leading-[1.25] text-[#1e3a5b]">
                      {pillar.title}
                    </h3>
                    <p className="mx-auto mt-1 max-w-[165px] text-[8px] leading-[1.4] text-[#73849b]">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative -mt-[15px] min-h-[82px] overflow-hidden bg-[#193b5b] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-10 bg-[url('/landing-page/footer-landscape.png')] bg-cover bg-top bg-no-repeat"
        />
        <p className="relative z-10 mx-auto flex min-h-[82px] items-end justify-center gap-3 px-4 pb-3 text-center font-serif text-[10px] font-medium italic">
          <svg
            aria-hidden="true"
            className="mb-0.5 h-[9px] w-[14px]"
            fill="none"
            viewBox="0 0 16 10"
          >
            <path d="M2 1v8" stroke="white" />
            <path d="M3 2 14 4 3 6Z" fill="#dc143c" />
            <path d="M3 6 14 4 3 8Z" fill="white" />
          </svg>
          Bersama Mewujudkan Indonesia yang Lebih Baik.
          <svg
            aria-hidden="true"
            className="mb-0.5 h-[9px] w-[14px] -scale-x-100"
            fill="none"
            viewBox="0 0 16 10"
          >
            <path d="M2 1v8" stroke="white" />
            <path d="M3 2 14 4 3 6Z" fill="#dc143c" />
            <path d="M3 6 14 4 3 8Z" fill="white" />
          </svg>
        </p>
      </footer>
    </div>
  );
}
