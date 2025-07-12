"use client";

export default function Footer() {
  const date = new Date();

  return (
    <footer className="bg-indigo-950 text-amber-300 py-6">
      <div className="w-full mx-auto max-w-screen-xl flex flex-col md:flex-row items-center justify-between px-6">
        <span className="text-sm text-amber-300">
          © {date.getFullYear()}{" "}
          <a href="/" className="hover:underline text-text-amber-300">
            EthTix
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
