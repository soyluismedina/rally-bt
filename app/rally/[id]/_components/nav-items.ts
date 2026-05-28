export const navItems = [
  {
    href: (id: string) => `/rally/${id}`,
    label: "Panel",
    color: "bg-teal-500",
  },
  {
    href: (id: string) => `/rally/${id}/participants`,
    label: "Participantes",
    color: "bg-sky-500",
  },
  {
    href: (id: string) => `/rally/${id}/matches`,
    label: "Partidas",
    color: "bg-amber-500",
  },
] as const;
