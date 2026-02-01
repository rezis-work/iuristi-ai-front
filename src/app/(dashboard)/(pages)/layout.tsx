import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      აქ უნდა გაკეთდეს სურათი ყველა გვერდმა რომ გაიზიაროს გვერდებზე გადასვლის
      დროს (pages) ისთვის
      {children}
    </div>
  );
}

export default layout;
