"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { getTitleFromPath } from "@/src/lib/utils";

interface LegalSafetyHeroSectionProps {
  professionalImageUrl?: string;
}

function SharedImage({
  professionalImageUrl = "/assets/about/aboutImage.jpg",
}: LegalSafetyHeroSectionProps) {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  return (
    <div className="relative w-full min-h-85 select-none">
      <Image
        src={professionalImageUrl}
        alt="shared background"
        fill
        priority
        unoptimized
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10">
          {title}
        </h1>
        <div>
          <h3 className="uppercase text-sm font-semibold">home / {title}</h3>
        </div>
      </div>
    </div>
  );
}

export default SharedImage;
