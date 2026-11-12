import type { LearningModule } from "../../data/dummy/modules";

type ModuleIconName = LearningModule["icon"];

const illustrations: Record<ModuleIconName, React.ReactNode> = {
  book: (
    <>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5v-15Z" />
      <path d="M5 6h10m-7 4h7m-7 4h5" />
    </>
  ),
  constitution: (
    <>
      <path d="M4 20h16M6 17h12M7 17V9l5-4 5 4v8" />
      <path d="M10 12h4m-2-2v5" />
    </>
  ),
  island: (
    <>
      <path d="M3 18c3-2 5-2 8 0s5 2 10 0" />
      <path d="M6 15c2-3 4-5 6-5s4 2 6 5H6Zm6-5V5m0 0-3 4m3-4 3 4" />
    </>
  ),
  unity: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="8" r="1.7" />
      <circle cx="19" cy="8" r="1.7" />
      <circle cx="6" cy="17" r="1.7" />
      <circle cx="18" cy="17" r="1.7" />
      <path d="m7 9 3 2m7-2-3 2m-7 6 3-2m7 2-3-2" />
    </>
  ),
};

export function ModuleIcon({ name }: { name: ModuleIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="size-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    >
      {illustrations[name]}
    </svg>
  );
}
