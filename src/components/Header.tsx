"use client";
import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="mx-auto">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo and Name */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Logo />
            <span className="text-xl font-semibold">FIOS</span>
          </Link>

          {/* Connect Button */}
          <div className="flex items-center">
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </header>
  );
}
