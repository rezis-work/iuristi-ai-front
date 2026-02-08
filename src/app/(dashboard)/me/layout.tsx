import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { AccountSidebar } from "@/src/features/account/components/account-sidebar";
import Header from "@/src/features/account/components/Header";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="bg-[#111111] text-neutral-100">
      <Wrapper className="mx-auto px-4 sm:px-6 lg:px-28">
        <div className="mx-auto flex w-full flex-col gap-6 sm:gap-6 md:gap-4 lg:gap-6 py-6 sm:py-8 md:flex-row lg:py-10">
          <div className="md:w-72 lg:shrink-0 select-none">
            <AccountSidebar />
          </div>

          <div className="w-full lg:flex-1 flex flex-col">
            {/* Header მარჯვენა მხარეს AccountSidebar-ის გვერდით */}
       <Header/>

            {/* Content */}
            <div className="w-full rounded-sm bg-[#181818] px-4 py-5 sm:px-5 sm:py-6 lg:px-6 flex-1">
              {children}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default Layout;
