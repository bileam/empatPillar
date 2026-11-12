"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../data/dummy/users";

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5.5 16a2.8 2.8 0 0 1 5 0M13 10h5m-5 4h5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      {hidden ? (
        <>
          <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9 9 0 0 0 3-.5" />
        </>
      ) : (
        <>
          <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

function MonasIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[44%] w-full"
      fill="none"
      preserveAspectRatio="xMidYMax slice"
      viewBox="0 0 600 260"
    >
      <path
        d="M0 190c64-44 97-9 152-31 45-18 76-5 112 6 42 13 78-29 129-13 48 15 77-11 122-3 32 6 55 18 85 10v101H0V190Z"
        fill="#690c13"
        fillOpacity=".35"
      />
      <path
        d="m300 35-12 30h5l-17 95h48l-17-95h5l-12-30Zm-37 130h74l12 16h-98l12-16Zm-18 19h110v9H245v-9Z"
        fill="#f8d77b"
        fillOpacity=".72"
      />
      <path
        d="M0 211c80-34 134-19 205-8 71 10 104-19 179-10 73 9 127-15 216-2v69H0v-49Z"
        fill="#fff"
      />
      <path
        d="M0 228c73-22 135-7 208 5 69 11 119-13 184-8 81 6 131-7 208 4v31H0v-32Z"
        fill="#f3f8fc"
      />
    </svg>
  );
}

function PasswordField({
  id,
  label,
  autoComplete,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  autoComplete: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-foreground"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <span className="text-muted">
          <LockIcon />
        </span>
        <input
          autoComplete={autoComplete}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/75"
          id={id}
          name={id}
          placeholder={`Masukkan ${label.toLowerCase()}`}
          required
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? `Sembunyikan ${label.toLowerCase()}` : `Lihat ${label.toLowerCase()}`}
          className="grid size-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onToggle}
          type="button"
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }

    setError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const nik = String(formData.get("nik") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");

    if (!name || !nik || !password || !confirmation) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (!/^\d{16}$/.test(nik)) {
      setError("NIK harus terdiri dari tepat 16 digit angka.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal terdiri dari 6 karakter.");
      return;
    }
    if (password !== confirmation) {
      setError("Konfirmasi password tidak sama dengan password.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await registerUser({ name, nik, password });
      formRef.current?.reset();
      setIsSubmitting(false);
      setSuccess(true);
      window.setTimeout(() => router.replace("/login"), 1200);
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : "Registrasi gagal. Silakan coba kembali.",
      );
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center overflow-x-clip bg-background px-4 py-6 sm:px-8 sm:py-10">
      <section
        aria-label="Registrasi akun 4 Pilar Kebangsaan"
        className="mx-auto grid min-h-[790px] w-full max-w-[1080px] grid-cols-1 overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_24px_70px_rgba(28,53,84,0.12)] md:min-h-[680px] md:grid-cols-[0.88fr_1.12fr]"
      >
        <div className="relative isolate flex min-h-[250px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 px-7 py-9 text-center text-white md:min-h-0 md:px-12">
          <div className="relative z-10 flex flex-col items-center">
            <span className="mb-5 grid size-14 place-items-center rounded-full border border-white/35 bg-white/10 text-3xl shadow-inner">
              <span aria-hidden="true">🇮🇩</span>
            </span>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
              Platform pembelajaran
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              4 Pilar Kebangsaan
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/85">
              Bergabung untuk belajar dan mengamalkan nilai-nilai kebangsaan
              Indonesia.
            </p>
          </div>
          <MonasIllustration />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_105%,rgba(255,255,255,0.16),transparent_58%)]" />
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-12 md:px-16">
          <div className="w-full max-w-[390px]">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-primary">
                Mulai Perjalanan Belajar
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Buat akun peserta
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Lengkapi data berikut untuk membuat akun.
              </p>
            </div>

            <form
              className="space-y-4"
              noValidate
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="name"
                >
                  Nama lengkap
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <span className="text-muted">
                    <UserIcon />
                  </span>
                  <input
                    autoComplete="name"
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/75"
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="nik"
                >
                  NIK (16 digit)
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <span className="text-muted">
                    <IdIcon />
                  </span>
                  <input
                    autoComplete="off"
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/75"
                    id="nik"
                    inputMode="numeric"
                    name="nik"
                    placeholder="Masukkan 16 digit NIK"
                    required
                  />
                </div>
              </div>

              <PasswordField
                autoComplete="new-password"
                id="password"
                label="Password"
                onToggle={() => setShowPassword((current) => !current)}
                visible={showPassword}
              />
              <PasswordField
                autoComplete="new-password"
                id="confirmation"
                label="Konfirmasi password"
                onToggle={() => setShowConfirmation((current) => !current)}
                visible={showConfirmation}
              />

              <button
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting || success}
                type="submit"
              >
                {isSubmitting ? "Membuat akun..." : "Daftar"}
              </button>
            </form>

            <div aria-live="polite" className="min-h-6">
              {error && (
                <p
                  className="mt-4 rounded-lg bg-primary-50 px-3 py-2 text-center text-xs leading-5 text-primary-800"
                  role="alert"
                >
                  {error}
                </p>
              )}
              {success && (
                <p className="mt-4 rounded-lg bg-success-50 px-3 py-2 text-center text-xs leading-5 text-success-700">
                  Registrasi berhasil. Mengarahkan Anda ke halaman Login...
                </p>
              )}
            </div>

            <p className="mt-4 text-center text-sm text-muted">
              Sudah punya akun?{" "}
              <a
                className="font-semibold text-primary transition hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="/login"
              >
                Login di sini
              </a>
            </p>

            <p className="mt-6 text-center text-xs text-muted">
              Prototipe frontend · data akun disimpan di perangkat ini
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
