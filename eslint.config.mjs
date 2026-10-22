import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
  {
    // Vendored React Bits components are kept verbatim so they can be diffed against upstream.
    // They mirror "latest props" into refs during render (fine without the React Compiler, which this
    // project doesn't enable), and render small inline <img> tiles where next/image adds nothing.
    files: ["src/components/react-bits/**"],
    rules: {
      "react-hooks/refs": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
