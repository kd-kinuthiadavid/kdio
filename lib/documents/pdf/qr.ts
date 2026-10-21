import QRCode from "qrcode";

/** One SVG path of the dark modules, so the code renders crisply and identically every time. */
export function qrPath(text: string): { path: string; size: number } {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const { size, data } = modules;
  let path = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (data[row * size + col]) path += `M${col} ${row}h1v1h-1z`;
    }
  }
  return { path, size };
}
