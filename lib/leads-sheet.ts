const LEADS_SHEET_ENDPOINT = process.env.LEADS_SHEET_ENDPOINT;
const LEADS_SHEET_TOKEN = process.env.LEADS_SHEET_TOKEN;

// Callers wait on the sync before sending the email, and Apps Script can be
// slow to answer, so it is cut off rather than allowed to hold the request.
const SYNC_TIMEOUT_MS = 5000;

/**
 * A lead as the spreadsheet expects it. Keys must match the header row
 * exactly: the Apps Script maps the payload by header name and silently
 * ignores anything it cannot place. `Teléfono` has no column yet, so it is
 * also folded into `Notas` to avoid losing it; once the column exists, the
 * dedicated field starts populating on its own.
 *
 * The ID and date columns are derived by the script, not sent from here.
 */
interface LeadRow {
  Nombre: string;
  Email: string;
  Empresa: string;
  País: string;
  Teléfono: string;
  Mensaje: string;
  Estado: string;
  Fuente: string;
  Notas: string;
}

interface LeadInput {
  nombre?: string;
  email: string;
  empresa?: string;
  pais: string;
  telefono?: string;
  mensaje: string;
  fuente: string;
}

/**
 * Mirrors a lead to the leads spreadsheet.
 *
 * This is a secondary channel: a failure here is logged and swallowed rather
 * than failing the request. Callers invoke it before sending the email, so the
 * lead is kept even when the email is rejected.
 */
export async function syncLeadToSpreadsheet(lead: LeadInput): Promise<void> {
  if (!LEADS_SHEET_ENDPOINT) return;

  const notes = lead.telefono
    ? `Teléfono: ${lead.telefono}. Generado automáticamente desde eggpertise.com`
    : "Generado automáticamente desde eggpertise.com";

  const row: LeadRow = {
    Nombre: lead.nombre ?? "",
    Email: lead.email,
    Empresa: lead.empresa ?? "",
    País: lead.pais,
    Teléfono: lead.telefono ?? "",
    Mensaje: lead.mensaje,
    Estado: "Nuevo",
    Fuente: lead.fuente,
    Notas: notes,
  };

  try {
    const response = await fetch(LEADS_SHEET_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: LEADS_SHEET_TOKEN, ...row }),
      signal: AbortSignal.timeout(SYNC_TIMEOUT_MS),
    });

    // fetch only rejects on network errors, so a non-2xx has to be checked
    // explicitly or the failure passes silently.
    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${details}`);
    }

    // Apps Script Web Apps always answer 200, so the real outcome lives in the
    // payload rather than the status code.
    const result = await response.json();
    if (result?.ok !== true) {
      throw new Error(result?.error ?? "Unexpected response payload");
    }
  } catch (error) {
    console.error(
      `Spreadsheet sync failed for ${lead.email}:`,
      error instanceof Error ? error.message : error
    );
  }
}
