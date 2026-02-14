import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { AccountSidebar } from "@/src/features/account/components/account-sidebar";
import { LawyerProfileMenu } from "../../../features/lawer-proile/components/lawyer-profile-menu";


function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#111111] text-neutral-100">
      <Wrapper className="mx-auto px-4 lg:px-6 2xl:px-28">
        <div className="flex flex-col md:grid md:grid-cols-8 gap-6 sm:gap-6 md:gap-4 lg:gap-6 py-6 sm:py-8 2xl:flex-row 2xl:py-10">
          <div className="col-span-8 xl:col-span-2">
            <AccountSidebar />
          </div>
          <div className="w-full col-span-8 xl:col-span-6">
            <LawyerProfileMenu />
            {/* Content */}
            <div className="w-full rounded-sm bg-[#181818] px-4 py-5 sm:px-5 sm:py-6 2xl:px-6 flex-1">
              {children}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default Layout;
