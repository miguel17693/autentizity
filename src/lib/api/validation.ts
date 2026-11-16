export type FieldType = "string" | "boolean" | "string[]";
export type BodySchema = Record<string, FieldType>;
export type JsonBody = Record<string, unknown>;

const TYPE_LABELS: Record<FieldType, string> = {
  string: "un texto",
  boolean: "verdadero o falso",
  "string[]": "una lista de textos",
};

const FIELD_LABELS: Record<string, string> = { title: "título" };

function matchesType(value: unknown, type: FieldType): boolean {
  if (type === "string[]") return Array.isArray(value) && value.every((v) => typeof v === "string");
  return typeof value === type;
}

export async function readJsonBody(request: Request): Promise<JsonBody | null> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as JsonBody) : null;
  } catch {
    return null;
  }
}

/**
 * Returns a Spanish error message for the first invalid field, or null when the body is valid.
 * Absent fields are not type-checked. `required` fields must be non-empty strings; with
 * `partial` (updates) they may be omitted but not blanked.
 */
export function validateBody(
  body: JsonBody,
  schema: BodySchema,
  { required = [], partial = false }: { required?: string[]; partial?: boolean } = {}
): string | null {
  for (const field of required) {
    const value = body[field];
    if (partial && value === undefined) continue;
    if (typeof value !== "string" || !value.trim()) {
      return `El campo "${FIELD_LABELS[field] ?? field}" es obligatorio`;
    }
  }
  for (const [field, type] of Object.entries(schema)) {
    const value = body[field];
    if (value !== undefined && !matchesType(value, type)) {
      return `El campo "${FIELD_LABELS[field] ?? field}" debe ser ${TYPE_LABELS[type]}`;
    }
  }
  return null;
}
