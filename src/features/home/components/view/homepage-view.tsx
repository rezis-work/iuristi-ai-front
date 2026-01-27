import Wrapper from "@/src/components/shared/wrapper";
import HeroSection from "../HeroSection";
import LegalAdvisoryHero from "../LegalAdvisoryHero";

export function HomepageView() {
  return (
    <>
      <HeroSection />
      <div className="py-16">
        <LegalAdvisoryHero />
      </div>
      <Wrapper className="mx-auto">
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
