"use client";

import Image from "next/image";
import { SpinningText } from "@/src/components/ui/spinning-text";
import SheardButton from "@/src/components/shared/SheardButton";
import { useRouter } from "next/navigation";

export default function LegalAdvisoryHero() {
  const router = useRouter();
  return (
    <section className="relative flex flex-col md:flex-row mb-30">
      <div className="relative w-full h-80 md:h-auto md:w-1/2 xl:w-[62%]">
        <Image
          src="/images/bg1.jpg"
          alt="Legal professionals collaborating"
          fill
          className="object-cover mb-14 w-full h-full"
          priority
        />
        <div className="px-4 md:px-12 xl:px-0 xl:absolute xl:top-14 xl:-right-111 xl:max-w-xl z-20">
          <div className="space-y-3">
            <div className="text-xs md:text-sm font-semibold flex items-center gap-5 tracking-widest uppercase text-neutral-400">
              <div className="w-14 h-0.5 bg-yellow-600" />
              WHAT WE DO
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl lg:max-w-md xl:text-5xl xl:max-w-lg font-bold leading-tight text-zinc-200">
              Legal advisory is our expertise
            </h1>
          </div>
        </div>
        <div className="absolute right-25 md:right-0 z-30 hidden md:block bottom-0">
          <SpinningText className="text-md" radius={9}>
            learn more • earn more • grow more •
          </SpinningText>
        </div>
        <div className="absolute right-24 md:right-0 z-30 md:hidden bottom-0">
          <SpinningText className="text-xs" radius={8}>
            learn more • earn more • grow more •
          </SpinningText>
        </div>
      </div>
      <div className="lg:relative inset-0 lg:inset-auto md:w-[65%] lg:w-1/2 flex items-center">
        <div className="w-full px-4 md:px-12 xl:px-28 pt-10 sm:px-4 xl:py-60">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-5 text-neutral-400">
              <div className="lg:max-w-xl xl:max-w-2xl xl:hidden z-20">
                <div className="space-y-3">
                  <div className="text-xs md:text-sm font-semibold flex items-center gap-5 tracking-widest uppercase text-neutral-400">
                    <div className="w-14 h-0.5 bg-yellow-600" />
                    WHAT WE DO
                  </div>
                  <h1 className="text-3xl md:text-3xl lg:text-3xl sm:max-w-xl xl:text-5xl xl:max-w-lg font-bold leading-tight text-zinc-200">
                    Legal advisory is our expertise
                  </h1>
                </div>
              </div>
              <p className="text-sm md:text-base lg:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis
                parturient montes nascetur ridiculus mus.
              </p>
              <p className="text-sm md:text-base lg:text-lg leading-relaxed">
                Facilisi etiam dignissim diam quis. Eget nunc scelerisque
                viverra mauris in aliquam sem. Sit amet nisl suscipit.
              </p>
            </div>
            <div className="pt-6">
              <SheardButton
                onClick={() => router.push("/practice-areas")}
                className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7"
              >
                THE PRACTICE
              </SheardButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
