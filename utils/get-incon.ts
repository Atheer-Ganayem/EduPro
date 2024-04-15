export function getIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (!ext) {
    return "";
  } else if (ext === "doc" || ext === "docx") {
    return "microsoftWord.svg";
  } else if (ext === "pptx") {
    return "microsoftPowerpoint.svg";
  } else if (["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xlt"].includes(ext)) {
    return "microsoftExcel.svg";
  } else if (ext === "pdf") {
    return "pdf.svg";
  }

  return "";
}
