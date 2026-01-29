import { SpinningText } from "@/src/components/ui/spinning-text";
import SheardButton from "@/src/components/shared/SheardButton";

export default function LegalAdvisoryHero() {
  return (
    <section className="relative flex flex-col lg:flex-row mb-30">
      <div className="relative w-full lg:w-1/2 lg:min-h-[80vh]">
        <img
          src={"/images/bg1.jpg"}
          alt="Legal professionals collaborating"
          className="w-full h-full object-cover mb-14 lg:mb-0"
        />
        <div className="px-4  md:px-12 lg:px-0 lg:absolute lg:top-14 lg:-right-95 lg:max-w-xl xl:-right-111 xl:max-w-2xl z-20">
          <div className="space-y-3">
            <div className="text-xs md:text-sm font-semibold flex items-center gap-5 tracking-widest uppercase text-neutral-400">
              <div className="w-14 h-0.5 bg-yellow-600" />
              WHAT WE DO
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl lg:max-w-md xl:text-5xl xl:max-w-lg font-bold leading-tight text-white">
              Legal advisory is our expertise
            </h1>
          </div>
        </div>
        <div className="absolute right-40 lg:right-0 z-30 hidden lg:block">
          <SpinningText className="text-md" radius={9}>
            learn more • earn more • grow more •
          </SpinningText>
        </div>
      </div>
      <div className="lg:relative inset-0 lg:inset-auto lg:w-1/2 flex items-center">
        <div className="w-full px-4 md:px-12 lg:px-16 xl:px-24 py-10 lg:py-50 xl:py-60">
          <div className="max-w-md space-y-6">
            <div className="space-y-5 text-neutral-400">
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
              <SheardButton className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7">
                THE PRACTICE
              </SheardButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
