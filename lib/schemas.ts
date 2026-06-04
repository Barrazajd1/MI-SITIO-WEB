import { z } from "zod";

// ─── Contacto ────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name:    z.string().min(1, "El nombre es requerido").max(100),
  email:   z.email("Email inválido"),
  phone:   z.string().max(30).optional(),
  message: z.string().min(1, "El mensaje es requerido").max(2000),
});

// ─── Proyectos ────────────────────────────────────────────────────────────────
const PROJECT_STATUSES = ["draft", "pending", "in_progress", "review", "done", "deleted"] as const;

export const createProjectSchema = z.object({
  userId:       z.string().min(1, "userId es requerido"),
  name:         z.string().min(1, "El nombre es requerido").max(100),
  description:  z.string().max(500).optional(),
  client_name:  z.string().max(100).optional(),
  client_email: z.email("Email de cliente inválido").optional().or(z.literal("")),
  phone:        z.string().max(30).optional(),
  budget:       z.string().max(50).optional(),
  deadline:     z.string().optional(),
  status:       z.enum(PROJECT_STATUSES).default("pending"),
});

export const updateProjectSchema = z.object({
  name:         z.string().min(1).max(100).optional(),
  description:  z.string().max(500).optional().nullable(),
  client_name:  z.string().max(100).optional().nullable(),
  client_email: z.email().optional().nullable().or(z.literal("")),
  phone:        z.string().max(30).optional().nullable(),
  budget:       z.string().max(50).optional().nullable(),
  deadline:     z.string().optional().nullable(),
  status:       z.enum(PROJECT_STATUSES).optional(),
});

// ─── Rate limiting simple (en memoria) ───────────────────────────────────────
// Almacena { ip -> { count, resetAt } }
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Verifica si una IP supera el límite.
 * @param ip - IP del cliente
 * @param limit - máximo de requests permitidos
 * @param windowMs - ventana de tiempo en ms (default: 10 minutos)
 */
export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
