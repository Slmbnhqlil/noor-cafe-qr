import { fetchMenuServer } from "@/lib/menuServer";
import MenuClient from "@/components/MenuClient";

export const revalidate = 60;

export default async function MenuPage() {
  const { categories, items } = await fetchMenuServer();
  return <MenuClient initialCats={categories} initialItems={items} />;
}
