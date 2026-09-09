import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BiensBrowser from "@/components/BiensBrowser";
import { getPublishedListings, filterOptions } from "@/lib/listings";

// Toujours servir la liste a jour : une annonce publiee (ou retiree) cote
// Transactimo doit apparaitre (ou disparaitre) immediatement, comme sur la
// page d'accueil qui lit Supabase cote client. Le cache ISR de 5 min faisait
// apparaitre /biens vide juste apres une publication.
export const dynamic = "force-dynamic";

export default async function BiensPage() {
  const { rows } = await getPublishedListings();
  const { communes, types } = filterOptions(rows);

  return (
    <>
      <Nav />
      <BiensBrowser rows={rows} communes={communes} types={types} />
      <Footer />
    </>
  );
}
