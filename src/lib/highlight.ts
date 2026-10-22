export type TokenClass = "keyword" | "type" | "string" | "fn" | "prop" | "punct" | "comment" | "plain" | "success" | "muted";
export type Token = { text: string; cls: TokenClass };

const KEYWORDS = new Set([
  "type", "interface", "export", "function", "return", "const", "let", "async", "await", "import", "from",
  "new", "if", "else", "true", "false", "null", "extends", "default", "as", "for", "of", "in", "class",
]);
const TYPES = new Set(["string", "boolean", "number", "void", "Promise", "Record", "unknown"]);

const RULES: [RegExp, (m: string, next: string) => TokenClass][] = [
  [/^\/\/[^\n]*/, () => "comment"],
  [/^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'|^`(?:[^`\\]|\\.)*`/, () => "string"],
  [/^\s+/, () => "plain"],
  [/^\.\.\./, () => "punct"],
  [/^[A-Za-z_$][\w$]*/, (m, next) => {
    if (KEYWORDS.has(m)) return "keyword";
    if (TYPES.has(m) || /^[A-Z]/.test(m)) return "type";
    if (next.startsWith("(")) return "fn";
    if (/^\??:/.test(next)) return "prop";
    return "plain";
  }],
  [/^\d+(?:\.\d+)?/, () => "prop"],
  [/^[{}()[\];,.:=<>?|&+\-*/!]+/, () => "punct"],
];

/** Small, dependency-free TypeScript tokenizer — enough for the decorative code samples. */
export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let rest = code;
  while (rest.length) {
    let matched = false;
    for (const [re, classify] of RULES) {
      const m = re.exec(rest);
      if (m) {
        const text = m[0];
        rest = rest.slice(text.length);
        const next = rest.replace(/^\s+/, "");
        tokens.push({ text, cls: classify(text, next) });
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: rest[0] ?? "", cls: "plain" });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

/** Splits tokens into lines, preserving token classes across line breaks. */
export function toLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const tok of tokens) {
    const parts = tok.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1]!.push({ text: part, cls: tok.cls });
    });
  }
  return lines;
}
