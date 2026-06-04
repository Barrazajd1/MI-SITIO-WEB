import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema, checkRateLimit } from "@/lib/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

function adminEmailHtml(name: string, email: string, phone: string | null, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #009fe1; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Nuevo mensaje de contacto</h1>
      </div>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 100px;">Nombre</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #009fe1; font-size: 14px;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Teléfono</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px;">${phone}</td>
          </tr>` : ""}
        </table>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Mensaje</p>
          <p style="color: #111827; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <div style="margin-top: 20px;">
          <a href="mailto:${email}?subject=Re: Tu mensaje" style="background: #009fe1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
            Responder a ${name}
          </a>
        </div>
      </div>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
        Enviado desde el formulario de mi-sitio-web
      </p>
    </div>
  `;
}

function confirmationEmailHtml(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #2e435e; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Gracias por contactarnos</h1>
      </div>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
        <p style="color: #111827; font-size: 15px; margin: 0 0 12px;">Hola <strong>${name}</strong>,</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Recibimos tu mensaje. Nos pondremos en contacto contigo en un plazo de
          <strong>1 día hábil</strong>.
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
          Si tienes alguna pregunta urgente, puedes responder directamente a este correo.
        </p>
      </div>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
        mi-sitio-web · Sitio web multilingüe con Next.js
      </p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  // Rate limiting: máx 5 envíos por IP cada 10 minutos
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip, 5);
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos." },
      { status: 429 }
    );
  }

  // Validación con Zod
  const body = await req.json();
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Datos inválidos";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, email, phone, message } = result.data;

  const [adminResult, confirmResult] = await Promise.allSettled([
    resend.emails.send({
      from: "Contacto <onboarding@resend.dev>",
      to: "davidbarraza18@hotmail.com",
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      html: adminEmailHtml(name, email, phone ?? null, message),
    }),
    resend.emails.send({
      from: "mi-sitio-web <onboarding@resend.dev>",
      to: email,
      subject: "Recibimos tu mensaje",
      html: confirmationEmailHtml(name),
    }),
  ]);

  if (adminResult.status === "rejected" || adminResult.value.error) {
    const errMsg =
      adminResult.status === "rejected"
        ? adminResult.reason?.message
        : adminResult.value.error?.message;
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  if (confirmResult.status === "rejected") {
    console.warn("Confirmation email failed:", confirmResult.reason?.message);
  }

  return NextResponse.json({ ok: true });
}
