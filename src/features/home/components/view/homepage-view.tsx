import HeroSection from "@/src/features/home/components/HeroSection";
import TopServices from "@/src/features/home/components/TopServices";
import LegalAdvisoryHero from "@/src/features/home/components/LegalAdvisoryHero";
import Wrapper from "@/src/components/shared/wrapper";

export function HomepageView() {
  return (
    <>
      <HeroSection />
      <TopServices />
      <div className="py-10">
        <LegalAdvisoryHero />
      </div>
      <Wrapper className="mx-auto px-4">
        <div className="max-w-2xl mt-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
          nesciunt cum eaque, quas culpa porro dolor eligendi praesentium
          veritatis sit quisquam, dolores veniam, aperiam laboriosam beatae modi
          provident fugit animi? Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Vitae recusandae delectus laudantium impedit dolor
          expedita quo facilis quaerat maxime architecto. Similique suscipit
          recusandae tenetur ullam in porro, corporis officia architecto.
        </div>
        <div>
          <h2>homepage view</h2>
        </div>
      </Wrapper>
    </>
  );
}
