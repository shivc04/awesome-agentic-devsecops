# Contributing

Thanks for helping map the agentic DevSecOps landscape! Adding an entry takes about two minutes.

## How it works

Everything — the README tables **and** the [website](https://shivc04.github.io/awesome-agentic-devsecops/) — is generated from one file: [`data/agents.json`](data/agents.json). You never edit `README.md` directly.

## Add an agent

1. **Edit `data/agents.json`** and add an object to the `agents` array:

```json
{
  "name": "My Security Agent",
  "category": "code-security",
  "type": "open-source",
  "github": "owner/repo",
  "url": "https://github.com/owner/repo",
  "description": "One sentence, factual, ≤160 characters. What does it do and what makes it agentic?",
  "tags": ["SAST", "autofix"]
}
```

| Field | Required | Notes |
|---|---|---|
| `name` | ✅ | Official project name |
| `category` | ✅ | One of the `id`s in the `categories` array of the same file |
| `type` | ✅ | `open-source`, `commercial`, or `research` |
| `url` | ✅ | Canonical link (GitHub repo for OSS, product page for commercial, paper/blog for research) |
| `github` | for OSS | `owner/repo` — no URL, just the slug |
| `description` | ✅ | One factual sentence; no marketing superlatives |
| `tags` | ✅ | 2–4 short lowercase tags |

2. **Regenerate the README:**

```bash
npm run readme
```

3. **Open a pull request** with both the data change and the regenerated README.

## Inclusion criteria

- **Agentic or AI-powered, for real** — it must use an LLM/agent loop to reason, decide, or act. A regex scanner with an "AI" landing page doesn't count.
- **DevSecOps-relevant** — it secures code, pipelines, infrastructure, or operations (or secures the AI in them).
- **Alive and shipped** — working link, public availability (GA, beta, or maintained OSS). No vaporware, no dead repos.
- **No duplicates** — search the data file first.

## Previewing the site locally

```bash
cd web
npm install
npm run dev   # http://localhost:3000
```

## Removing or updating entries

Products get acquired, renamed, and killed. PRs that fix stale entries are just as valuable as new ones.
