export type ArticleFrontmatter = {
  title: string;
  date: string; // ISO string
  category?: string; // registry key, validated in the loader
};

export type ArticleMeta = {
  slug: string;
  title: string;
  dateISO: string;
  dateDisplay: string;
  excerpt: string; // mechanical body excerpt; card blurb fallback
  description?: string; // hand-authored marketing + SEO copy, shown on the card when present
  categoryKey: string; // normalized registry key, or UNCATEGORIZED_KEY
};
