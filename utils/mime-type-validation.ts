const allowedExtensions = [
  "doc",
  "docx",
  "ppt",
  "pptx",
  "pdf",
  "xls",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
];

export function validateMimeType(files: File[]): boolean {
  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.split(".").pop();
    if (!ext || !allowedExtensions.includes(ext)) {
      return false;
    }
  }
  return true;
}
