'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ArticleMeta } from '../../../types/articles';

type ArticlesRailProps = {
  articles: ArticleMeta[];
};

export default function ArticlesRail({ articles }: ArticlesRailProps) {
  const pathname = usePathname();

  return (
    <aside className="articles-rail" aria-label="All articles">
      <span className="home-kicker articles-rail-kicker">Articles</span>
      <nav className="articles-rail-nav">
        {articles.map((article) => {
          const href = `/articles/${article.slug}`;
          const isActive = pathname === href;

          return (
            <Link
              key={article.slug}
              href={href}
              className={
                isActive
                  ? 'articles-rail-item is-active'
                  : 'articles-rail-item'
              }
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="articles-rail-date">{article.dateDisplay}</span>
              <span className="articles-rail-title">{article.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
