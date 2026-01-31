"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import SheardButton from "@/src/components/shared/SheardButton";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Your Legal Rights",
    excerpt: "Learn about the fundamentals of personal legal rights and how we can help protect them.",
    date: "January 15, 2026",
    category: "Legal",
    image: "/images/blog-1.jpg",
    slug: "understanding-legal-rights",
  },
  {
    id: "2",
    title: "Divorce: What You Need to Know",
    excerpt: "A comprehensive guide to divorce proceedings and how to navigate them successfully.",
    date: "January 10, 2026",
    category: "Family Law",
    image: "/images/blog-2.jpg",
    slug: "divorce-guide",
  },
  {
    id: "3",
    title: "Business Contract Essentials",
    excerpt: "Everything you need to know about creating and maintaining business contracts.",
    date: "January 5, 2026",
    category: "Business",
    image: "/images/blog-3.jpg",
    slug: "business-contracts",
  },
];

export default function RecentBlogSection() {
  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          <div className="lg:max-w-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                Recent News
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
              From our blog
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-300 mb-8">
              Adipiscing elit, sed do euismod tempor incidunt ut labore et dolore magna aliqua.
            </p>
            <Link href="/blog">
              <SheardButton className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7">
                More News
              </SheardButton>
            </Link>
          </div>

          <div className="lg:col-span-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="h-full bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900">
                    <div className="relative h-40 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold opacity-60">
                          No image
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-yellow-500">
                          {post.category}
                        </span>
                        <span className="text-xs text-neutral-400">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors duration-300 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
