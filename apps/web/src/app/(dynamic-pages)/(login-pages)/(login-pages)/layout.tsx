
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full ">
    <div className="grid">
      <div className="text-center flex flex-col items-center justify-center space-y-8 h-screen">
        <div>{children}</div>
      </div>
    </div>
  </div>
}
