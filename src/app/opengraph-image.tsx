import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = "IKASLE Technologies — We Build the Future in Code.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #ffffff 0%, #F6FAFD 55%, #E2F1FD 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${brand.blueAction},${brand.blue})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 700 }}>
              {"</>"}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: brand.navy }}>IKASLE Technologies</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: brand.navy, lineHeight: 1.02, letterSpacing: -3 }}>We Build the Future in</div>
            <div style={{ fontSize: 76, fontWeight: 700, color: brand.blue, lineHeight: 1.1, letterSpacing: -3 }}>Code.</div>
          </div>
          <div style={{ fontSize: 24, color: brand.textSoft }}>Software · Web & Mobile · ERP · AI & Automation</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 420,
            borderRadius: 24,
            background: brand.navyDeep,
            display: "flex",
            flexDirection: "column",
            padding: 28,
            fontFamily: "monospace",
            fontSize: 21,
            lineHeight: 1.6,
            color: "#D9EAF7",
            boxShadow: "0 40px 80px -30px rgba(0,70,130,.45)",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
          </div>
          <div style={{ display: "flex", color: "#5CB8FF" }}>export function buildFuture(</div>
          <div style={{ display: "flex", paddingLeft: 24 }}>product: DigitalProduct</div>
          <div style={{ display: "flex" }}>{") {"}</div>
          <div style={{ display: "flex", paddingLeft: 24, color: "#5CB8FF" }}>return {"{"}</div>
          <div style={{ display: "flex", paddingLeft: 48 }}>...product,</div>
          <div style={{ display: "flex", paddingLeft: 48, color: "#a5e887" }}>status: &quot;ready&quot;,</div>
          <div style={{ display: "flex", paddingLeft: 24 }}>{"};"}</div>
          <div style={{ display: "flex" }}>{"}"}</div>
        </div>
      </div>
    ),
    size,
  );
}
