"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
