import { cn } from "@/src/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  titleHighlight?: string;
  descriptions: string[];
  className?: string;
  labelClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function SectionHeader({
  label,
  title,
  titleHighlight = ".",
  descriptions,
  className,
  labelClassName,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <section className={cn("bg-black text-white pb-10", className)}>
      <div className="mx-auto max-w-7xl w-full">
        <div className="mb-3">
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-yellow-500" />
            <span
              className={cn(
                "text-sm font-medium tracking-wider text-zinc-300 uppercase",
                labelClassName,
              )}
            >
              {label}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl text-zinc-300 font-bold leading-tight",
                titleClassName,
              )}
            >
              {title}
              <span className="text-zinc-200">{titleHighlight}</span>
            </h2>
          </div>
          <div className="space-y-8 text-gray-400">
            {descriptions.map((description, index) => (
              <p
                key={index}
                className={cn(
                  "text-base md:text-lg leading-relaxed",
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
