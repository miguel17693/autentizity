import { describe, expect, it } from "vitest";
import { FONDO_INLINE_SCRIPT, FONDO_STORAGE_KEY, resolveFondo } from "@/lib/fondo";

describe("resolveFondo", () => {
  it("turns the white variant on with ?color=blanco, whatever is stored", () => {
    expect(resolveFondo("blanco", null)).toBe("blanco");
    expect(resolveFondo(" Blanco ", "normal")).toBe("blanco");
  });

  it("turns it off with ?color=gris or ?color=normal even if stored", () => {
    expect(resolveFondo("gris", "blanco")).toBe("normal");
    expect(resolveFondo("normal", "blanco")).toBe("normal");
  });

  it("keeps the stored choice when the param is missing or unknown", () => {
    expect(resolveFondo(null, "blanco")).toBe("blanco");
    expect(resolveFondo("rojo", "blanco")).toBe("blanco");
    expect(resolveFondo(null, null)).toBe("normal");
    expect(resolveFondo("", "otro")).toBe("normal");
  });
});

describe("FONDO_INLINE_SCRIPT", () => {
  function run(search: string, initial: Record<string, string> = {}) {
    const store = new Map(Object.entries(initial));
    const attrs = new Map<string, string>();
    const sessionStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    };
    const document = { documentElement: { setAttribute: (k: string, v: string) => void attrs.set(k, v) } };
    new Function("sessionStorage", "location", "document", FONDO_INLINE_SCRIPT)(
      sessionStorage,
      { search },
      document
    );
    return { stored: store.get(FONDO_STORAGE_KEY), attr: attrs.get("data-fondo") };
  }

  it("applies and persists the variant before hydration", () => {
    expect(run("?color=blanco")).toEqual({ stored: "blanco", attr: "blanco" });
    expect(run("", { [FONDO_STORAGE_KEY]: "blanco" })).toEqual({ stored: "blanco", attr: "blanco" });
    expect(run("?color=gris", { [FONDO_STORAGE_KEY]: "blanco" })).toEqual({ stored: undefined, attr: undefined });
    expect(run("")).toEqual({ stored: undefined, attr: undefined });
  });
});
