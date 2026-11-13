import { clients } from "@/data/clients";
import { ClientCard } from "./ClientCard";

export function ClientsSection() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="relative overflow-hidden border-t border-line/60 bg-white py-20 sm:py-24"
    >
      {/* Subtle background technical grid accent */}
      <div
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_75%)]"
        aria-hidden="true"
      />

      {/* Soft brand glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(0_140_248/0.035),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container-x relative z-10">
        {/* Section Header */}
        <div
          className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center sm:mb-18"
        >


          <h2
            id="clients-heading"
            className="mt-4 text-balance font-semibold tracking-[-0.035em] text-ink text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]"
          >
            Our Clients
          </h2>

          <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
            Proud to collaborate with businesses across industries, helping them build stronger
            digital experiences through technology.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((client) => (
            <ClientCard key={client.slug} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
}
