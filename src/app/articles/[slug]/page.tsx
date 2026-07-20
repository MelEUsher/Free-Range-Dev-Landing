import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

import type { MarkdownArticle } from '@/lib/articles';
import { loadArticleBySlug, loadArticles } from '@/lib/articles';

export const runtime = 'nodejs';
export const dynamicParams = false;

const OG_IMAGE = '/assets/free-range-dev-logo-no-background.png';

type ArticlePageParams = {
  slug: string;
};

type ArticlePageProps = {
  params: Promise<ArticlePageParams>;
};

const markdownComponents: Components = {
  a: ({ node, href, ...props }) => {
    void node;
    const opensInNewTab = typeof href === 'string' && !href.startsWith('#');
    return (
      <a
        {...props}
        href={href}
        target={opensInNewTab ? '_blank' : undefined}
        rel={opensInNewTab ? 'noopener noreferrer' : undefined}
      />
    );
  },
};

const deriveDescription = (article: MarkdownArticle) => {
  const plainText = article.content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#>*_~\-]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.slice(0, 156);
};

export async function generateStaticParams() {
  const articles = await loadArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ArticlePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const description = article.frontmatter.description ?? deriveDescription(article);
  const url = `https://thefreerangedev.com/articles/${article.slug}`;

  return {
    title: `${article.frontmatter.title} | The Free Range Dev`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title: article.frontmatter.title,
      description,
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.frontmatter.title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const article = await loadArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const publishedAt = article.frontmatter.publishedAt;

  return (
    <article className="articles-single" aria-label="Article">
      <header className="articles-single-head">
        <span className="home-kicker">The Free Range Dev</span>
        <h1 className="articles-single-title">{article.frontmatter.title}</h1>
        {publishedAt && (
          <time className="articles-single-date" dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </header>

      <div className="articles-prose">
        <ReactMarkdown components={markdownComponents}>
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
