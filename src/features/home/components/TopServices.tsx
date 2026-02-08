import Wrapper from "@/src/components/shared/wrapper";
import LegalServicesGrid from "@/src/features/home/components/LegalServicesGrid";

export default function TopServices() {
  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="mx-auto w-full">
          <div className="mb-1">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider text-zinc-300 uppercase">
                Top Services
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl text-zinc-300 font-bold leading-tight">
                Our job is to provide the best legal help
                <span className="text-zinc-200">.</span>
              </h2>
            </div>
            <div className="space-y-8 text-gray-400">
              <p className="text-base md:text-lg leading-relaxed">
                Adipiscing elit, sed do euismod tempor incidunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                Adipiscing elit, sed do euismod tempor incidunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <LegalServicesGrid />
        </div>
      </Wrapper>
    </section>
  );
}
