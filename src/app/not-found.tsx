import Image from "next/image";
import SheardButton from "@/src/components/shared/SheardButton";
import Link from "next/link";

function NotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen -mt-24 overflow-hidden">
      <Image
        src="/images/404.webp"
        alt="404 Background"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/20 z-10" />
      <div className="relative z-20 flex items-center text-center flex-col">
        <h1 className="text-[110px] sm:text-[140px] lg:text-[300px] font-semibold text-zinc-200 drop-shadow-lg">
          404
        </h1>
        <p className="text-xl sm:text-2xl lg:text-5xl -mt-6 lg:-mt-12 mb-4 font-semibold text-white drop-shadow-lg">
          Page Not Found
        </p>
        <div className="text-center sm:text-lg lg:text-xl text-zinc-200 mb-10 drop-shadow-lg">
          <p>We&apos;re sorry but</p>
          <p>something went wrong.</p>
        </div>
        <Link href={"/"}>
          <SheardButton className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7 shadow-2xl">
            homepage
          </SheardButton>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
