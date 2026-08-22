import { IconName } from "@/lib/types";

const paths: Record<IconName, React.ReactNode> = {
  brake: <><rect x="4" y="7" width="16" height="10" rx="3" /><circle cx="8.5" cy="12" r="1.1" /><circle cx="15.5" cy="12" r="1.1" /><line x1="4" y1="12" x2="1.5" y2="12" /><line x1="20" y1="12" x2="22.5" y2="12" /></>,
  filter: <><rect x="7" y="3" width="10" height="15" rx="2" /><line x1="9.5" y1="7" x2="14.5" y2="7" /><line x1="9.5" y1="10.5" x2="14.5" y2="10.5" /><line x1="9.5" y1="14" x2="14.5" y2="14" /><path d="M10 18v2a2 2 0 0 0 4 0v-2" /></>,
  belt: <><circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="2.5" /><path d="M7 8a6 6 0 0 1 0 8" /><path d="M17 9.5a4 4 0 0 1 0 5" /></>,
  battery: <><rect x="3" y="8" width="16" height="9" rx="1.5" /><line x1="21" y1="11" x2="21" y2="14" /><line x1="7" y1="10.5" x2="7" y2="14.5" /><line x1="5" y1="12.5" x2="9" y2="12.5" /><line x1="13" y1="12.5" x2="16" y2="12.5" /></>,
  headlight: <><circle cx="10" cy="12" r="5" /><line x1="16" y1="9" x2="21" y2="7.5" /><line x1="16" y1="12" x2="21.5" y2="12" /><line x1="16" y1="15" x2="21" y2="16.5" /></>,
  oil: <><path d="M12 3c2.2 3 5 6.2 5 10a5 5 0 0 1-10 0c0-3.8 2.8-7 5-10Z" /><line x1="9.5" y1="15" x2="14.5" y2="15" /></>,
  shock: <><line x1="12" y1="2" x2="12" y2="6" /><path d="M9 6h6l-1.5 2h-3L9 6Z" /><path d="M12 8v3M9.5 12l5 1.2M9.5 13.6l5 1.2M9.5 15.2l5 1.2" /><line x1="12" y1="17.5" x2="12" y2="22" /></>,
  pump: <><circle cx="12" cy="12" r="4.2" /><path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6M17.9 17.9l-1.6-1.6M7.7 7.7 6.1 6.1" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.6 5l-6.6 6.6a1.5 1.5 0 0 0 2.1 2.1L11.2 13a4 4 0 0 0 5-5.6l-2.6 2.6-2-2 2.6-2.7Z" />,
  hammer: <><path d="M15 4l5 5-2.5 2.5L12.5 6.5 15 4Z" /><path d="M12.5 6.5 3 16l2 2 9.5-9.5" /><line x1="3" y1="21" x2="7" y2="17" /></>,
  home: <><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></>,
  shirt: <path d="M8 4 3 7l2.5 3L8 8.5V21h8V8.5L18.5 10 21 7l-5-3-2 2h-4l-2-2Z" />,
  paw: <><ellipse cx="12" cy="16" rx="5" ry="4" /><circle cx="6" cy="9" r="1.8" /><circle cx="10.5" cy="6" r="1.8" /><circle cx="15.5" cy="6" r="1.8" /><circle cx="19" cy="9" r="1.8" /></>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><line x1="9" y1="2" x2="9" y2="7" /><line x1="15" y1="2" x2="15" y2="7" /><line x1="9" y1="17" x2="9" y2="22" /><line x1="15" y1="17" x2="15" y2="22" /><line x1="2" y1="9" x2="7" y2="9" /><line x1="2" y1="15" x2="7" y2="15" /><line x1="17" y1="9" x2="22" y2="9" /><line x1="17" y1="15" x2="22" y2="15" /></>,
  today: <><path d="M13 5h4l3 4v6h-2" /><path d="M2 5h11v10H2z" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></>,
  box: <><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v9l9 5 9-5V8" /><line x1="12" y1="13" x2="12" y2="22" /></>,
  store: <><path d="M3 9l1.5-5h15L21 9" /><path d="M3 9h18v11H3z" /><path d="M9 20v-6h6v6" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  star: <path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3Z" />,
  arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="9" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  chevron: <polyline points="6 9 12 15 18 9" />,
  pin: <><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
  close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
};

export function Icon({
  name,
  className = "w-5 h-5",
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
