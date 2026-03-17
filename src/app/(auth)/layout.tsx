import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-200/50 to-violet-200/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-2xl font-bold">
            <span className="gradient-text">StudyBoost</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
