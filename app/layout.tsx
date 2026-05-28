import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rally de Beach Tennis",
  description: "Gestión de partidas de beach tennis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClerkProvider>
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
            <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 group shrink-0"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-lg shadow-sm group-hover:shadow-md transition-shadow">
                  🏓
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                  Rally
                  <span className="text-teal-600"> BT</span>
                </span>
              </Link>

              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Inicio
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      Iniciar sesión
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="text-sm font-medium text-white bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
                      Registrarse
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-lg ring-2 ring-slate-100",
                      },
                    }}
                  />
                </Show>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
