#!/usr/bin/env node
/**
 * Refreshes data/stars.json with GitHub star counts for every entry in
 * data/agents.json that has a `github` field. Failures keep the cached
 * count and never fail the build.
 * Usage: npm run stars  (GITHUB_TOKEN env raises the API rate limit)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const starsPath = join(root, "data", "stars.json");

const { agents } = JSON.parse(readFileSync(join(root, "data", "agents.json"), "utf8"));
const repos = [...new Set(agents.map((a) => a.github).filter(Boolean))];
const cached = existsSync(starsPath) ? JSON.parse(readFileSync(starsPath, "utf8")) : {};

const headers = {
  "User-Agent": "awesome-agentic-devsecops",
  Accept: "application/vnd.github+json",
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const stars = {};
let updated = 0;
let kept = 0;

for (const repo of repos) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { stargazers_count } = await res.json();
    if (typeof stargazers_count !== "number") throw new Error("no stargazers_count");
    stars[repo] = stargazers_count;
    updated++;
  } catch (err) {
    if (typeof cached[repo] === "number") {
      stars[repo] = cached[repo];
      kept++;
      console.warn(`  ! ${repo}: ${err.message} — keeping cached ${cached[repo]}`);
    } else {
      console.warn(`  ! ${repo}: ${err.message} — no cached value, omitting`);
    }
  }
}

writeFileSync(starsPath, JSON.stringify(stars, null, 2) + "\n");
console.log(`stars.json: ${updated} fetched, ${kept} from cache, ${repos.length} repos total.`);
