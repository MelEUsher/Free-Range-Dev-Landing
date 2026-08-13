import type { Metadata } from 'next';

import { getAllArticles } from '@/lib/articles';
import { featuredPerCategory } from '@/lib/categories';

import ArticleCard from './ArticleCard';

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
  const featured = featuredPerCategory(articles);

  if (featured.length === 0) {
    return (
      <div className="articles-empty">
        <span className="home-kicker">Articles</span>
        <h1>Nothing published yet</h1>
        <p>New writing is on the way — check back soon.</p>
      </div>
    );
  }

  return (
    <section
      className="articles-view articles-featured-view"
      aria-labelledby="articles-featured-heading"
    >
      <header className="articles-view-head">
        <span className="home-kicker">Articles</span>
        <h1 id="articles-featured-heading" className="articles-view-title">
          Featured Articles
        </h1>
      </header>

      <div className="articles-grid">
        {featured.map(({ category, article }) => (
          <ArticleCard
            key={article.slug}
            article={article}
            variant="featured"
            categoryLabel={category.label}
          />
        ))}
      </div>
    </section>
  );
}
