"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import SheardButton from "@/src/components/shared/SheardButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The best ways to protect your family and business in 2023",
    date: "March 13, 2023",
    category: "LAW OFFICE",
    image: "/images/videoImage/videoImage.jpg",
    slug: "protect-family-business",
  },
  {
    id: "2",
    title: "4 officers charged in a pursuit crash that paralyzed a teen",
    date: "March 13, 2023",
    category: "LAW OFFICE",
    image: "/images/videoImage/videoImage.jpg",
    slug: "officers-crash-lawsuit",
  },
  {
    id: "3",
    title: "Ten myths about lawyers and criminal defence attorneys",
    date: "March 13, 2023",
    category: "LAW OFFICE",
    image: "/images/videoImage/videoImage.jpg",
    slug: "myths-criminal-lawyers",
  },
];

export default function RecentBlogSection() {
  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="lg:max-w-sm">
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

          <div className="w-full lg:flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="h-full flex flex-col bg-black hover:opacity-90 transition-opacity duration-300">
                    {/* Image Section */}
                    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-yellow-600 to-orange-700">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 py-6 px-0">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                          {post.category}
                        </span>
                        <span className="text-xs text-neutral-400 whitespace-nowrap">
                          {post.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors duration-300 mb-4 line-clamp-3">
                        {post.title}
                      </h3>
                      <div className="flex justify-start">
                        <ArrowRight className="w-6 h-6 text-yellow-500 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
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
