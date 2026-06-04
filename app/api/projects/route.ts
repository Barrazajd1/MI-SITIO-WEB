import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createProjectSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  // Validación con Zod
  const body = await req.json();
  const result = createProjectSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message ?? "Datos inválidos";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { userId, name, description, client_name, client_email, phone, budget, deadline, status } = result.data;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      user_id:      userId,
      name,
      description:  description   || null,
      client_name:  client_name   || null,
      client_email: client_email  || null,
      phone:        phone         || null,
      budget:       budget        || null,
      deadline:     deadline      || null,
      status:       status        ?? "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
