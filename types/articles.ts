export type ArticleFrontmatter = {
  title: string;
  date: string; // ISO string
};

export type ArticleMeta = {
  slug: string;
  title: string;
  dateISO: string;
  dateDisplay: string;
  excerpt: string;
};
