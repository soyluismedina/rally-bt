"use client";

import { useState } from "react";
import ShareButton from "./ShareButton";
import RallyEditForm from "./RallyEditForm";

export default function RallyDashboardHeader({
  rallyId,
  name,
  date,
  place,
}: {
  rallyId: string;
  name: string;
  date: string;
  place: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Editar rally</h2>
          <span className="w-1.5 h-5 rounded-full bg-teal-500" />
        </div>
        <RallyEditForm
          rallyId={rallyId}
          defaultValues={{ name, date, place }}
          onDone={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <header>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">
            {name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {date} &middot; {place}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <ShareButton rallyId={rallyId} />
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Editar
          </button>
        </div>
      </div>
    </header>
  );
}
