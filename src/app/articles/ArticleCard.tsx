import Link from 'next/link';

import type { ArticleMeta } from '../../../types/articles';

type ArticleCardVariant = 'lead' | 'row';

type ArticleCardProps = {
  article: ArticleMeta;
  variant: ArticleCardVariant;
  categoryLabel?: string;
};

export default function ArticleCard({
  article,
  variant,
  categoryLabel,
}: ArticleCardProps) {
  const href = `/articles/${article.slug}`;
  const blurb = article.description ?? article.excerpt;

  return (
    <Link
      href={href}
      className={`articles-card articles-card-${variant}`}
      aria-label={article.title}
    >
      {categoryLabel ? (
        <span className="articles-card-chip">{categoryLabel}</span>
      ) : null}
      <span className="articles-card-date">{article.dateDisplay}</span>
      <h2 className="articles-card-title">{article.title}</h2>
      <p className="articles-card-blurb">{blurb}</p>
      <span className="articles-card-cta">
        Read{' '}
        <span className="home-arrow" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}
