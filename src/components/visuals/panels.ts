// Background colour for each case study's visual panel, by position in the list. Shared by the Work cards and detail pages.
const panels = ["bg-blaze", "bg-sea", "bg-sand-2", "bg-mirage-2"];

export const projectPanel = (index: number) => panels[index % panels.length];
export const isDarkPanel = (index: number) => projectPanel(index) !== "bg-sand-2";
