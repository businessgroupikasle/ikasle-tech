import type { ComponentProps } from "react";

export function FlagIN({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="India flag" {...props}>
      <path fill="#f93" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#128807" d="M0 320h640v160H0z" />
      <circle cx="320" cy="240" r="56" fill="none" stroke="#000088" strokeWidth="8" />
      <circle cx="320" cy="240" r="14" fill="#000088" />
      <g stroke="#000088" strokeWidth="3" transform="translate(320 240)">
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2="56" transform={`rotate(${i * 15})`} />
        ))}
      </g>
    </svg>
  );
}

export function FlagUS({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="United States flag" {...props}>
      <path fill="#bd3d44" d="M0 0h640v480H0z" />
      <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
      <path fill="#192f5d" d="M0 0h260v258H0z" />
      <g fill="#fff">
        <circle cx="30" cy="26" r="8" />
        <circle cx="76" cy="26" r="8" />
        <circle cx="122" cy="26" r="8" />
        <circle cx="168" cy="26" r="8" />
        <circle cx="214" cy="26" r="8" />
        <circle cx="53" cy="52" r="8" />
        <circle cx="99" cy="52" r="8" />
        <circle cx="145" cy="52" r="8" />
        <circle cx="191" cy="52" r="8" />
        <circle cx="30" cy="78" r="8" />
        <circle cx="76" cy="78" r="8" />
        <circle cx="122" cy="78" r="8" />
        <circle cx="168" cy="78" r="8" />
        <circle cx="214" cy="78" r="8" />
        <circle cx="53" cy="104" r="8" />
        <circle cx="99" cy="104" r="8" />
        <circle cx="145" cy="104" r="8" />
        <circle cx="191" cy="104" r="8" />
        <circle cx="30" cy="130" r="8" />
        <circle cx="76" cy="130" r="8" />
        <circle cx="122" cy="130" r="8" />
        <circle cx="168" cy="130" r="8" />
        <circle cx="214" cy="130" r="8" />
        <circle cx="53" cy="156" r="8" />
        <circle cx="99" cy="156" r="8" />
        <circle cx="145" cy="156" r="8" />
        <circle cx="191" cy="156" r="8" />
        <circle cx="30" cy="182" r="8" />
        <circle cx="76" cy="182" r="8" />
        <circle cx="122" cy="182" r="8" />
        <circle cx="168" cy="182" r="8" />
        <circle cx="214" cy="182" r="8" />
        <circle cx="53" cy="208" r="8" />
        <circle cx="99" cy="208" r="8" />
        <circle cx="145" cy="208" r="8" />
        <circle cx="191" cy="208" r="8" />
        <circle cx="30" cy="234" r="8" />
        <circle cx="76" cy="234" r="8" />
        <circle cx="122" cy="234" r="8" />
        <circle cx="168" cy="234" r="8" />
        <circle cx="214" cy="234" r="8" />
      </g>
    </svg>
  );
}

export function FlagUK({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="United Kingdom flag" {...props}>
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#fff" d="m75 0 245 180L565 0h75v50L400 240l240 180v60h-80L320 300 80 480H0v-60l240-180L0 60V0h75z" />
      <path fill="#c8102e" d="m424 288 216 162v30h-40L360 300l64-12zM640 0v10L425 170l40 30L640 30V0zM0 480v-10l215-160-40-30L0 450v30zM216 192 0 30V0h40l240 180-64 12z" />
      <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
      <path fill="#c8102e" d="M270 0h100v480H270zM0 190h640v100H0z" />
    </svg>
  );
}

export function FlagUAE({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="United Arab Emirates flag" {...props}>
      <path fill="#00732f" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#000" d="M0 320h640v160H0z" />
      <path fill="#f00" d="M0 0h180v480H0z" />
    </svg>
  );
}

