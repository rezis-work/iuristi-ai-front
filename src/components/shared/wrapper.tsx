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
      className={`[@media(max-width:1024px)]:max-w-5xl [@media(max-width:767px)]:max-w-191.75 max-w-385 w-full ${className}  `}
    >
      {children}
    </div>
  );
}

export default Wrapper;
