"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import { MoveLeft, MoveRight } from "lucide-react";
import Wrapper from "@/src/components/shared/wrapper";
import { NumberTicker } from "@/src/components/magic-ui/number-ticker";

interface Testimonial {
  id: number;
  name: string;
  image: string;
  title: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "ჯეისონ ბრაიტი",
    image: "/images/404.webp",
    title: "სამოქალაქო დავის კლიენტი",
    quote:
      "რთული სამართლებრივი დავა გვქონდა და მხოლოდ მათი დახმარებით მივიღეთ სამართლიანი გადაწყვეტა სასამართლოში. პროფესიონალური იურიდიული დახმარება ყველას ვურჩევ, ვისაც მოუსი აქვს.",
  },
  {
    id: 2,
    name: "სარა ჯონსონი",
    image: "/images/bg-2.jpg",
    title: "საოჯახო საქმის კლიენტი",
    quote:
      "ოჯახური საკითხის გარშემო მოუსი გვქონდა — გუნდმა დაგვეხმარა მოუსის მოგვარებაში და უფლებების დაცვაში. ვაფასებ მათ პროფესიონალიზმს და იურიდიულ მხარდაჭერას.",
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-black text-white">
      <Wrapper className="mx-auto px-4 md:px-6 lg:px-28">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8 items-start">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-gray-400 uppercase tracking-wider text-sm flex items-center gap-4">
                  <div className="h-px w-10 bg-yellow-500" />
                  მიმოხილვები
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  ისმინეთ, რას ამბობენ
                  <br />
                  ჩვენი კლიენტები
                </h2>
                <p className="text-gray-400 text-base lg:text-lg max-w-xl">
                  ისმინეთ მათ, ვინც ჩვენთან გააგრძელეს მოუსი და მიიღო სამართლიანი შედეგი სასამართლოში.
                </p>
              </div>
              <div className="bg-zinc-900 px-6 lg:px-10 pt-10 lg:pt-24 overflow-hidden relative">
                <div className="mb-8 flex items-center justify-center gap-20 top-17 lg:top-32 z-40 absolute left-1/2 -translate-x-1/2">
                  <button className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-gray-300 transition-colors">
                    <MoveLeft size={20} />
                  </button>

                  <div className="w-1 h-16 lg:w-16" />

                  <button className="swiper-button-next-custom w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-gray-300 transition-colors">
                    <MoveRight size={20} />
                  </button>
                </div>

                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={{
                    prevEl: ".swiper-button-prev-custom",
                    nextEl: ".swiper-button-next-custom",
                  }}
                  loop={true}
                  className="testimonials-swiper select-none"
                >
                  {testimonials.map((testimonial) => (
                    <SwiperSlide
                      key={testimonial.id}
                      className="flex items-center bg-zinc-900"
                    >
                      <div className="space-y-8 w-full cursor-pointer">
                        <div className="flex items-center justify-center">
                          <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-gray-800">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={128}
                              height={128}
                              priority
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className=" flex flex-col justify-center pb-10 lg:pb-20 lg:pt-4">
                          <p className="text-lg lg:text-xl text-white leading-relaxed text-center pb-5">
                            {testimonial.quote}
                          </p>
                          <div className="flex items-center justify-center gap-2 text-[#ff9D4D] pb-3">
                            <svg
                              className="w-7 h-7"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                          </div>

                          <p className="text-xl font-semibold text-center">
                            {testimonial.name}
                          </p>
                          <p className="text-center pb-0 lg:pb-7 text-zinc-400">
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="space-y-8">
              <div className="w-full h-130 md:h-100 lg:h-155 overflow-hidden">
                <Image
                  src="/assets/home/imageRight.jpg"
                  alt="ჩვენი გუნდი"
                  width={800}
                  height={600}
                  priority
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="border border-zinc-800 p-10 lg:p-16 space-y-4">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold pb-4">
                  ჩვენ ვთავაზობთ საუკეთესო
                  <br />
                  იურიდიულ მომსახურებას მოუსისთვის
                </h3>
                <div className="flex flex-wrap justify-between gap-10 lg:gap-20">
                  <div className="min-w-0 max-w-xs space-y-1">
                    <h4 className="font-semibold lg:text-xl">ადვოკატი</h4>
                    <div>
                      <NumberTicker
                        value={100}
                        className="text-3xl lg:text-5xl font-medium tracking-tighter whitespace-pre-wrap lg:-ml-1 text-white dark:text-white"
                      />
                    </div>
                    <p className="text-sm g:text-md text-gray-300 lg:wrap-break-word max-w-32 lg:max-w-51">
                      პროფესიონალი იურისტი თქვენი მოუსებისთვის
                    </p>
                  </div>
                  <div className="min-w-0 max-w-xs space-y-1">
                    <h4 className="font-semibold lg:text-xl">წელი</h4>
                    <div>
                      <NumberTicker
                        value={12}
                        className="text-3xl lg:text-5xl font-medium tracking-tighter whitespace-pre-wrap lg:-ml-1 text-white dark:text-white"
                      />
                    </div>
                    <p className="text-sm lg:text-md text-gray-300 lg:wrap-break-word max-w-32 lg:max-w-51">
                      წარმატებული საქმე სასამართლოში
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          .testimonials-swiper {
            min-height: 260px;
          }

          .testimonials-swiper .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            cursor: pointer;
            user-select: none;
          }

          .swiper-button-prev-custom.swiper-button-disabled,
          .swiper-button-next-custom.swiper-button-disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
        `}</style>
      </Wrapper>
    </section>
  );
}

export default TestimonialsSection;
