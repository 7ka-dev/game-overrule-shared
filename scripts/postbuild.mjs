import { writeFileSync } from "node:fs";

// tsc does not emit package.json into outDir, so mark each build explicitly.
// Without these files Node resolves the ESM/CJS outputs with the wrong module type.
writeFileSync("dist/esm/package.json", JSON.stringify({ type: "module" }, null, 2) + "\n");
writeFileSync("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
