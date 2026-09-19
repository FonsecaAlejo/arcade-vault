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

  return json({ ok: true });
}
