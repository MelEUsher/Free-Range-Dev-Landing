import type { ReactNode } from 'react';

import { HomeFooter, HomeNav } from '@/app/components/HomeChrome';
import SupportModalRoot from '@/app/components/SupportModalRoot';
import { getAllArticles } from '@/lib/articles';

import ArticlesRail from './ArticlesRail';

export default function ArticlesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const articles = getAllArticles();

  return (
    <>
      <main className="home-redesign articles-page">
        <HomeNav />

        <div className="home-wrap articles-shell">
          <ArticlesRail articles={articles} />
          <div className="articles-center">{children}</div>
        </div>

        <HomeFooter />
      </main>
      <SupportModalRoot />
    </>
  );
}
