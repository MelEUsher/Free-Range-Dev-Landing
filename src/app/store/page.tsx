import type { Metadata } from 'next';
import { HomeFooter, HomeNav } from '@/app/components/HomeChrome';
import SupportModalRoot from '@/app/components/SupportModalRoot';

export const metadata: Metadata = {
  title: 'Tools + Gear | The Free Range Dev',
  description:
    'Free Range Dev resources, gear, and tools for building a more sustainable way to work.',
};

export default function StorePage() {
  return (
    <>
      <main className="home-redesign">
        <HomeNav />

        <header className="home-hero">
          <div className="home-wrap home-hero-inner">
            <h1>
              Gear <em>Coming Soon</em>
            </h1>
          </div>
          <div className="home-hero-fade" />
        </header>

        <HomeFooter />
      </main>
      <SupportModalRoot />
    </>
  );
}
