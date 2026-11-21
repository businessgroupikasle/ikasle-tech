import { fileKinds, formatFromName, formatInfo, MAX_FILE_BYTES, type FileFormat, type FileKind } from "../file-rules";

/** Leading bytes that identify each format, so a renamed file (e.g. an .exe called resume.pdf) is rejected. */
const signatures: Record<FileFormat, (b: Uint8Array) => boolean> = {
  pdf: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
  doc: (b) => [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every((v, i) => b[i] === v), // OLE2 compound file
  docx: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04, // ZIP container
  zip: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v),
  webp: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
};

export type CheckedFile = { name: string; mime: string; bytes: Buffer };

/** Validates an uploaded file's kind, size, extension and actual content. Returns the error message, or the file. */
export async function checkUpload(file: File, kind: FileKind): Promise<{ ok: true; file: CheckedFile } | { ok: false; message: string }> {
  if (!(kind in fileKinds)) return { ok: false, message: "Unknown document type." };
  if (file.size === 0) return { ok: false, message: "This file is empty." };
  if (file.size > MAX_FILE_BYTES) return { ok: false, message: "Files must be 4 MB or smaller." };

  const format = formatFromName(file.name, kind);
  if (!format) return { ok: false, message: "This file type isn't accepted here." };

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!signatures[format](bytes)) return { ok: false, message: "This file's contents don't match its type. Please upload the original document." };

  // Keep the original name readable but safe for storage and download headers.
  const name = file.name.replace(/[^\p{L}\p{N}._ -]+/gu, "_").replace(/\s+/g, " ").trim().slice(0, 150) || `document${formatInfo[format].extensions[0]}`;
  return { ok: true, file: { name, mime: formatInfo[format].mime, bytes } };
}
