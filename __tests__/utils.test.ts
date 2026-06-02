import { describe, it, expect } from "vitest";

// ─── Utilidades puras del proyecto ───────────────────────────────────────────
// Estas funciones son ejemplos de lógica que podrías extraer a lib/utils.ts

function formatDate(dateStr: string, locale = "es-ES"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("formatea una fecha en español", () => {
    const result = formatDate("2025-01-15T10:00:00Z", "es-ES");
    expect(result).toContain("2025");
    expect(result).toContain("15");
  });

  it("devuelve una cadena no vacía para cualquier fecha válida", () => {
    expect(formatDate("2024-06-01")).toBeTruthy();
  });
});

describe("slugify", () => {
  it("convierte texto a slug", () => {
    expect(slugify("Hola Mundo")).toBe("hola-mundo");
  });

  it("elimina acentos", () => {
    expect(slugify("Servicios de Diseño")).toBe("servicios-de-diseno");
  });

  it("elimina caracteres especiales", () => {
    expect(slugify("¿Quiénes somos?")).toBe("quienes-somos");
  });

  it("no deja guiones al inicio ni al final", () => {
    const result = slugify("  mi página  ");
    expect(result).not.toMatch(/^-|-$/);
  });
});

describe("truncate", () => {
  it("no modifica textos más cortos que el límite", () => {
    expect(truncate("Hola", 10)).toBe("Hola");
  });

  it("trunca y agrega puntos suspensivos", () => {
    const result = truncate("Este es un texto muy largo", 10);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(11);
  });

  it("respeta exactamente el límite", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });
});
