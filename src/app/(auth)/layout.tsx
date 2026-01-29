export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full  px-4">
        {children}
      </div>
    </div>
  );
}
