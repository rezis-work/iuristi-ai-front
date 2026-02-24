import Link from "next/link";
import { Home, FileQuestion } from "lucide-react";

function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background gradient + subtle orbs */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950 via-black to-zinc-950" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[#FF9D4D]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#FF9D4D]/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-zinc-800/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Icon */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[#FF9D4D]/20 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sm:h-28 sm:w-28">
              <FileQuestion className="h-12 w-12 text-[#FF9D4D] sm:h-14 sm:w-14" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* 404 number */}
        <h1 className="font-mono text-[120px] font-bold leading-none tracking-tighter text-zinc-800/80 sm:text-[160px] lg:text-[200px]">
          404
        </h1>

        {/* Message */}
        <p className="-mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          გვერდი ვერ მოიძებნა
        </p>
        <p className="mt-2 text-base text-zinc-400 sm:text-lg">
          სამართლებრივი დახმარებისთვის დაბრუნდით მთავარ გვერდზე
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="group mt-12 inline-flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-[#FF9D4D]/50 hover:bg-[#FF9D4D] hover:text-black sm:text-base"
        >
          <Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
          მთავარი გვერდი
        </Link>

        {/* Decorative line */}
        <div className="mt-16 h-px w-24 bg-linear-to-r from-transparent via-[#FF9D4D]/50 to-transparent" />
      </div>
    </div>
  );
}

export default NotFound;
