import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleFrontmatter, ArticleMeta } from "../../types/articles";

const ARTICLES_DIRECTORY = path.join(process.cwd(), "content", "articles");
const ALLOWED_EXTENSIONS = new Set([".md", ".mdx"]);

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function toExcerpt(markdownBody: string, max = 160) {
  const text = markdownBody
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

const ARTICLE_FILE_EXTENSIONS = [".mdx", ".md"];

export type MarkdownFrontmatter = ArticleFrontmatter & {
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type MarkdownArticle = {
  slug: string;
  content: string;
  frontmatter: MarkdownFrontmatter;
};

function isMarkdownFile(fileName: string) {
  return ALLOWED_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function isValidFrontmatter(
  frontmatter: Partial<ArticleFrontmatter>
): frontmatter is ArticleFrontmatter {
  return Boolean(frontmatter?.title && frontmatter?.date);
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) {
    return [];
  }

  const entries = fs.readdirSync(ARTICLES_DIRECTORY, { withFileTypes: true });

  const articles = entries.reduce<ArticleMeta[]>((acc, entry) => {
    if (!entry.isFile() || !isMarkdownFile(entry.name)) {
      return acc;
    }

    const fullPath = path.join(ARTICLES_DIRECTORY, entry.name);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as Partial<ArticleFrontmatter>;

    if (!isValidFrontmatter(frontmatter)) {
      return acc;
    }

    const parsedDate = new Date(frontmatter.date);

    if (Number.isNaN(parsedDate.getTime())) {
      return acc;
    }

    const dateISO = parsedDate.toISOString();

    acc.push({
      slug: path.basename(entry.name, path.extname(entry.name)),
      title: frontmatter.title,
      dateISO,
      dateDisplay: formatDate(dateISO),
      excerpt: toExcerpt(content),
    });

    return acc;
  }, []);

  return articles.sort(
    (a, b) =>
      new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );
}

function resolveArticlePath(slug: string) {
  const normalized = slug.replace(/\.mdx?$/, "");

  for (const ext of ARTICLE_FILE_EXTENSIONS) {
    const candidate = path.join(ARTICLES_DIRECTORY, `${normalized}${ext}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export async function loadArticles(): Promise<MarkdownArticle[]> {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) {
    return [];
  }

  const entries = await fsPromises.readdir(ARTICLES_DIRECTORY, {
    withFileTypes: true,
  });

  const articles: MarkdownArticle[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !isMarkdownFile(entry.name)) {
      continue;
    }

    const fullPath = path.join(ARTICLES_DIRECTORY, entry.name);
    const fileContent = await fsPromises.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as Partial<MarkdownFrontmatter>;

    if (!isValidFrontmatter(frontmatter)) {
      continue;
    }

    articles.push({
      slug: path.basename(entry.name, path.extname(entry.name)),
      content,
      frontmatter: frontmatter as MarkdownFrontmatter,
    });
  }

  return articles;
}

export async function loadArticleBySlug(
  slug: string
): Promise<MarkdownArticle | null> {
  const fullPath = resolveArticlePath(slug);

  if (!fullPath) {
    return null;
  }

  const fileContent = await fsPromises.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as Partial<MarkdownFrontmatter>;

  if (!isValidFrontmatter(frontmatter)) {
    return null;
  }

  return {
    slug: path.basename(fullPath, path.extname(fullPath)),
    content,
    frontmatter: frontmatter as MarkdownFrontmatter,
  };
}
