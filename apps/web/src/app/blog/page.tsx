import { getPosts } from "@/lib/cms";
import { BlogPageContent } from "./page-content";

export const dynamic = "force-static";

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogPageContent posts={posts} />;
}
