import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAllArticles } from '@/lib/articles';
import {
  articlesInCategory,
  categoryLabel,
  renderedCategories,
} from '@/lib/categories';

import ArticleCard from '../../ArticleCard';

export const dynamic = 'force-static';
export const dynamicParams = false;

type TopicPageParams = {
  key: string;
};

type TopicPageProps = {
  params: Promise<TopicPageParams>;
};

export function generateStaticParams() {
  // Only categories that currently have at least one article are prerendered.
  // A registered-but-empty category (Sales & Persuasion at launch) is not
  // rendered and returns 404 until its first article publishes, at which point
  // a rebuild picks it up automatically with no code change.
  const articles = getAllArticles();
  return renderedCategories(articles).map((category) => ({ key: category.key }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { key } = await params;
  const label = categoryLabel(key);
  const title = `${label} | The Free Range Dev`;
  const description = `Articles on ${label} from The Free Range Dev.`;
  const url = `https://thefreerangedev.com/articles/topics/${key}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { key } = await params;
  const articles = getAllArticles();
  const category = renderedCategories(articles).find(
    (entry) => entry.key === key
  );

  if (!category) {
    notFound();
  }

  const items = articlesInCategory(articles, key);
  const [lead, ...rest] = items;

  if (!lead) {
    notFound();
  }

  return (
    <section
      className="articles-view articles-category-view"
      aria-labelledby="articles-category-heading"
    >
      <header className="articles-view-head">
        <span className="home-kicker">Articles</span>
        <h1 id="articles-category-heading" className="articles-view-title">
          {category.label}
        </h1>
      </header>

      <div className="articles-list">
        <ArticleCard article={lead} variant="lead" />
        {rest.length > 0 ? (
          <div className="articles-list-rest">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="row" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
