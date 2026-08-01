import HomePageContent from "./home-page-content";
import { getPosts, getTestimonials, getTourPackages } from "@/lib/cms";

export const dynamic = "force-static";
export const revalidate = 300;

export default async function HomePage() {
  const [posts, packages, testimonials] = await Promise.all([
    getPosts(),
    getTourPackages(),
    getTestimonials(),
  ]);

  return <HomePageContent posts={posts} packages={packages} testimonials={testimonials} />;
}
