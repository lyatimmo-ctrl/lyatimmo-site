import { Resend } from "resend";

const CONTACT_TO = "contact@lyatimmo.com";
const CONTACT_FROM = "LYAT IMMO — Site <contact@lyatimmo.com>";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const nom = (data?.nom || "").trim();
  const tel = (data?.tel || "").trim();
  const email = (data?.email || "").trim();
  const motif = (data?.motif || "").trim();
  const message = (data?.message || "").trim();

  if (!nom || !email || !message) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY manquante dans l'environnement.");
    return Response.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Nouvelle demande de contact — ${motif || "site LYAT IMMO"}`,
      text: [
        `Nom : ${nom}`,
        `Téléphone : ${tel || "non renseigné"}`,
        `Email : ${email}`,
        `Motif : ${motif || "non précisé"}`,
        "",
        "Message :",
        message,
      ].join("\n"),
    });

    if (result.error) {
      console.error("[contact] Erreur Resend :", result.error);
      return Response.json({ error: "send_failed" }, { status: 502 });
    }

    return Response.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[contact] Exception Resend :", err);
    return Response.json({ error: "send_failed" }, { status: 500 });
  }
}
