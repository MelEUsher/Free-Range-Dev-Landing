import Footer from '@/app/components/Footer';
import Hero from '@/app/components/Hero';
import SupportModalRoot from '@/app/components/SupportModalRoot';

export default function Home() {
  return (
    <>
      <main
        id="main"
        aria-label="Main content"
        className="min-h-screen bg-[#f9f8f3] pb-24 sm:pb-28 lg:pb-36"
      >
        <Hero />
      </main>
      <Footer />
      <SupportModalRoot />
    </>
  );
}
