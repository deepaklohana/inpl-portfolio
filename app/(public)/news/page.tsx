import NewsPageClient from "./NewsPageClient";
import { getArticles } from "@/lib/actions/articles";

export const metadata = {
  title: "News & Events | Innovative Network",
  description: "Stay informed with our latest news, product updates, and thought leadership content.",
};

export default async function NewsPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles({ status: "published" });
  } catch {
    console.warn("News page articles fetch failed. Rendering fallback list.");
  }

  return (
    <main className="w-full">
      <NewsPageClient articles={articles} />
    </main>
  );
}
