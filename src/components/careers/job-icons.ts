import { Clapperboard, Code2, GraduationCap, Megaphone, Palette, PenLine, type LucideIcon } from "lucide-react";
import type { JobIcon } from "@/data/careers";

export const jobIcons: Record<JobIcon, LucideIcon> = {
  code: Code2,
  video: Clapperboard,
  palette: Palette,
  pen: PenLine,
  megaphone: Megaphone,
  graduation: GraduationCap,
};
