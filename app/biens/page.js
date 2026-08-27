import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BiensBrowser from "@/components/BiensBrowser";
import { getPublishedListings, filterOptions } from "@/lib/listings";

export const revalidate = 300; // rafraichit la liste au plus toutes les 5 min

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
