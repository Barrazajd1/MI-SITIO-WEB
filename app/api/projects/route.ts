import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, name, description, client_name, client_email, phone, budget, deadline, status } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({ error: "userId y name son requeridos" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        user_id: userId, name,
        description:  description  || null,
        client_name:  client_name  || null,
        client_email: client_email || null,
        phone:        phone        || null,
        budget:       budget       || null,
        deadline:     deadline     || null,
        status:       status       || "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
