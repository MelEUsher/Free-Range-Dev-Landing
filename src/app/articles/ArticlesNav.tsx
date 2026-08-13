'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Category } from '@/lib/categories';

import type { ArticleMeta } from '../../../types/articles';

type ArticlesNavProps = {
  categories: Category[];
  articles: ArticleMeta[];
};

export default function ArticlesNav({ categories, articles }: ArticlesNavProps) {
  const pathname = usePathname();
  const activeCategoryKey = resolveActiveCategory(pathname, articles);
  const isFeatured = pathname === '/articles';

  return (
    <aside className="articles-nav" aria-label="Article categories">
      <span className="home-kicker articles-nav-kicker">Articles</span>
      <nav className="articles-nav-list">
        <Link
          href="/articles"
          className={isFeatured ? 'articles-nav-item is-active' : 'articles-nav-item'}
          aria-current={isFeatured ? 'page' : undefined}
        >
          Featured Articles
        </Link>

        {categories.map((category) => {
          const href = `/articles/topics/${category.key}`;
          const isActive = activeCategoryKey === category.key;

          return (
            <Link
              key={category.key}
              href={href}
              className={
                isActive ? 'articles-nav-item is-active' : 'articles-nav-item'
              }
              aria-current={isActive ? 'page' : undefined}
            >
              {category.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function resolveActiveCategory(
  pathname: string,
  articles: ArticleMeta[]
): string | null {
  const topicsMatch = pathname.match(/^\/articles\/topics\/([^/]+)$/);
  if (topicsMatch) {
    return decodeURIComponent(topicsMatch[1]);
  }

  const slugMatch = pathname.match(/^\/articles\/([^/]+)$/);
  if (slugMatch && slugMatch[1] !== 'topics') {
    const slug = decodeURIComponent(slugMatch[1]);
    const article = articles.find((item) => item.slug === slug);
    return article ? article.categoryKey : null;
  }

  return null;
}