export function FlagCA({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="Canada flag" {...props}>
      <path fill="#d52b1e" d="M0 0h160v480H0zm480 0h160v480H480z" />
      <path fill="#fff" d="M160 0h320v480H160z" />
      <path
        fill="#d52b1e"
        d="M320 85l18 48 38-16-12 40 40 10-24 32 30 18-36 18 10 38-36-8-12 42-12-42-36 8 10-38-36-18 30-18-24-32 40-10-12-40 38 16zM315 315h10v65h-10z"
      />
    </svg>
  );
}

export function FlagSA({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="Saudi Arabia flag" {...props}>
      <path fill="#006c35" d="M0 0h640v480H0z" />
      <path
        fill="#fff"
        d="M170 340h280v10H170zm280-4l30 9-30 9v-6H170v-6h280zM195 360h22v12h-22zm30 0h15v12h-15zm-45-10h10v34h-10z"
      />
      <text
        x="320"
        y="260"
        fill="#fff"
        fontSize="68"
        fontFamily="sans-serif"
        fontWeight="bold"
        textAnchor="middle"
      >
        لا إله إلا الله
      </text>
    </svg>
  );
}

export function FlagAU({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="Australia flag" {...props}>
      <path fill="#00008b" d="M0 0h640v480H0z" />
      <g transform="scale(0.5)">
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path fill="#fff" d="m75 0 245 180L565 0h75v50L400 240l240 180v60h-80L320 300 80 480H0v-60l240-180L0 60V0h75z" />
        <path fill="#c8102e" d="m424 288 216 162v30h-40L360 300l64-12zM640 0v10L425 170l40 30L640 30V0zM0 480v-10l215-160-40-30L0 450v30zM216 192 0 30V0h40l240 180-64 12z" />
        <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
        <path fill="#c8102e" d="M270 0h100v480H270zM0 190h640v100H0z" />
      </g>
      <circle cx="160" cy="360" r="32" fill="#fff" />
      <circle cx="480" cy="110" r="14" fill="#fff" />
      <circle cx="530" cy="180" r="14" fill="#fff" />
      <circle cx="480" cy="380" r="18" fill="#fff" />
      <circle cx="420" cy="240" r="14" fill="#fff" />
      <circle cx="450" cy="290" r="9" fill="#fff" />
    </svg>
  );
}

export function FlagNZ({ className = "h-4 w-6", ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-label="New Zealand flag" {...props}>
      <path fill="#00247d" d="M0 0h640v480H0z" />
      <g transform="scale(0.5)">
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path fill="#fff" d="m75 0 245 180L565 0h75v50L400 240l240 180v60h-80L320 300 80 480H0v-60l240-180L0 60V0h75z" />
        <path fill="#c8102e" d="m424 288 216 162v30h-40L360 300l64-12zM640 0v10L425 170l40 30L640 30V0zM0 480v-10l215-160-40-30L0 450v30zM216 192 0 30V0h40l240 180-64 12z" />
        <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
        <path fill="#c8102e" d="M270 0h100v480H270zM0 190h640v100H0z" />
      </g>
      <circle cx="480" cy="110" r="15" fill="#fff" />
      <circle cx="480" cy="110" r="11" fill="#cc142b" />
      <circle cx="540" cy="200" r="14" fill="#fff" />
      <circle cx="540" cy="200" r="10" fill="#cc142b" />
      <circle cx="480" cy="380" r="18" fill="#fff" />
      <circle cx="480" cy="380" r="13" fill="#cc142b" />
      <circle cx="420" cy="240" r="14" fill="#fff" />
      <circle cx="420" cy="240" r="10" fill="#cc142b" />
    </svg>
  );
}

export function CountryFlag({ code, className }: { code: string; className?: string }) {
  switch (code.toUpperCase()) {
    case "IN":
      return <FlagIN className={className} />;
    case "US":
      return <FlagUS className={className} />;
    case "GB":
    case "UK":
      return <FlagUK className={className} />;
    case "AE":
    case "UAE":
      return <FlagUAE className={className} />;
    case "CA":
      return <FlagCA className={className} />;
    case "SA":
    case "KSA":
      return <FlagSA className={className} />;
    case "AU":
      return <FlagAU className={className} />;
    case "NZ":
      return <FlagNZ className={className} />;
    default:
      return null;
  }
}

