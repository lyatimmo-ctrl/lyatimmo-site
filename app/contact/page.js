"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // À brancher plus tard sur un envoi réel (email / CRM Transactimo).
    setSent(true);
  }

  return (
    <>
      <Nav />
      <section className="pt-40 px-6 md:px-14 pb-6 text-center">
        <span className="text-[11px] tracking-[0.28em] text-gold uppercase mb-4 block">
          Contact
        </span>
        <h1 className="font-serif text-[34px] md:text-[54px] font-medium max-w-[640px] mx-auto">
          Parlons de votre bien
        </h1>
        <p className="max-w-[440px] mx-auto mt-5 text-stone text-[15px] leading-[1.8]">
          Vente, location ou simple estimation : décrivez votre projet, nous
          revenons vers vous sous 24h.
        </p>
      </section>

      <section className="px-6 md:px-14 pb-32 max-w-[640px] mx-auto w-full">
        {sent ? (
          <div className="border border-line px-8 py-16 text-center mt-10">
            <p className="font-serif text-2xl mb-3">Message envoyé</p>
            <p className="text-stone text-[14px]">
              Nous revenons vers vous sous 24h ouvrées.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <FormField label="Nom" id="nom" required />
              <FormField label="Téléphone" id="tel" type="tel" />
            </div>
            <FormField label="Email" id="email" type="email" required />
            <div>
              <label htmlFor="motif" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
                Votre demande
              </label>
              <select id="motif" className="w-full border-b border-line bg-transparent py-2.5 text-[15px] focus:outline-none focus:border-gold">
                <option>Estimation de mon bien</option>
                <option>Vendre un bien</option>
                <option>Mettre un bien en location</option>
                <option>Question sur une annonce</option>
                <option>Autre demande</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full border-b border-line bg-transparent py-2.5 text-[15px] focus:outline-none focus:border-gold resize-none"
                placeholder="Décrivez votre bien ou votre projet…"
              />
            </div>
            <button
              type="submit"
              className="bg-ink text-paper px-9 py-4 text-[12px] tracking-[0.18em] uppercase hover:opacity-90 transition-opacity"
            >
              Envoyer ma demande
            </button>
          </form>
        )}
      </section>

      <Footer />
    </>
  );
}

function FormField({ label, id, type = "text", required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] tracking-[0.12em] uppercase text-stone mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="w-full border-b border-line bg-transparent py-2.5 text-[15px] focus:outline-none focus:border-gold"
      />
    </div>
  );
}
