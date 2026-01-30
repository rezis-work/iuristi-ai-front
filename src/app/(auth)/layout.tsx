import { DottedMap } from "@/src/components/magic-ui/dotted-map";
import { markers } from "@/src/constants/markers";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex justify-between relative w-full">
      <DottedMap markers={markers} />
      <div className="w-full lg:px-4 absolute z-20 mt-24 md:mt-5 select-none">
        {children}
      </div>
    </div>
  );
}
