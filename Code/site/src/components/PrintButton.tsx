"use client";

import { Icon } from "./Icons";

/** Opens the browser's print dialog, where "Save as PDF" makes the downloadable file. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn3d gold">
      <span className="chip"><Icon name="download" /></span>Descargar PDF
    </button>
  );
}
