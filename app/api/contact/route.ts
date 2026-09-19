import { Resend } from "resend";

interface ContactRequestBody {
  name: string;
  email: string;
  msg: string;
  company: string;
}

type ContactResponse = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: ContactResponse, init?: ResponseInit) {
  return Response.json(body, init);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactRequestBody>;
  const { name, email, msg, company } = body;

  if (!name?.trim() || !email?.trim() || !msg?.trim()) {
    return json({ ok: false, error: "Faltan campos obligatorios." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: "El correo electrónico no es válido." }, { status: 400 });
  }

  if (company) {
    return json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json({ ok: false, error: "El servicio de correo no está configurado." }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "alecjoc85@gmail.com",
      replyTo: email,
      subject: "Nuevo mensaje de contacto — Arcade Vault",
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${msg}`,
    });

    if (sendError) {
      return json({ ok: false, error: "No se pudo enviar el mensaje." }, { status: 502 });
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "No se pudo enviar el mensaje." }, { status: 502 });
  }
}
