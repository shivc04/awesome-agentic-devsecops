#!/usr/bin/env node
/**
 * Generates README.md from data/agents.json.
 * Usage: npm run readme  (or: node scripts/generate-readme.mjs)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "data", "agents.json"), "utf8"));
const { site, categories, agents } = data;

const TYPE_BADGES = {
  "open-source": "🟢 Open Source",
  commercial: "🟣 Commercial",
  research: "🟡 Research",
};

// Mirrors GitHub's heading-anchor algorithm: strip punctuation, then map
// each space to a hyphen without collapsing runs ("A & B" -> "a--b").
const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s/g, "-");

const count = (type) => agents.filter((a) => a.type === type).length;

const links = (agent) => {
  const parts = [];
  if (agent.github) parts.push(`[Code](https://github.com/${agent.github})`);
  if (agent.url && agent.url !== `https://github.com/${agent.github ?? ""}`)
    parts.push(`[Site](${agent.url})`);
  return parts.join(" · ");
};

const escapeCell = (text) => text.replace(/\|/g, "\\|");

const sections = categories
  .map((category) => {
    const rows = agents
      .filter((a) => a.category === category.id)
      .map(
        (a) =>
          `| **${escapeCell(a.name)}** | ${TYPE_BADGES[a.type]} | ${escapeCell(a.description)} | ${links(a)} |`,
      )
      .join("\n");

    return `### ${category.title}

> ${category.blurb}

| Project | Type | Description | Links |
|---|---|---|---|
${rows}
`;
  })
  .join("\n");

const toc = categories
  .map((c) => {
    const n = agents.filter((a) => a.category === c.id).length;
    return `- [${c.title}](#${slug(c.title)}) — ${n} ${n === 1 ? "agent" : "agents"}`;
  })
  .join("\n");

const readme = `<!-- ⚠️ GENERATED FILE — do not edit README.md directly. -->
<!-- Edit data/agents.json and run \`npm run readme\` to regenerate. -->

# Awesome Agentic DevSecOps 🛡️🤖

<div align="center">

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Deploy](https://github.com/${site.repo}/actions/workflows/deploy.yml/badge.svg)](https://github.com/${site.repo}/actions/workflows/deploy.yml)

**${site.tagline}**

🌐 **[Explore the interactive atlas →](${site.url})**

</div>

---

## What is this?

Security teams are drowning in alerts, reviews, and audits — and a new generation of **AI agents** is taking over the repetitive parts. This list maps that landscape end to end: **${agents.length} curated agents** — ${count("open-source")} open source, ${count("commercial")} commercial, ${count("research")} research — organized by where they act in the software lifecycle.

Every entry is checked for a working link and a real, shipped capability. No vaporware.

\`\`\`mermaid
flowchart LR
  A["🧩 Plan<br/>Threat Modeling"] --> B["💻 Code<br/>AI Review & Autofix"]
  B --> C["📦 Dependencies<br/>Supply Chain"]
  C --> D["☁️ Infra<br/>Cloud & K8s"]
  D --> E["🎯 Test<br/>Offensive Agents"]
  E --> F["🚨 Operate<br/>SOC & Response"]
  F -. feedback .-> A
  G["🤖 LLM & Agent Security"] -. protects .- B
  G -. protects .- F
\`\`\`

## Contents

${toc}
- [Contributing](#contributing)
- [License](#license)

---

${sections}
---

## Contributing

Found an agent that belongs here? The whole project — README **and** website — is generated from a single file: [\`data/agents.json\`](data/agents.json).

1. Add your entry to \`data/agents.json\` (see [CONTRIBUTING.md](CONTRIBUTING.md) for the schema and inclusion criteria).
2. Run \`npm run readme\` to regenerate this file.
3. Open a pull request. 🎉

## Inspiration

Structure inspired by [500-AI-Agents-Projects](https://github.com/ashishpatel26/500-AI-Agents-Projects).

## License

[MIT](LICENSE) — curated with ❤️ for the DevSecOps community.
`;

writeFileSync(join(root, "README.md"), readme);
console.log(
  `README.md generated: ${agents.length} agents across ${categories.length} categories.`,
);
