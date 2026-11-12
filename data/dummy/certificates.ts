import { learningModules } from "@/data/dummy/modules";
import { hasModuleRating } from "@/data/dummy/module-ratings";
import {
  isModuleCompleted,
  onLearningProgressHydrated,
} from "@/data/dummy/learning-progress";

export type LearningCertificate = {
  id: string;
  userId: string;
  participantName?: string;
  moduleId: string;
  certificateNumber: string;
  issuedAt: string;
  status: "issued";
};

export const learningCertificates: LearningCertificate[] = [];

const certificatesStorageKey = "empat-pilar:learning-certificates:v1";
let nextCertificateSequence = 1;
let hasHydratedCertificates = false;

function assertValidUserId(userId: string) {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("ID peserta sertifikat tidak valid.");
  }
}

function assertValidModuleId(moduleId: string) {
  if (!learningModules.some((module) => module.id === moduleId)) {
    throw new Error(`Modul tidak ditemukan: ${moduleId}`);
  }
}

function getCertificateSequence(certificate: LearningCertificate) {
  const certificateIdSequence = Number(
    certificate.id.match(/^certificate-(\d+)$/)?.[1] ?? 0,
  );
  const numberSequence = Number(
    certificate.certificateNumber.match(/^4P-\d{4}-(\d+)$/)?.[1] ?? 0,
  );

  return Math.max(certificateIdSequence, numberSequence);
}

function isValidCertificate(value: unknown): value is LearningCertificate {
  if (!value || typeof value !== "object") {
    return false;
  }

  const certificate = value as Partial<LearningCertificate>;
  return (
    typeof certificate.id === "string" &&
    /^certificate-\d+$/.test(certificate.id) &&
    typeof certificate.userId === "string" &&
    certificate.userId.trim().length > 0 &&
    (certificate.participantName === undefined ||
      (typeof certificate.participantName === "string" &&
        certificate.participantName.trim().length > 0)) &&
    typeof certificate.moduleId === "string" &&
    learningModules.some((module) => module.id === certificate.moduleId) &&
    typeof certificate.certificateNumber === "string" &&
    /^4P-\d{4}-\d{6,}$/.test(certificate.certificateNumber) &&
    typeof certificate.issuedAt === "string" &&
    Number.isFinite(Date.parse(certificate.issuedAt)) &&
    certificate.status === "issued"
  );
}

function persistCertificates() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      certificatesStorageKey,
      JSON.stringify({
        version: 1,
        nextSequence: nextCertificateSequence,
        certificates: learningCertificates,
      }),
    );
  } catch (error) {
    console.warn("Sertifikat tidak dapat disimpan.", error);
  }
}

function hydrateCertificates() {
  if (typeof window === "undefined" || hasHydratedCertificates) {
    return;
  }

  hasHydratedCertificates = true;
  try {
    const storedValue = window.localStorage.getItem(certificatesStorageKey);
    if (!storedValue) {
      return;
    }

    const parsed: unknown = JSON.parse(storedValue);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("version" in parsed) ||
      parsed.version !== 1 ||
      !("certificates" in parsed) ||
      !Array.isArray(parsed.certificates)
    ) {
      console.warn(
        "Data sertifikat tersimpan memiliki format yang tidak valid; sertifikat dimulai ulang.",
      );
      return;
    }

    const restoredCertificates: LearningCertificate[] = [];
    const seenIds = new Set<string>();
    const seenNumbers = new Set<string>();
    const seenUserModules = new Set<string>();
    for (const item of parsed.certificates) {
      if (!isValidCertificate(item)) {
        continue;
      }

      const userModuleKey = `${item.userId}:${item.moduleId}`;
      if (
        seenIds.has(item.id) ||
        seenNumbers.has(item.certificateNumber) ||
        seenUserModules.has(userModuleKey)
      ) {
        continue;
      }

      restoredCertificates.push({ ...item });
      seenIds.add(item.id);
      seenNumbers.add(item.certificateNumber);
      seenUserModules.add(userModuleKey);
    }

    learningCertificates.splice(
      0,
      learningCertificates.length,
      ...restoredCertificates,
    );

    const storedSequence =
      "nextSequence" in parsed &&
      Number.isSafeInteger(parsed.nextSequence) &&
      Number(parsed.nextSequence) > 0
        ? Number(parsed.nextSequence)
        : 1;
    const nextUnusedSequence =
      Math.max(0, ...restoredCertificates.map(getCertificateSequence)) + 1;
    nextCertificateSequence = Math.max(
      nextCertificateSequence,
      storedSequence,
      nextUnusedSequence,
    );
  } catch (error) {
    console.warn(
      "Data sertifikat tersimpan tidak dapat dibaca; sertifikat dimulai ulang.",
      error,
    );
  }
}

onLearningProgressHydrated(hydrateCertificates);

export function getCertificatesByUserId(
  userId: string,
): LearningCertificate[] {
  assertValidUserId(userId);
  return learningCertificates
    .filter((certificate) => certificate.userId === userId)
    .map((certificate) => ({ ...certificate }));
}

export function getCertificateById(
  certificateId: string,
): LearningCertificate | undefined {
  const certificate = learningCertificates.find(
    (item) => item.id === certificateId,
  );
  return certificate ? { ...certificate } : undefined;
}

export function getCertificateByModuleId(
  userId: string,
  moduleId: string,
): LearningCertificate | undefined {
  assertValidUserId(userId);
  assertValidModuleId(moduleId);

  const certificate = learningCertificates.find(
    (item) => item.userId === userId && item.moduleId === moduleId,
  );
  return certificate ? { ...certificate } : undefined;
}

export function issueCertificate(
  userId: string,
  moduleId: string,
  participantName: string,
): LearningCertificate | undefined {
  assertValidUserId(userId);
  assertValidModuleId(moduleId);
  if (typeof participantName !== "string" || participantName.trim().length === 0) {
    throw new Error("Nama peserta wajib tersedia untuk menerbitkan sertifikat.");
  }

  hydrateCertificates();
  const existingCertificate = getCertificateByModuleId(userId, moduleId);
  if (existingCertificate) {
    return existingCertificate;
  }

  const moduleCompleted = isModuleCompleted(moduleId);
  if (!moduleCompleted) {
    return undefined;
  }

  if (!hasModuleRating(userId, moduleId)) {
    throw new Error(
      "Rating dan ulasan untuk modul ini wajib diberikan sebelum sertifikat diterbitkan.",
    );
  }

  const sequence = nextCertificateSequence;
  const year = new Date().getFullYear();
  const certificate: LearningCertificate = {
    id: `certificate-${sequence}`,
    userId,
    participantName: participantName.trim(),
    moduleId,
    certificateNumber: `4P-${year}-${String(sequence).padStart(6, "0")}`,
    issuedAt: new Date().toISOString(),
    status: "issued",
  };

  learningCertificates.push(certificate);
  nextCertificateSequence += 1;
  persistCertificates();

  return { ...certificate };
}
