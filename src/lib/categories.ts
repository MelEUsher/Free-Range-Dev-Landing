import type { ArticleMeta } from "../../types/articles";

export const UNCATEGORIZED_KEY = "uncategorized";

export type Category = {
  key: string;
  label: string;
  order: number;
};

/**
 * The category registry is the single source of truth for taxonomy: it controls
 * each category's display label and nav order (independent of publish dates) and
 * lets a category exist before it has any articles. Adding a category later is a
 * single reviewed line here plus tagging the relevant articles.
 *
 * `uncategorized` is intentionally NOT registered: a mis-tagged or untagged
 * article stays reachable at its own /articles/[slug] URL but never surfaces in
 * the Featured view or any category list until the tag is fixed.
 */
export const CATEGORIES: Category[] = [
  { key: "automation-tech", label: "Automation & Tech", order: 1 },
  { key: "sales-persuasion", label: "Sales & Persuasion", order: 2 },
];

const CATEGORY_BY_KEY = new Map(
  CATEGORIES.map((category) => [category.key, category])
);

/** All registered categories, sorted by their configured order. */
export function orderedCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

/** Normalize a raw frontmatter value to a known registry key, else UNCATEGORIZED_KEY. */
export function resolveCategoryKey(raw?: string): string {
  if (!raw) {
    return UNCATEGORIZED_KEY;
  }
  const normalized = raw.trim().toLowerCase();
  return CATEGORY_BY_KEY.has(normalized) ? normalized : UNCATEGORIZED_KEY;
}

/** Human-readable label for a key, with a safe fallback for unregistered keys. */
export function categoryLabel(key: string): string {
  return CATEGORY_BY_KEY.get(key)?.label ?? "Uncategorized";
}

/**
 * Registered categories that currently have at least one article, in nav order.
 * This is the "rendered" set: a registered-but-empty category (Sales &
 * Persuasion at launch) is hidden from the nav and the Featured view until its
 * first article publishes, at which point it appears automatically.
 */
export function renderedCategories(articles: ArticleMeta[]): Category[] {
  const populated = new Set(articles.map((article) => article.categoryKey));
  return orderedCategories().filter((category) => populated.has(category.key));
}

/** Articles in one category key, preserving the incoming (date-desc) order. */
export function articlesInCategory(
  articles: ArticleMeta[],
  key: string
): ArticleMeta[] {
  return articles.filter((article) => article.categoryKey === key);
}

/**
 * The Featured model: for each rendered category (nav order), its most-recent
 * article. Articles arrive date-desc, so the first match per category is newest.
 */
export function featuredPerCategory(
  articles: ArticleMeta[]
): { category: Category; article: ArticleMeta }[] {
  return renderedCategories(articles)
    .map((category) => ({
      category,
      article: articles.find((article) => article.categoryKey === category.key),
    }))
    .filter(
      (entry): entry is { category: Category; article: ArticleMeta } =>
        entry.article !== undefined
    );
}
