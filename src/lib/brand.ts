/**
 * IKASLE brand palette for places that cannot read CSS variables
 * (Three.js materials, SVG chart props, the generated OG image).
 * Keep in sync with the tokens in src/app/globals.css.
 *
 * Navy and blue were sampled from the official logo (public/brand/ikasle-technologies-logo.png).
 */
export const brand = {
  /** Logo navy — headings, primary text, important elements. */
  navy: "#08283C",
  /** Darker navy for dark surfaces (code editor, CTA panel). */
  navyDeep: "#061C30",
  /** Logo chevron blue — highlights, icons, borders, selected states (3.4:1 on white: non-text / large text only). */
  blue: "#008CF8",
  /** Action blue — button fills and small link text (4.85:1 with white, passes WCAG AA). */
  blueAction: "#0072D1",
  blueActionHover: "#0063B8",
  /** Lighter tint of the brand blue for soft gradients. */
  blueTint: "#4DB3FF",
  blueLight: "#EAF6FF",
  /** Second chart series: deep brand blue (validated pair with `blue`). */
  blueDeep: "#0D4F96",
  bg: "#FFFFFF",
  bgSoft: "#F6FAFD",
  textSoft: "#5B7084",
  line: "#DFEAF3",
} as const;
