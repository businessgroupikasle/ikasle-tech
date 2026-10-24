import {
  Boxes,
  Calendar,
  ChartColumn,
  Clock,
  Cloud,
  CodeXml,
  Database,
  Factory,
  FileText,
  Globe,
  Layers,
  MapPin,
  MonitorSmartphone,
  Package,
  PenTool,
  Receipt,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/types";

const icons: Record<IconName, LucideIcon> = {
  code: CodeXml,
  globe: Globe,
  "monitor-smartphone": MonitorSmartphone,
  smartphone: Smartphone,
  boxes: Boxes,
  sparkles: Sparkles,
  pen: PenTool,
  database: Database,
  server: Server,
  cloud: Cloud,
  layers: Layers,
  shield: Shield,
  workflow: Workflow,
  "map-pin": MapPin,
  users: Users,
  chart: ChartColumn,
  calendar: Calendar,
  package: Package,
  factory: Factory,
  receipt: Receipt,
  file: FileText,
  clock: Clock,
};

/** Maps content-data icon names to Lucide components so data files stay serialisable. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" {...props} />;
}
