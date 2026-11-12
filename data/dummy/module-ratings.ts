import { learningModules } from "@/data/dummy/modules";

export type ModuleRating = {
  id: string;
  userId: string;
  moduleId: string;
  rating: number;
  review: string;
  submittedAt: string;
};

export type SaveModuleRatingResult =
  | { status: "saved"; rating: ModuleRating }
  | { status: "already-exists"; rating: ModuleRating };

type StoredRatingsResult =
  | { status: "ok"; ratings: ModuleRating[] }
  | { status: "unavailable" }
  | { status: "invalid" };

const moduleRatingsStorageKey = "empat-pilar:module-ratings:v1";
const storageVersion = 1;
const validModuleIds = new Set(learningModules.map((module) => module.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidModuleRating(value: unknown): value is ModuleRating {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.userId === "string" &&
    value.userId.trim().length > 0 &&
    typeof value.moduleId === "string" &&
    validModuleIds.has(value.moduleId) &&
    typeof value.rating === "number" &&
    Number.isInteger(value.rating) &&
    value.rating >= 1 &&
    value.rating <= 5 &&
    typeof value.review === "string" &&
    value.review.trim().length > 0 &&
    typeof value.submittedAt === "string" &&
    Number.isFinite(Date.parse(value.submittedAt))
  );
}

function isValidRatingsCollection(
  values: unknown[],
): values is ModuleRating[] {
  const ratings: ModuleRating[] = [];
  const ratingIds = new Set<string>();
  const userModules = new Set<string>();

  for (const value of values) {
    if (!isValidModuleRating(value)) {
      return false;
    }

    const userModuleKey = `${value.userId}:${value.moduleId}`;
    if (ratingIds.has(value.id) || userModules.has(userModuleKey)) {
      return false;
    }

    ratings.push(value);
    ratingIds.add(value.id);
    userModules.add(userModuleKey);
  }

  return true;
}

function readStoredModuleRatings(): StoredRatingsResult {
  if (typeof window === "undefined") {
    return { status: "unavailable" };
  }

  let storedValue: string | null;
  try {
    storedValue = window.localStorage.getItem(moduleRatingsStorageKey);
  } catch (error) {
    console.warn("Data rating modul tidak dapat dibaca dari browser.", error);
    return { status: "unavailable" };
  }

  if (storedValue === null) {
    return { status: "ok", ratings: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch (error) {
    console.warn("Data rating modul tersimpan bukan JSON yang valid.", error);
    return { status: "invalid" };
  }

  if (
    !isRecord(parsed) ||
    parsed.version !== storageVersion ||
    !Array.isArray(parsed.ratings) ||
    !isValidRatingsCollection(parsed.ratings)
  ) {
    console.warn(
      "Data rating modul tersimpan memiliki format atau versi yang tidak valid. Data lama dipertahankan dan tidak akan ditimpa.",
    );
    return { status: "invalid" };
  }

  return { status: "ok", ratings: parsed.ratings.map((rating) => ({ ...rating })) };
}

function validateUserId(userId: string) {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("ID peserta rating tidak valid.");
  }
}

function validateModuleId(moduleId: string) {
  if (!validModuleIds.has(moduleId)) {
    throw new Error(`Modul tidak ditemukan: ${moduleId}`);
  }
}

function createRatingId(existingIds: Set<string>) {
  let id: string;

  do {
    const randomId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    id = `module-rating-${randomId}`;
  } while (existingIds.has(id));

  return id;
}

function cloneModuleRating(rating: ModuleRating): ModuleRating {
  return { ...rating };
}

export function getModuleRatings(): ModuleRating[] {
  const result = readStoredModuleRatings();
  return result.status === "ok"
    ? result.ratings.map(cloneModuleRating)
    : [];
}

export function getModuleRatingByUserId(userId: string): ModuleRating[] {
  validateUserId(userId);
  return getModuleRatings().filter((rating) => rating.userId === userId);
}

export function getModuleRating(
  userId: string,
  moduleId: string,
): ModuleRating | undefined {
  validateUserId(userId);
  validateModuleId(moduleId);

  const rating = getModuleRatings().find(
    (item) => item.userId === userId && item.moduleId === moduleId,
  );
  return rating ? cloneModuleRating(rating) : undefined;
}

export function hasModuleRating(userId: string, moduleId: string): boolean {
  return getModuleRating(userId, moduleId) !== undefined;
}

export function saveModuleRating(
  userId: string,
  moduleId: string,
  rating: number,
  review: string,
): SaveModuleRatingResult {
  validateUserId(userId);
  validateModuleId(moduleId);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new RangeError("Rating harus berupa angka bulat antara 1 dan 5.");
  }
  if (typeof review !== "string" || review.trim().length === 0) {
    throw new Error("Ulasan wajib diisi.");
  }
  if (typeof window === "undefined") {
    throw new Error("Rating modul hanya dapat disimpan di browser.");
  }

  const storedRatings = readStoredModuleRatings();
  if (storedRatings.status === "invalid") {
    throw new Error(
      "Rating tidak dapat disimpan karena data rating tersimpan tidak valid. Data lama tidak diubah.",
    );
  }
  if (storedRatings.status === "unavailable") {
    throw new Error("Data rating modul tidak dapat dibaca dari browser.");
  }

  const existingRating = storedRatings.ratings.find(
    (item) => item.userId === userId && item.moduleId === moduleId,
  );
  if (existingRating) {
    return {
      status: "already-exists",
      rating: cloneModuleRating(existingRating),
    };
  }

  const newRating: ModuleRating = {
    id: createRatingId(new Set(storedRatings.ratings.map((item) => item.id))),
    userId,
    moduleId,
    rating,
    review: review.trim(),
    submittedAt: new Date().toISOString(),
  };
  const updatedRatings = [...storedRatings.ratings, newRating];

  try {
    window.localStorage.setItem(
      moduleRatingsStorageKey,
      JSON.stringify({ version: storageVersion, ratings: updatedRatings }),
    );
  } catch (error) {
    console.warn("Rating modul tidak dapat disimpan.", error);
    throw new Error("Rating modul tidak dapat disimpan di browser.");
  }

  return { status: "saved", rating: cloneModuleRating(newRating) };
}
