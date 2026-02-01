import React from "react";
import Wrapper from "@/src/components/shared/wrapper";

const blogPosts = [
  {
    id: "1",
    title: "Understanding Your Legal Rights",
    excerpt: "Learn about the fundamentals of personal legal rights and how we can help protect them.",
    date: "January 15, 2026",
    category: "Legal",
  },
  {
    id: "2",
    title: "Divorce: What You Need to Know",
    excerpt: "A comprehensive guide to divorce proceedings and how to navigate them successfully.",
    date: "January 10, 2026",
    category: "Family Law",
  },
  {
    id: "3",
    title: "Business Contract Essentials",
    excerpt: "Everything you need to know about creating and maintaining business contracts.",
    date: "January 5, 2026",
    category: "Business",
  },
  {
    id: "4",
    title: "Estate Planning 101",
    excerpt: "A beginner's guide to estate planning and protecting your family's future.",
    date: "December 28, 2025",
    category: "Estate Planning",
  },
  {
    id: "5",
    title: "Personal Injury Claims",
    excerpt: "How to pursue compensation for personal injury and accidents.",
    date: "December 20, 2025",
    category: "Personal Injury",
  },
  {
    id: "6",
    title: "Employment Law Updates",
    excerpt: "Recent changes in employment law and what they mean for you.",
    date: "December 15, 2025",
    category: "Employment",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                Blog
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Latest insights and updates
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-neutral-300">
              Stay informed with our latest articles on legal matters, case results, and industry news.
            </p>
          </div>
        </Wrapper>
      </section>

      {/* Blog Grid */}
      <section className="py-20 pb-40">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900 cursor-pointer"
              >
                <div className="relative h-48 bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center overflow-hidden">
                  <span className="text-white text-sm font-semibold opacity-60">
                    Featured Article
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-yellow-500">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-400">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors duration-300 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-400 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <a
                    href={`#${post.id}`}
                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Wrapper>
      </section>
    </main>
  );
}
