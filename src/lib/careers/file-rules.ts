/**
 * Upload rules shared by the application form (to check files before sending) and the upload API (to enforce them).
 * Each file is uploaded on its own request, so the size limit stays under the ~4.5 MB request cap of serverless
 * hosting such as Vercel.
 */

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_FILE_LABEL = "4 MB";

export type FileKind = "resume" | "portfolio" | "work_sample" | "supporting";
export type FileFormat = "pdf" | "doc" | "docx" | "jpg" | "png" | "webp" | "zip";

export const fileKinds: Record<FileKind, { label: string; formats: FileFormat[]; maxCount: number }> = {
  resume: { label: "Resume", formats: ["pdf", "doc", "docx"], maxCount: 1 },
  portfolio: { label: "Portfolio", formats: ["pdf"], maxCount: 1 },
  work_sample: { label: "Work samples", formats: ["pdf", "jpg", "png", "webp", "zip"], maxCount: 5 },
  supporting: { label: "Supporting documents", formats: ["pdf", "jpg", "png", "doc", "docx"], maxCount: 3 },
};

export const formatInfo: Record<FileFormat, { extensions: string[]; mime: string }> = {
  pdf: { extensions: [".pdf"], mime: "application/pdf" },
  doc: { extensions: [".doc"], mime: "application/msword" },
  docx: { extensions: [".docx"], mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  jpg: { extensions: [".jpg", ".jpeg"], mime: "image/jpeg" },
  png: { extensions: [".png"], mime: "image/png" },
  webp: { extensions: [".webp"], mime: "image/webp" },
  zip: { extensions: [".zip"], mime: "application/zip" },
};

/** `accept` attribute value for a file input of this kind. */
export const acceptFor = (kind: FileKind) => fileKinds[kind].formats.flatMap((f) => formatInfo[f].extensions).join(",");

/** Human list such as "PDF, DOC or DOCX". */
export const formatList = (kind: FileKind) => {
  const names = fileKinds[kind].formats.map((f) => f.toUpperCase());
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} or ${names.at(-1)}` : names[0];
};

/** The format a file name claims by its extension, if it's one this kind accepts. */
export function formatFromName(name: string, kind: FileKind): FileFormat | null {
  const lower = name.toLowerCase();
  return fileKinds[kind].formats.find((f) => formatInfo[f].extensions.some((ext) => lower.endsWith(ext))) ?? null;
}

/** Client-side check before uploading. Returns an error message, or null when the file is acceptable. */
export function checkFile(file: { name: string; size: number }, kind: FileKind): string | null {
  if (!formatFromName(file.name, kind)) return `Please choose a ${formatList(kind)} file.`;
  if (file.size === 0) return "This file is empty.";
  if (file.size > MAX_FILE_BYTES) return `Files must be ${MAX_FILE_LABEL} or smaller.`;
  return null;
}
