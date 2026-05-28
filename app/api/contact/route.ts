import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, phone, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const phoneLine = phone ? `Teléfono: ${phone}\n` : "";

  const { error } = await resend.emails.send({
    from: "Contacto <onboarding@resend.dev>",
    to: "davidbarraza18@hotmail.com",
    replyTo: email,
    subject: `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n${phoneLine}\nMensaje:\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
