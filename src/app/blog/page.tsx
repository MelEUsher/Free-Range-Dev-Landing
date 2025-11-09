import Link from "next/link";

import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import SupportModalRoot from "@/app/components/SupportModalRoot";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "../../../types/blog";

export const dynamic = "force-static";

const cardFocusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8bdb0] focus-visible:ring-offset-2";

const gradientButtonClasses =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[linear-gradient(180deg,_#a8bdb0_0%,_#95a89d_100%)] px-5 py-3 text-base font-semibold text-[#1f2d3d] shadow-[0_6px_16px_rgba(168,189,176,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(168,189,176,0.22)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_12px_30px_rgba(168,189,176,0.22)] active:translate-y-0 active:shadow-[0_6px_16px_rgba(168,189,176,0.14)]";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <main
        id="main"
        aria-label="Blog index"
        className="min-h-screen bg-[#f9f8f3] pb-24 text-[#333333] sm:pb-28 lg:pb-36"
      >
        <Hero />
        <section
          aria-label="Latest blog posts"
          className="relative mx-auto mt-10 w-full max-w-6xl px-5 sm:px-6 lg:px-8"
        >
          <div className="relative isolate overflow-hidden rounded-[32px] border border-[#e4dfd5] bg-white/80 px-5 py-10 shadow-[0_30px_80px_rgba(32,32,32,0.08)] sm:px-10 sm:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-30"
            >
              <div className="absolute inset-0 bg-[url('/assets/Image%20saved%20for%20website%20use.svg')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-[#f9f8f3]/80"></div>
            </div>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-display text-lg uppercase tracking-[0.2em] text-[#8a6f5a]">
                Notes from the road
              </p>
              <h2 className="mt-3 font-hand text-4xl leading-tight text-[#333333] text-balance">
                Fresh drops from The Free Range Dev
              </h2>
              <p className="mt-4 font-alans text-lg text-[#5c4c3f] text-pretty">
                Field-tested learnings, shipped weekly.
              </p>
            </div>
            {posts.length === 0 ? (
              <div className="mt-10 flex min-h-[260px] items-center justify-center rounded-[28px] border border-[#e9e4d9] bg-white/90 px-6 py-16 text-center shadow-inner">
                <p className="font-alans text-xl text-[#6d5a49]">
                  No posts yet — check back soon.
                </p>
              </div>
            ) : (
              <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <SupportModalRoot />
    </>
  );
}

const BlogCard = ({ post }: { post: PostMeta }) => {
  const href = `/blog/${post.slug}`;

  return (
    <article className="flex min-h-full flex-col justify-between rounded-[28px] border border-[#e9e4d9] bg-white/90 px-5 py-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition will-change-transform hover:-translate-y-1">
      <div>
        <p className="font-alans text-sm uppercase tracking-[0.2em] text-[#8f745f]">
          {post.dateDisplay}
        </p>
        <Link
          href={href}
          aria-label={`Read more: ${post.title}`}
          className={`mt-2 inline-flex min-h-[44px] items-center text-left font-display text-[1.35rem] leading-tight text-[#333333] text-balance transition hover:text-[#58786a] ${cardFocusClasses}`}
        >
          {post.title}
        </Link>
        <p className="mt-3 text-base leading-relaxed text-[#4c4b47] text-pretty">
          {post.excerpt}
        </p>
      </div>
      <div className="mt-6">
        <Link
          href={href}
          aria-label={`Read more: ${post.title}`}
          className={`${gradientButtonClasses} ${cardFocusClasses}`}
        >
          Read More →
        </Link>
      </div>
    </article>
  );
};
