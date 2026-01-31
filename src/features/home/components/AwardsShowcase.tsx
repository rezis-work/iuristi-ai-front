import SectionHeader from "@/src/components/shared/SectionHeader";
import Wrapper from "@/src/components/shared/wrapper";

interface Award {
  id: string;
  title: string;
  type: string;
  client: string;
  year: string;
}

const awards: Award[] = [
  {
    id: "01",
    title: "Complicated Case",
    type: "Criminal",
    client: "Steve Matthews",
    year: "2019",
  },
  {
    id: "02",
    title: "Fraud scheme",
    type: "Finance",
    client: "Tech Corporate",
    year: "2020",
  },
  {
    id: "03",
    title: "Abuse victims",
    type: "Family",
    client: "The Thompsons",
    year: "2021",
  },
  {
    id: "04",
    title: "Real estate fraud",
    type: "Corporate",
    client: "Home Estate Co.",
    year: "2022",
  },
  {
    id: "05",
    title: "Discrimination case",
    type: "Human rights",
    client: "Samantha Jones",
    year: "2023",
  },
];

export default function AwardsShowcase() {
  return (
    <Wrapper className="mx-auto w-full bg-black text-white py-12 px-6 lg:px-24">
      <SectionHeader
        label="About Us"
        title="Our awards from the legal community"
        titleHighlight="!"
        descriptions={[
          "Adipiscing elit, sed do euismod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        ]}
      />
      <div className="max-w-7xl mx-auto select-none">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-gray-800">
          <div className="col-span-1 text-gray-400 text-sm font-medium">#</div>
          <div className="col-span-4 text-gray-400 text-sm font-medium">
            Award
          </div>
          <div className="col-span-3 text-gray-400 text-sm font-medium">
            Type
          </div>
          <div className="col-span-3 text-gray-400 text-sm font-medium">
            Clients
          </div>
          <div className="col-span-1 text-gray-400 text-sm font-medium text-right"></div>
        </div>

        {/* Awards List */}
        <div className="space-y-0">
          {awards.map((award, index) => (
            <div
              key={award.id}
              className={`${
                index !== awards.length - 1 ? "border-b border-gray-800" : ""
              }`}
            >
              {/* Mobile Layout */}
              <div className="md:hidden py-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-normal">{award.title}</h3>
                  <p className="text-xl font-light text-gray-400">
                    {award.year}
                  </p>
                </div>
                <p className="text-lg text-gray-300">{award.type}</p>
                <p className="text-lg text-gray-300">{award.client}</p>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-12 gap-4 py-8 items-center hover:bg-gray-900/30 transition-colors duration-200">
                {/* Number */}
                <div className="col-span-1">
                  <span className="text-2xl font-light text-gray-400">
                    {award.id}
                  </span>
                </div>

                {/* Award Title */}
                <div className="col-span-4 flex items-center gap-4">
                  <h3 className="text-xl font-normal">{award.title}</h3>
                </div>

                {/* Type */}
                <div className="col-span-3">
                  <span className="text-gray-300">{award.type}</span>
                </div>

                {/* Client */}
                <div className="col-span-3">
                  <span className="text-gray-300">{award.client}</span>
                </div>

                {/* Year */}
                <div className="col-span-1 text-right">
                  <span className="text-2xl font-light text-gray-400">
                    {award.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
