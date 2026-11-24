/**
 * Client preview switch: `?color=blanco` turns every gray/cream background of
 * the public site white for the rest of the tab session (sessionStorage);
 * `?color=gris` or `?color=normal` turns it off. Applied as
 * `<html data-fondo="blanco">`, see globals.css.
 */
export type Fondo = "blanco" | "normal";

export const FONDO_PARAM = "color";
export const FONDO_STORAGE_KEY = "autentizity-fondo";
export const FONDO_ATTRIBUTE = "data-fondo";

// Must stay self-contained (no outer references): it is serialized into the inline script.
export function resolveFondo(param: string | null, stored: string | null): Fondo {
  const value = (param || "").trim().toLowerCase();
  if (value === "blanco") return "blanco";
  if (value === "gris" || value === "normal") return "normal";
  return stored === "blanco" ? "blanco" : "normal";
}

/** Reads the URL + sessionStorage, persists the decision and sets/removes the attribute. */
export function applyFondo(): Fondo {
  let stored: string | null = null;
  try {
    stored = window.sessionStorage.getItem(FONDO_STORAGE_KEY);
  } catch {}
  const fondo = resolveFondo(new URLSearchParams(window.location.search).get(FONDO_PARAM), stored);
  try {
    if (fondo === "blanco") window.sessionStorage.setItem(FONDO_STORAGE_KEY, "blanco");
    else window.sessionStorage.removeItem(FONDO_STORAGE_KEY);
  } catch {}
  if (fondo === "blanco") document.documentElement.setAttribute(FONDO_ATTRIBUTE, "blanco");
  else document.documentElement.removeAttribute(FONDO_ATTRIBUTE);
  return fondo;
}

export function clearFondo(): void {
  document.documentElement.removeAttribute(FONDO_ATTRIBUTE);
}

/** Runs before first paint (rendered at the top of the public layout) to avoid a gray flash. */
export const FONDO_INLINE_SCRIPT = `(function(){var s=null,f;try{s=sessionStorage.getItem(${JSON.stringify(
  FONDO_STORAGE_KEY
)})}catch(e){}f=(${resolveFondo.toString()})(new URLSearchParams(location.search).get(${JSON.stringify(
  FONDO_PARAM
)}),s);try{f==="blanco"?sessionStorage.setItem(${JSON.stringify(
  FONDO_STORAGE_KEY
)},"blanco"):sessionStorage.removeItem(${JSON.stringify(FONDO_STORAGE_KEY)})}catch(e){}if(f==="blanco")document.documentElement.setAttribute(${JSON.stringify(
  FONDO_ATTRIBUTE
)},"blanco")})();`;
