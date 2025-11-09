import Footer from "@/app/components/Footer";
import SupportModalRoot from "@/app/components/SupportModalRoot";
import type { MarkdownPost } from "@/lib/posts";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

export const runtime = "nodejs";
export const dynamicParams = false;

type BlogPageParams = {
  slug: string;
};

type BlogPageProps = {
  params: Promise<BlogPageParams> | BlogPageParams;
};

const mergeClassNames = (base: string, extra?: string) =>
  extra ? `${base} ${extra}` : base;

const markdownComponents: Components = {
  h1: ({ node, className, ...props }) => {
    void node;
    return (
      <h1
        {...props}
        className={mergeClassNames(
          "font-hand text-[2.5rem] sm:text-[3rem] leading-[1.1] text-[#333333] text-balance",
          className
        )}
      />
    );
  },
  h2: ({ node, className, ...props }) => {
    void node;
    return (
      <h2
        {...props}
        className={mergeClassNames(
          "font-display text-[1.6rem] sm:text-[1.9rem] font-bold text-[#58786a] mt-8 mb-4 text-balance",
          className
        )}
      />
    );
  },
  h3: ({ node, className, ...props }) => {
    void node;
    return (
      <h3
        {...props}
        className={mergeClassNames(
          "font-alans text-[1.3rem] sm:text-[1.4rem] text-[#876a5a] mt-6 mb-3 text-pretty",
          className
        )}
      />
    );
  },
  p: ({ node, className, ...props }) => {
    void node;
    return (
      <p
        {...props}
        className={mergeClassNames(
          "font-sans text-base sm:text-lg leading-relaxed text-[#333333] text-pretty",
          className
        )}
      />
    );
  },
  a: ({ node, className, href, ...props }) => {
    void node;
    const isExternal = typeof href === "string" && href.startsWith("http");
    return (
      <a
        {...props}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={mergeClassNames(
          "font-semibold text-[#58786a] underline decoration-[#a8bdb0] underline-offset-4 transition duration-150 ease-out hover:text-[#1f2d3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffbd59] focus-visible:outline-offset-2",
          className
        )}
      />
    );
  },
  ul: ({ node, className, ...props }) => {
    void node;
    return (
      <ul
        {...props}
        className={mergeClassNames(
          "ml-6 list-disc space-y-2 text-pretty text-[#333333]",
          className
        )}
      />
    );
  },
  ol: ({ node, className, ...props }) => {
    void node;
    return (
      <ol
        {...props}
        className={mergeClassNames(
          "ml-6 list-decimal space-y-2 text-pretty text-[#333333]",
          className
        )}
      />
    );
  },
  li: ({ node, className, ...props }) => {
    void node;
    return (
      <li
        {...props}
        className={mergeClassNames("pl-1 text-base sm:text-lg", className)}
      />
    );
  },
  blockquote: ({ node, className, ...props }) => {
    void node;
    return (
      <blockquote
        {...props}
        className={mergeClassNames(
          "border-l-4 border-[#a8bdb0] bg-white/70 px-6 py-4 font-display text-lg text-[#58786a] italic text-pretty",
          className
        )}
      />
    );
  },
  code: ({ inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code
          {...props}
          className={mergeClassNames(
            "rounded-md bg-[#f1eee4] px-2 py-0.5 text-sm text-[#5a463a]",
            className
          )}
        >
          {children}
        </code>
      );
    }

    return (
      <pre
        {...props}
        className={mergeClassNames(
          "overflow-x-auto rounded-xl bg-[#1f2d3d] px-5 py-4 text-sm text-[#f9f8f3]",
          className
        )}
      >
        <code className="font-mono">{children}</code>
      </pre>
    );
  },
  img: ({ node, className, alt, ...props }) => {
    void node;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={alt ?? ""}
        loading="lazy"
        className={mergeClassNames(
          "mx-auto my-6 w-full max-w-[640px] rounded-2xl border border-[#d7d1c4] bg-white object-contain p-3 shadow-[0_15px_45px_rgba(79,67,55,0.12)]",
          className
        )}
      />
    );
  },
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPageParams> | BlogPageParams;
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const description = post.frontmatter.description ?? deriveDescription(post);

  return {
    title: `${post.frontmatter.title} | The Free Range Dev`,
    description,
    openGraph: {
      title: post.frontmatter.title,
      description,
      url: `https://thefreerangedev.com/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description,
    },
  };
}

const deriveDescription = (post: MarkdownPost) => {
  const plainText = post.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#>*_~\-]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.slice(0, 156);
};

export default async function BlogPostPage({
  params,
}: BlogPageProps): Promise<JSX.Element> {
  const resolvedParams = await Promise.resolve(params);
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const description = post.frontmatter.description ?? deriveDescription(post);

  return (
    <>
      <main
        id="main"
        aria-label="Blog post content"
        className="relative min-h-screen bg-[#f9f8f3] pb-24 sm:pb-28 lg:pb-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-[#f9f8f3]" />
          <div
            className="brand-bg-desktop absolute inset-0 hidden opacity-85 sm:block"
          />
          <div
            className="brand-bg-mobile absolute inset-0 bg-[#f9f8f3]/90 sm:hidden"
          />
        </div>

        <section className="mx-auto flex w-full max-w-[760px] flex-col items-center px-5 pt-12 pb-7 text-center text-[#333333]">
          <p className="font-display text-[1.1rem] uppercase tracking-[0.2em] text-[#a8bdb0] text-balance">
            The Free Range Dev
          </p>
          <h1 className="mt-3 font-hand text-[3rem] leading-[1.1] text-[#333333] text-balance sm:text-[3.5rem]">
            {post.frontmatter.title}
          </h1>
          {description && (
            <p className="mt-3 max-w-[620px] font-alans text-[1.1rem] text-[#876a5a] text-pretty">
              {description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wide text-[#876a5a]">
            {post.frontmatter.publishedAt && (
              <time
                dateTime={post.frontmatter.publishedAt}
                className="rounded-full border border-[#d7d1c4] bg-white/70 px-4 py-2"
              >
                {new Date(post.frontmatter.publishedAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </time>
            )}
            {post.frontmatter.updatedAt && (
              <time
                dateTime={post.frontmatter.updatedAt}
                className="rounded-full border border-[#d7d1c4] bg-white/70 px-4 py-2"
              >
                Updated{" "}
                {new Date(post.frontmatter.updatedAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </time>
            )}
          </div>
        </section>

        <article
          aria-label="Markdown post body"
          className="mx-auto mt-4 w-full max-w-[760px] px-5"
        >
          <div className="rounded-[32px] border border-[#d7d1c4] bg-white/85 px-6 py-8 text-left shadow-[0_25px_85px_rgba(79,67,55,0.08)] backdrop-blur-sm sm:px-10 sm:py-12">
            <ReactMarkdown components={markdownComponents}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
      <SupportModalRoot />
    </>
  );
}
