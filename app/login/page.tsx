"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthSession } from "../../data/dummy/auth-session";
import { verifyUserLogin } from "../../data/dummy/users";

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

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const [nik, setNik] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }

    setError("");
    setNotice("");
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (!/^\d{16}$/.test(nik)) {
      setError("NIK harus terdiri dari tepat 16 digit angka.");
      return;
    }
    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const user = await verifyUserLogin(nik, password);
      if (!user) {
        setError("NIK atau password salah. Periksa kembali data Anda.");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      setAuthSession(user.id);
      formRef.current?.reset();
      setNik("");
      setShowPassword(false);
      setNotice("");
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      router.replace("/User");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login gagal. Silakan coba kembali.",
      );
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-6 sm:px-8 sm:py-10">
      <section
        aria-label="Masuk ke 4 Pilar Kebangsaan"
        className="mx-auto grid min-h-[740px] w-full max-w-[1080px] grid-cols-1 overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_24px_70px_rgba(28,53,84,0.12)] md:min-h-[620px] md:grid-cols-[0.88fr_1.12fr]"
      >
        <div className="relative isolate flex min-h-[300px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 px-7 py-9 text-center text-white md:min-h-0 md:px-12">
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
              Belajar, memahami, dan mengamalkan nilai-nilai kebangsaan
              Indonesia.
            </p>
          </div>
          <MonasIllustration />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_105%,rgba(255,255,255,0.16),transparent_58%)]" />
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-12 md:px-16">
          <div className="w-full max-w-[390px]">
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-primary">
                Selamat Datang
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Masuk ke akun Anda
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Masuk untuk melanjutkan pembelajaran.
              </p>
            </div>

            <form
              className="space-y-5"
              noValidate
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="nik"
                >
                  NIK
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <span className="text-muted">
                    <IdIcon />
                  </span>
                  <input
                    autoComplete="username"
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/75"
                    id="nik"
                    inputMode="numeric"
                    name="nik"
                    onChange={(event) =>
                      setNik(event.target.value.replace(/\D/g, ""))
                    }
                    pattern="[0-9]{16}"
                    placeholder="Masukkan 16 digit NIK"
                    required
                    value={nik}
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <span className="text-muted">
                    <LockIcon />
                  </span>
                  <input
                    autoComplete="current-password"
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/75"
                    id="password"
                    minLength={6}
                    name="password"
                    placeholder="Masukkan password"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                    className="grid size-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted">
                  <input
                    className="size-4 rounded border-border accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    name="remember"
                    type="checkbox"
                  />
                  Ingat saya
                </label>
                <button
                  className="font-medium text-primary transition hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={() => {
                    setError("");
                    setNotice("Fitur lupa password belum tersedia di prototipe ini.")
                  }}
                  type="button"
                >
                  Lupa password?
                </button>
              </div>

              <button
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Memeriksa..." : "Masuk"}
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
              {notice && (
                <p className="mt-4 rounded-lg bg-success-50 px-3 py-2 text-center text-xs leading-5 text-success-700">
                  {notice}
                </p>
              )}
            </div>

            <p className="mt-5 text-center text-sm text-muted">
              Belum punya akun?{" "}
              <a
                className="font-semibold text-primary transition hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="/register"
              >
                Daftar di sini
              </a>
            </p>

            <p className="mt-8 text-center text-xs text-muted">
              Prototipe frontend · autentikasi tersimpan di perangkat ini
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
