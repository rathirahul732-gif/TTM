import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Team Task Manager",
  description: "Manage projects and tasks with your team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
