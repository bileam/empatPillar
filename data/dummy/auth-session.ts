import { getUserById, type UserProfile } from "./users";

const authSessionStorageKey = "empat-pilar:auth-session:v1";
const storageVersion = 1;

type AuthSession = {
  version: 1;
  userId: string;
};

function getSessionStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Sesi peserta hanya dapat diakses di browser.");
  }

  try {
    return window.sessionStorage;
  } catch {
    throw new Error("Penyimpanan sesi tidak tersedia di browser.");
  }
}

export function setAuthSession(userId: string): void {
  if (!getUserById(userId)) {
    throw new Error("Pengguna untuk sesi login tidak ditemukan.");
  }

  const session: AuthSession = { version: storageVersion, userId };
  try {
    getSessionStorage().setItem(authSessionStorageKey, JSON.stringify(session));
  } catch {
    throw new Error("Sesi peserta tidak dapat disimpan di browser.");
  }
}

export function getCurrentUserId(): string | null {
  const user = getCurrentSessionUser();
  return user?.id ?? null;
}

function getCurrentSessionUser(): UserProfile | undefined {
  let storedValue: string | null;
  try {
    storedValue = getSessionStorage().getItem(authSessionStorageKey);
  } catch (error) {
    if (error instanceof Error && error.message.includes("browser")) {
      throw error;
    }
    throw new Error("Sesi peserta tidak dapat dibaca dari browser.");
  }

  if (storedValue === null) {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    clearAuthSession();
    return undefined;
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("version" in parsed) ||
    parsed.version !== storageVersion ||
    !("userId" in parsed) ||
    typeof parsed.userId !== "string" ||
    !parsed.userId
  ) {
    clearAuthSession();
    return undefined;
  }

  const user = getUserById(parsed.userId);
  if (!user) {
    clearAuthSession();
    return undefined;
  }

  return user;
}

export function getCurrentUser(): UserProfile | undefined {
  return getCurrentSessionUser();
}

export function clearAuthSession(): void {
  try {
    getSessionStorage().removeItem(authSessionStorageKey);
  } catch (error) {
    if (error instanceof Error && error.message.includes("browser")) {
      throw error;
    }
    throw new Error("Sesi peserta tidak dapat dihapus dari browser.");
  }
}
