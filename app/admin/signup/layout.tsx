"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
