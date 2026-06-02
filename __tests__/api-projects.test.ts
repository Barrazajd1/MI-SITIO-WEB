import { describe, it, expect, vi } from "vitest";

// ─── Tests de lógica de API routes ───────────────────────────────────────────
// Testeamos la lógica de validación sin montar el servidor completo.
// En Next.js 15 las API routes son funciones puras — fáciles de testear.

// Función de validación que podrías extraer de app/api/projects/route.ts
function validateProjectInput(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Body inválido" };
  }
  const { userId, name } = body as Record<string, unknown>;

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    return { valid: false, error: "userId es requerido" };
  }
  if (!name || typeof name !== "string" || name.trim() === "") {
    return { valid: false, error: "El nombre del proyecto es requerido" };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: "El nombre no puede superar los 100 caracteres" };
  }

  return { valid: true };
}

describe("validateProjectInput", () => {
  it("acepta un body válido", () => {
    const result = validateProjectInput({ userId: "user_123", name: "Mi proyecto" });
    expect(result.valid).toBe(true);
  });

  it("rechaza body null", () => {
    expect(validateProjectInput(null).valid).toBe(false);
  });

  it("rechaza userId vacío", () => {
    expect(validateProjectInput({ userId: "", name: "Proyecto" }).valid).toBe(false);
  });

  it("rechaza nombre vacío", () => {
    expect(validateProjectInput({ userId: "user_123", name: "" }).valid).toBe(false);
  });

  it("rechaza nombre demasiado largo", () => {
    const longName = "a".repeat(101);
    const result = validateProjectInput({ userId: "user_123", name: longName });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("100 caracteres");
  });

  it("acepta descripción opcional ausente", () => {
    const result = validateProjectInput({ userId: "user_123", name: "Test" });
    expect(result.valid).toBe(true);
  });
});
