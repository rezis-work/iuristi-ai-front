import SharedImage from "@/src/components/shared/SharedImage";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SharedImage />
      <div>{children}</div>
    </div>
  );
}

export default Layout;
