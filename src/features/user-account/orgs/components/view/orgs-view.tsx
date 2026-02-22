"use client";

import Wrapper from "@/src/components/shared/wrapper";
import { OrgsSelect } from "@/src/components/shared/orgs-select";
import OrgsPage from "../orgs";

export default function OrgsView() {
  return (
    <Wrapper className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 py-4">
        <div className="max-w-xs">
          <OrgsSelect />
        </div>
        <OrgsPage />
      </div>
    </Wrapper>
  );
}
