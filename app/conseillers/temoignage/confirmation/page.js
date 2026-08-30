import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConfirmClient from "./ConfirmClient";

export const metadata = {
  title: "Confirmation du témoignage | LYAT IMMO",
  robots: { index: false, follow: false },
};

export default function TemoignageConfirmation() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-32 max-w-[620px]">
        <Suspense fallback={<p className="text-stone text-[15px]">Vérification en cours…</p>}>
          <ConfirmClient />
        </Suspense>
      </section>
      <Footer />
    </>
  );
}
