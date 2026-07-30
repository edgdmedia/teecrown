import { getTourPackages } from "@/lib/cms";
import { ToursPageContent } from "./page-content";

export default async function ToursPage() {
  const packages = await getTourPackages();
  return <ToursPageContent packages={packages} />;
}
