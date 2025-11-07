import Hero from "@/app/components/Hero";
import SupportModal from "@/app/components/SupportModal";

export default function Home() {
  return (
    <>
      <main id="main" aria-label="Main content" className="min-h-screen bg-[#f9f8f3]">
        <Hero />
      </main>
      <SupportModal />
    </>
  );
}
