import type { ReactNode } from 'react';

import { HomeFooter, HomeNav } from '@/app/components/HomeChrome';
import SupportModalRoot from '@/app/components/SupportModalRoot';
import { getAllArticles } from '@/lib/articles';
import { renderedCategories } from '@/lib/categories';

import ArticlesNav from './ArticlesNav';

export default function ArticlesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const articles = getAllArticles();
  const categories = renderedCategories(articles);

  return (
    <>
      <main className="home-redesign articles-page">
        <HomeNav />

        <div className="home-wrap articles-shell">
          <ArticlesNav categories={categories} articles={articles} />
          <div className="articles-center">{children}</div>
        </div>

        <HomeFooter />
      </main>
      <SupportModalRoot />
    </>
  );
}
