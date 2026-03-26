import NewsPageClient from "./NewsPageClient";

export const metadata = {
  title: "News & Events | Innovative Network",
  description: "Stay informed with our latest news, product updates, and thought leadership content.",
};

export default function NewsPage() {
  return (
    <main className="w-full">
      <NewsPageClient />
    </main>
  );
}
