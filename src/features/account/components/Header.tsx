"use client";

import SheardButton from "@/src/components/shared/SheardButton";
import { usePathname, useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header>
      <aside className="flex items-center justify-between mb-4 py-4 px-4 sm:px-5 rounded-sm bg-zinc-800">
        <h1 className="text-xl hidden sm:flex sm:text-lg font-bold text-white">
          Profile
        </h1>

        <div className="flex items-center gap-3">
          {/* /me/profile */}
          <SheardButton
            onClick={() => router.push("/me/profile")}
            className={`text-xs py-0 sm:px-4 sm:py-5 ${
              pathname === "/me/profile" ? "text-white" : "text-black"
            }`}
          >
            Profile
          </SheardButton>

          {/* /me/settings */}
          <SheardButton
            onClick={() => router.push("/me/settings")}
            className={`text-xs py-0 sm:px-4 sm:py-5 ${
              pathname === "/me/settings" ? "text-white" : "text-black"
            }`}
          >
            settings
          </SheardButton>

          {/* /me/change-password */}
          <SheardButton
            onClick={() => router.push("/me/change-password")}
            className={`text-xs py-0 sm:px-4 sm:py-5 ${
              pathname === "/me/change-password" ? "text-white" : "text-black"
            }`}
          >
            Change password
          </SheardButton>
        </div>
      </aside>
    </header>
  );
}

export default Header;
