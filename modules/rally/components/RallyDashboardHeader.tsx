"use client";

import { useState } from "react";
import ShareButton from "./ShareButton";
import ShareQRModal from "./ShareQRModal";
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
  const [showQR, setShowQR] = useState(false);

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
    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-teal-200/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
              <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
            </svg>
            Rally de beach tennis
          </div>
          <h1 className="text-xl sm:text-2xl font-bold truncate">{name}</h1>
          <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            {date}
            {place && (
              <>
                <span className="text-white/40">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433 5.744 5.744 0 00.281.14l.018.008.006.003.002.001zm-1.163-17.81A7.75 7.75 0 001.5 9c0 3.87 1.898 6.642 3.73 8.41a15.23 15.23 0 002.52 1.96c.464.28.89.518 1.25.702.182.093.344.17.464.225l.033.014.007.003h.002l.003.001c.351.154.74.154 1.092 0l.003-.001.007-.003.033-.014c.12-.055.282-.132.464-.225a14.24 14.24 0 001.25-.702 15.23 15.23 0 002.52-1.96C16.602 15.642 18.5 12.87 18.5 9a7.75 7.75 0 10-15.5 0zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
                {place}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ShareButton rallyId={rallyId} />
          <button
            onClick={() => setShowQR(true)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Código QR"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M4.75 4.5a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-2.5z" />
              <path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h2.5A1.5 1.5 0 018.5 3.5v2.5A1.5 1.5 0 017 7.5H4.5A1.5 1.5 0 013 6V3.5zm4.5 0h-2.5v2.5h2.5v-2.5z" clipRule="evenodd" />
              <path d="M13 4.5a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-2.5z" />
              <path fillRule="evenodd" d="M11.5 3.5A1.5 1.5 0 0113 2h2.5A1.5 1.5 0 0117 3.5v2.5A1.5 1.5 0 0115.5 7.5H13a1.5 1.5 0 01-1.5-1.5V3.5zm4.5 0H13v2.5h2.5v-2.5z" clipRule="evenodd" />
              <path d="M4.5 13a.25.25 0 00-.25.25v2.5c0 .138.112.25.25.25h2.5a.25.25 0 00.25-.25v-2.5a.25.25 0 00-.25-.25h-2.5z" />
              <path fillRule="evenodd" d="M3 13.5A1.5 1.5 0 014.5 12h2.5a1.5 1.5 0 011.5 1.5v2.5A1.5 1.5 0 017 17.5H4.5A1.5 1.5 0 013 16v-2.5zm4.5 0h-2.5v2.5h2.5v-2.5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M11.5 12.5A1.5 1.5 0 0113 11h1.5v-1.5a.75.75 0 011.5 0v1.5h1.5a.75.75 0 010 1.5H16v1.5a.75.75 0 01-1.5 0V13H13a1.5 1.5 0 01-1.5-1.5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M13 12.5h1.5V14H13v-1.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Editar rally"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </button>
        </div>
      </div>

      {showQR && <ShareQRModal rallyId={rallyId} onClose={() => setShowQR(false)} />}
    </div>
  );
}
