"use client";

function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`[@media(max-width:1024px)]:max-w-[1024px] [@media(max-width:767px)]:max-w-[767px] max-w-[1540px] w-full ${className}  `}
    >
      {children}
    </div>
  );
}

export default Wrapper;
