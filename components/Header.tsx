"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const isPublic = /\/rally\/.+\/results$/.test(pathname);

  return (
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

        {!isPublic && (
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Inicio
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-lg ring-2 ring-slate-100",
                },
              }}
            />
          </Show>

          <Show when="signed-out">
            {!isPublic && (
              <>
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
              </>
            )}
            {isPublic && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Resultados públicos
              </span>
            )}
          </Show>
        </div>
      </div>
    </header>
  );
}
