import React from "react";
import Wrapper from "@/src/components/shared/wrapper";

function Footer() {
  return (
    <React.Fragment>
      <div className="bg-zinc-900">Footer top</div>
      <div className="bg-black py-5">
        <Wrapper className="mx-auto px-4">footer bottom</Wrapper>
      </div>
    </React.Fragment>
  );
}

export default Footer;
