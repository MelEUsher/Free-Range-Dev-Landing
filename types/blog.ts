export type PostFrontmatter = {
  title: string;
  date: string; // ISO string
};

export type PostMeta = {
  slug: string;
  title: string;
  dateISO: string;
  dateDisplay: string;
  excerpt: string;
};
