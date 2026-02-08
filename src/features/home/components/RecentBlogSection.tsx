"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import Wrapper from "@/src/components/shared/wrapper";
import SheardButton from "@/src/components/shared/SheardButton";

interface BlogPost {
  id: string;
  category: string;
  date: string;
  title: string;
  image: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    category: "LAW OFFICE",
    date: "March 13, 2023",
    title: "The best ways to protect your family and business in 2023",
    image: "/images/404.webp",
    link: "/blog/protect-family-business",
  },
  {
    id: "2",
    category: "LAW OFFICE",
    date: "March 13, 2023",
    title: "4 officers charged in a pursuit crash that paralyzed a teen",
    image: "/images/bg-2.jpg",
    link: "/blog/officers-charged-pursuit",
  },
  {
    id: "3",
    category: "LAW OFFICE",
    date: "March 13, 2023",
    title: "Ten myths about lawyers and criminal defence attorneys",
    image: "/images/bg1.jpg",
    link: "/blog/myths-lawyers-attorneys",
  },
];

function RecentBlogSection() {
  const router = useRouter();
  return (
    <section className="bg-black text-white pb-2 md:pb-6 lg:pb-12">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-4 pl-0.5">
            <div className="h-px w-12 bg-orange-500" />
            <span className="text-xs font-semibold tracking-[0.2em] text-gray-300 uppercase">
              Recent News
            </span>
          </div>
          <h2 className="text-4xl md:text-3xl lg:text-5xl font-bold">
            From our blog
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {blogPosts.map((post) => (
            <Link key={post.id} href={post.link} className="group block">
              <div className="border-t-2 border-transparent transition-all duration-300 group-hover:border-[#ff9D4D]">
                <Card className="bg-zinc-900 border-0 rounded-none overflow-hidden h-full">
                  <CardContent className="p-0 space-y-5">
                    <div className="space-y-4 px-8">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-semibold text-white uppercase text-xs tracking-wide">
                          {post.category}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-md line-clamp-3 md:text-md md:line-clamp-3 lg:text-2xl lg:line-clamp-2 font-bold leading-tight text-white">
                        {post.title}
                      </h3>
                    </div>
                    <div className="relative aspect-4/3 overflow-hidden rounded-none">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="px-7">
                      <div className="flex items-center">
                        <span className="text-md font-light whitespace-nowrap text-white overflow-hidden transition-all duration-500 ease-out max-w-0 group-hover:max-w-28">
                          Read more
                        </span>
                        <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                          <ArrowRight
                            className="w-5 h-5 text-white mt-1"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <SheardButton
            onClick={() => router.push("/about-us")}
            className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7"
          >
            more news
          </SheardButton>
        </div>
      </Wrapper>
    </section>
  );
}

export default RecentBlogSection;
