import { Button } from "@/src/components/ui/button";
import { SpinningText } from "@/src/components/ui/spinning-text";

export default function LegalAdvisoryHero() {
  return (
    <section className="relative flex flex-col lg:flex-row">
      <div className="relative w-full lg:w-1/2 lg:min-h-[80vh]">
        <img
          src={"/images/bg1.jpg"}
          alt="Legal professionals collaborating"
          className="w-full h-full object-cover mb-14 lg:mb-0"
        />
        <div className="px-5.5  md:px-12 lg:px-0 lg:absolute lg:top-14 lg:-right-150 max-w-2xl z-20">
          <div className="space-y-3">
            <div className="text-xs md:text-sm font-semibold flex items-center gap-5 tracking-widest uppercase text-neutral-400">
              <div className="w-14 h-0.5 bg-yellow-600" />
              WHAT WE DO
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight text-white">
              Legal advisory is our expertise
            </h1>
          </div>
        </div>
        <div className="absolute right-40 lg:right-0 z-30 hidden lg:block">
          <SpinningText className="text-md" radius={7}>
            learn more • earn more • grow more •
          </SpinningText>
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      <div className="lg:relative inset-0 lg:inset-auto lg:w-1/2 flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-32 py-12">
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
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-6 text-sm md:text-base tracking-wider uppercase transition-all duration-300"
              >
                THE PRACTICE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
