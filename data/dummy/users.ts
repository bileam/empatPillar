export type UserProfile = {
  id: string;
  name: string;
  nik: string;
  createdAt: string;
};

type StoredUser = UserProfile & {
  passwordHash: string;
  passwordSalt: string;
};

export type RegisterUserInput = {
  name: string;
  nik: string;
  password: string;
};

const usersStorageKey = "empat-pilar:users:v1";
const storageVersion = 1;
const passwordIterations = 210_000;
const saltLength = 16;
const passwordHashLength = 32;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidNik(value: unknown): value is string {
  return typeof value === "string" && /^\d{16}$/.test(value);
}

function isValidStoredUser(value: unknown): value is StoredUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    isValidNik(value.nik) &&
    typeof value.passwordHash === "string" &&
    /^[\da-f]{64}$/.test(value.passwordHash) &&
    typeof value.passwordSalt === "string" &&
    /^[\da-f]{32}$/.test(value.passwordSalt) &&
    typeof value.createdAt === "string" &&
    Number.isFinite(Date.parse(value.createdAt))
  );
}

function isValidUserCollection(values: unknown[]): values is StoredUser[] {
  const ids = new Set<string>();
  const niks = new Set<string>();

  for (const value of values) {
    if (!isValidStoredUser(value) || ids.has(value.id) || niks.has(value.nik)) {
      return false;
    }

    ids.add(value.id);
    niks.add(value.nik);
  }

  return true;
}

function getLocalStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Data akun hanya dapat diakses di browser.");
  }

  try {
    return window.localStorage;
  } catch {
    throw new Error("Penyimpanan akun tidak tersedia di browser.");
  }
}

function readStoredUsers(): StoredUser[] {
  let storedValue: string | null;
  try {
    storedValue = getLocalStorage().getItem(usersStorageKey);
  } catch (error) {
    if (error instanceof Error && error.message.includes("browser")) {
      throw error;
    }
    throw new Error("Data akun tidak dapat dibaca dari browser.");
  }

  if (storedValue === null) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    throw new Error(
      "Data akun tersimpan rusak dan dipertahankan tanpa perubahan.",
    );
  }

  if (
    !isRecord(parsed) ||
    parsed.version !== storageVersion ||
    !Array.isArray(parsed.users) ||
    !isValidUserCollection(parsed.users)
  ) {
    throw new Error(
      "Format data akun tidak valid; data lama dipertahankan tanpa perubahan.",
    );
  }

  return parsed.users.map((user) => ({ ...user }));
}

function writeStoredUsers(users: StoredUser[]) {
  try {
    getLocalStorage().setItem(
      usersStorageKey,
      JSON.stringify({ version: storageVersion, users }),
    );
  } catch {
    throw new Error("Data akun tidak dapat disimpan di browser.");
  }
}

function toUserProfile(user: StoredUser): UserProfile {
  return {
    id: user.id,
    name: user.name,
    nik: user.nik,
    createdAt: user.createdAt,
  };
}

function getCrypto(): Crypto {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto tidak tersedia di browser ini.");
  }

  return window.crypto;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function hexToBytes(value: string): ArrayBuffer {
  const buffer = new ArrayBuffer(value.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return buffer;
}

async function hashPassword(password: string, salt: ArrayBuffer) {
  const webCrypto = getCrypto();
  const key = await webCrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await webCrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: passwordIterations,
    },
    key,
    passwordHashLength * 8,
  );
  return bytesToHex(new Uint8Array(derivedBits));
}

function equalHash(first: string, second: string): boolean {
  if (first.length !== second.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
}

function createUserId(existingIds: Set<string>): string {
  const webCrypto = getCrypto();
  let id: string;
  do {
    const randomId =
      typeof webCrypto.randomUUID === "function"
        ? webCrypto.randomUUID()
        : bytesToHex(webCrypto.getRandomValues(new Uint8Array(16)));
    id = `user-${randomId}`;
  } while (existingIds.has(id));

  return id;
}

export function getUsers(): UserProfile[] {
  return readStoredUsers().map(toUserProfile);
}

export function getUserById(id: string): UserProfile | undefined {
  const user = readStoredUsers().find((item) => item.id === id);
  return user ? toUserProfile(user) : undefined;
}

export function getUserByNik(nik: string): UserProfile | undefined {
  if (!isValidNik(nik)) {
    return undefined;
  }

  const user = readStoredUsers().find((item) => item.nik === nik);
  return user ? toUserProfile(user) : undefined;
}

export async function registerUser(
  input: RegisterUserInput,
): Promise<UserProfile> {
  if (typeof input.name !== "string" || input.name.trim().length === 0) {
    throw new Error("Nama lengkap wajib diisi.");
  }
  if (!isValidNik(input.nik)) {
    throw new Error("NIK harus terdiri dari tepat 16 digit angka.");
  }
  if (typeof input.password !== "string" || input.password.length < 6) {
    throw new Error("Password minimal terdiri dari 6 karakter.");
  }

  const currentUsers = readStoredUsers();
  if (currentUsers.some((user) => user.nik === input.nik)) {
    throw new Error("NIK sudah digunakan oleh akun lain.");
  }

  const webCrypto = getCrypto();
  const salt = webCrypto.getRandomValues(new Uint8Array(saltLength));
  const passwordHash = await hashPassword(input.password, salt.buffer);

  const latestUsers = readStoredUsers();
  if (latestUsers.some((user) => user.nik === input.nik)) {
    throw new Error("NIK sudah digunakan oleh akun lain.");
  }

  const user: StoredUser = {
    id: createUserId(new Set(latestUsers.map((item) => item.id))),
    name: input.name.trim(),
    nik: input.nik,
    passwordHash,
    passwordSalt: bytesToHex(salt),
    createdAt: new Date().toISOString(),
  };
  writeStoredUsers([...latestUsers, user]);

  return toUserProfile(user);
}

export async function verifyUserLogin(
  nik: string,
  password: string,
): Promise<UserProfile | null> {
  if (!isValidNik(nik) || typeof password !== "string") {
    return null;
  }

  const user = readStoredUsers().find((item) => item.nik === nik);
  if (!user) {
    return null;
  }

  const providedHash = await hashPassword(
    password,
    hexToBytes(user.passwordSalt),
  );
  return equalHash(providedHash, user.passwordHash)
    ? toUserProfile(user)
    : null;
}
