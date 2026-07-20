import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Articles | The Free Range Dev',
  description:
    'Essays and field notes on workflow automation, systems, and building a freer way to work.',
  openGraph: {
    title: 'Articles | The Free Range Dev',
    description:
      'Essays and field notes on workflow automation, systems, and building a freer way to work.',
    url: 'https://thefreerangedev.com/articles',
  },
};

export default function ArticlesIndexPage() {
  const articles = getAllArticles();
  const featured = articles[0];

  if (!featured) {
    return (
      <div className="articles-empty">
        <span className="home-kicker">Articles</span>
        <h1>Nothing published yet</h1>
        <p>New writing is on the way — check back soon.</p>
      </div>
    );
  }

  const href = `/articles/${featured.slug}`;

  return (
    <article className="articles-featured">
      <span className="home-kicker">Featured Article</span>
      <p className="articles-featured-date">{featured.dateDisplay}</p>
      <h1 className="articles-featured-title">{featured.title}</h1>
      <p className="articles-featured-excerpt">{featured.excerpt}</p>
      <Link className="home-btn home-btn-primary articles-featured-cta" href={href}>
        Read the article <span className="home-arrow">→</span>
      </Link>
    </article>
  );
}
