"use client";

import dynamic from "next/dynamic";
import { clients } from "@/data/clients";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { ClientCard } from "./ClientCard";

const FlexCarousel = dynamic(() => import("@/components/react-bits/FlexCarousel/FlexCarousel"), { ssr: false });
const items = clients.map(client => ({
  src: client.logo,
  alt: `${client.name} logo`,
  title: client.name,
  subtitle: client.category,
  href: client.url,
}));

export function ClientsCarousel() {
  const supported = useWebGL2Support();
  const reduced = usePrefersReducedMotion();

  if (!supported || reduced) {
    return <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
      {clients.map((client, index) => <ClientCard key={client.slug} client={client} index={index} />)}
    </div>;
  }

  return <div>
    <div className="h-[380px] text-ink sm:h-[500px]">
      <FlexCarousel items={items} preset="liquid" intro="rise" fit="landscape"
        cardHeight={0.42} gap={24} radius={18} squeeze={0.2}
        focusOnClick captions captureWheel={false} autoplay interval={0.1} />
    </div>
  </div>;
}
