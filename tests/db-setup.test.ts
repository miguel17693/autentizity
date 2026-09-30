import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/db/setup/route";

const { initSchema, revalidatePath } = vi.hoisted(() => ({
  initSchema: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock("@/lib/data/schema", () => ({ initSchema }));
vi.mock("next/cache", () => ({ revalidatePath }));

beforeEach(() => {
  vi.clearAllMocks();
  initSchema.mockResolvedValue({ success: true });
});

describe("Database setup ecosystem cache invalidation", () => {
  it("invalidates Ecosistema after a successful migration without waiting for ISR", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/ecosistema");
    expect(initSchema.mock.invocationCallOrder[0]).toBeLessThan(revalidatePath.mock.invocationCallOrder[0]);
  });

  it("does not invalidate when the migration fails", async () => {
    initSchema.mockRejectedValue(new Error("SQL failure fixture"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await GET();
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "Error interno del servidor" });
      expect(revalidatePath).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
