import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Partial<NodeJS.ErrnoException>).code === "string"
  );
};

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");
const POST_EXTENSIONS = [".md", ".mdx"];

export type PostFrontmatter = {
  title: string;
  description?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
};

export type MarkdownPost = {
  slug: string;
  content: string;
  frontmatter: PostFrontmatter;
};

export async function getPostSlugs(): Promise<string[]> {
  try {
    const dirEntries = await readdir(POSTS_DIRECTORY, { withFileTypes: true });

    return dirEntries
      .filter(
        (entry) =>
          entry.isFile() &&
          POST_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())
      )
      .map((entry) => entry.name.replace(path.extname(entry.name), ""));
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function getPostBySlug(
  slug: string
): Promise<MarkdownPost | null> {
  for (const extension of POST_EXTENSIONS) {
    const filePath = path.join(POSTS_DIRECTORY, `${slug}${extension}`);

    try {
      const file = await readFile(filePath, "utf8");
      const { content, data } = matter(file);

      if (typeof data.title !== "string" || data.title.trim() === "") {
        throw new Error(
          `Post "${slug}" is missing a required 'title' in its frontmatter.`
        );
      }

      const frontmatter: PostFrontmatter = {
        title: data.title.trim(),
        description:
          typeof data.description === "string" ? data.description.trim() : undefined,
        excerpt:
          typeof data.excerpt === "string" ? data.excerpt.trim() : undefined,
        publishedAt:
          typeof data.date === "string" ? data.date.trim() : undefined,
        updatedAt:
          typeof data.updated === "string" ? data.updated.trim() : undefined,
      };

      return { slug, content, frontmatter };
    } catch (error: unknown) {
      if (isErrnoException(error) && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  return null;
}
