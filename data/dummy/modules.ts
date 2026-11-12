
export type LearningModule = {
  id: string;
  title: string;
  description: string;
  icon: "book" | "constitution" | "island" | "unity";
  colorClass: string;
};

export const learningModules: LearningModule[] = [
  {
    id: "pancasila",
    title: "Pancasila",
    description:
      "Memahami nilai, sejarah, dan penerapan Pancasila dalam kehidupan sehari-hari.",
    icon: "book",
    colorClass: "bg-primary",
  },
  {
    id: "uud-1945",
    title: "UUD 1945",
    description:
      "Memahami konstitusi, hak, dan kewajiban warga negara.",
    icon: "constitution",
    colorClass: "bg-secondary-600",
  },
  {
    id: "nkri",
    title: "NKRI",
    description:
      "Memahami bentuk negara, persatuan wilayah, dan kedaulatan Indonesia.",
    icon: "island",
    colorClass: "bg-success",
  },
  {
    id: "bhinneka-tunggal-ika",
    title: "Bhinneka Tunggal Ika",
    description:
      "Memahami keberagaman, toleransi, dan persatuan dalam perbedaan.",
    icon: "unity",
    colorClass: "bg-warning",
  },
];
