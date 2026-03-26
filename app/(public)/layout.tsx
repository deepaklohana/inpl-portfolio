import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/animations/PageTransition';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col grow w-full">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
