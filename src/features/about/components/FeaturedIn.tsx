import Image from "next/image";

export const partners = [
  { name: "KHOU 11", logo: "/logos/new-clients-13.webp", height: 32 },
  {
    name: "Daily News",
    logo: "/logos/new-clients-8-copyright.webp",
    height: 53,
  },
  { name: "Forbes", logo: "/logos/new-clients-9-copyright.webp", height: 50 },
  {
    name: "Chicago Sun-Times",
    logo: "/logos/new-clients-10-copyright.webp",
    height: 50,
  },
  { name: "CNN", logo: "/logos/new-clients-11-copyright.webp", height: 55 },
  {
    name: "The New York Times",
    logo: "/logos/new-clients-17.webp",
    height: 32,
  },
];

export default function FeaturedIn() {
  return (
    <section className="py-12">
      <div className="md:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 items-center md:grid-cols-6 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center"
              style={{ height: partner.height }}
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={120}
                height={partner.height}
                priority
                unoptimized
                className="w-auto object-contain opacity-50 grayscale cursor-pointer transition-all duration-200 ease-in-out hover:opacity-100 hover:grayscale-0"
                style={{ height: partner.height }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
