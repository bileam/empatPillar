import Link from "next/link";

export default function ModuleNotFound() {
  return (
    <div className="mx-auto flex min-h-64 w-full max-w-[700px] flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-sm">
      <h1 className="text-xl font-bold text-foreground">Modul tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted">
        Modul yang Anda cari tidak tersedia.
      </p>
      <Link
        className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        href="/User/modul"
      >
        Kembali ke daftar modul
      </Link>
    </div>
  );
}
