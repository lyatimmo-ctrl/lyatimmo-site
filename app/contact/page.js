import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — LYAT IMMO" };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-6 text-center">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Contact
        </span>
        <h1 className="font-serif text-[34px] md:text-[54px] font-medium max-w-[640px] mx-auto">
          Parlons de votre projet
        </h1>
        <p className="max-w-[460px] mx-auto mt-5 text-stone text-[15px] leading-[1.8]">
          Projet de vente, estimation, expertise ou intérêt pour le réseau :
          décrivez votre demande, nous revenons vers vous sous 24h ouvrées.
        </p>
      </section>

      <section className="px-6 md:px-14 pb-32 max-w-[640px] mx-auto w-full">
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </section>

      <Footer />
    </>
  );
}
