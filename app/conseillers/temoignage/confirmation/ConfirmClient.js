"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyTemoignage } from "@/lib/minisites";

export default function ConfirmClient() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState("pending"); // pending | ok | error

  useEffect(() => {
    let alive = true;
    (async () => {
      const ok = token ? await verifyTemoignage(token) : false;
      if (alive) setState(ok ? "ok" : "error");
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  if (state === "pending") {
    return <p className="text-stone text-[15px]">Vérification en cours…</p>;
  }

  if (state === "ok") {
    return (
      <div>
        <h1 className="font-serif text-[28px] text-ink mb-4">Témoignage confirmé</h1>
        <p className="text-[15px] text-stone leading-[1.8]">
          Merci ! Votre adresse e-mail est confirmée. Votre témoignage est maintenant transmis à
          l&apos;équipe LYAT IMMO pour modération avant publication.
        </p>
        <Link href="/conseillers" className="inline-block mt-8 text-[12px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1">
          Voir les conseillers LYAT IMMO
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-[28px] text-ink mb-4">Lien invalide ou déjà utilisé</h1>
      <p className="text-[15px] text-stone leading-[1.8]">
        Ce lien de confirmation n&apos;est plus valable. Si vous pensez qu&apos;il s&apos;agit
        d&apos;une erreur, vous pouvez redéposer votre témoignage depuis la page du conseiller,
        ou nous écrire à{" "}
        <a href="mailto:contact@lyatimmo.com" className="underline underline-offset-2 hover:text-ink">
          contact@lyatimmo.com
        </a>
        .
      </p>
    </div>
  );
}
