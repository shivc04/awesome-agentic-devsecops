"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Blocks,
  Bot,
  Cloud,
  Code2,
  Crosshair,
  ExternalLink,
  Github,
  Package,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const CATEGORY_ICONS = {
  "threat-modeling": Shield,
  "code-security": Code2,
  "supply-chain": Package,
  "infra-cloud": Cloud,
  offensive: Crosshair,
  soc: Siren,
  "llm-security": Bot,
  compliance: Scale,
  frameworks: Blocks,
};

const TYPE_LABELS = {
  "open-source": "Open Source",
  commercial: "Commercial",
  research: "Research",
};

function formatStars(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(count);
}

function matchesQuery(agent, query) {
  if (!query) return true;
  const haystack = [agent.name, agent.description, ...(agent.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function AgentCard({ agent, starCount }) {
  const githubUrl = agent.github ? `https://github.com/${agent.github}` : null;
  const showWebsite = agent.url && agent.url !== githubUrl;

  return (
    <article className="card">
      <div className="card-head">
        <h3>{agent.name}</h3>
        <span className={`badge badge-${agent.type}`}>{TYPE_LABELS[agent.type]}</span>
      </div>
      <p className="card-desc">{agent.description}</p>
      <div className="card-tags">
        {(agent.tags ?? []).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="card-links">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer">
            <Github size={15} aria-hidden="true" />
            GitHub
            {typeof starCount === "number" && (
              <span className="stars" title={`${starCount.toLocaleString()} stars`}>
                <Star size={12} aria-hidden="true" />
                {formatStars(starCount)}
              </span>
            )}
          </a>
        )}
        {showWebsite && (
          <a href={agent.url} target="_blank" rel="noreferrer">
            <ExternalLink size={15} aria-hidden="true" />
            Website
          </a>
        )}
      </div>
    </article>
  );
}

export default function Atlas({ data, stars = {} }) {
  const { site, categories, agents } = data;
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const repoUrl = `https://github.com/${site.repo}`;

  const visible = useMemo(
    () =>
      agents.filter(
        (agent) =>
          (activeType === "all" || agent.type === activeType) &&
          (activeCategory === "all" || agent.category === activeCategory) &&
          matchesQuery(agent, query),
      ),
    [agents, activeType, activeCategory, query],
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const agent of agents) {
      if (activeType !== "all" && agent.type !== activeType) continue;
      if (!matchesQuery(agent, query)) continue;
      counts[agent.category] = (counts[agent.category] ?? 0) + 1;
    }
    return counts;
  }, [agents, activeType, query]);

  const stats = useMemo(
    () => ({
      total: agents.length,
      oss: agents.filter((a) => a.type === "open-source").length,
      commercial: agents.filter((a) => a.type === "commercial").length,
      research: agents.filter((a) => a.type === "research").length,
    }),
    [agents],
  );

  const sections = categories
    .filter((c) => activeCategory === "all" || c.id === activeCategory)
    .map((c) => ({ ...c, agents: visible.filter((a) => a.category === c.id) }))
    .filter((c) => c.agents.length > 0);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <ShieldCheck size={20} aria-hidden="true" />
          </span>
          <span>
            <strong>Awesome Agentic DevSecOps</strong>
            <small>AI agents securing the software lifecycle</small>
          </span>
        </div>
        <a className="gh-button" href={repoUrl} target="_blank" rel="noreferrer">
          <Github size={16} aria-hidden="true" />
          Star on GitHub
        </a>
      </header>

      <main>
        <section className="hero">
          <span className="hero-badge">
            <Sparkles size={14} aria-hidden="true" />
            {stats.total} agents · {categories.length} categories · community curated
          </span>
          <h1>
            The atlas of <em>agentic AI</em> for DevSecOps
          </h1>
          <p className="hero-tagline">{site.tagline}</p>

          <div className="searchbox">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Search agents — try “pentest”, “SAST autofix”, “prompt injection”…"
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search agents"
            />
            {query && (
              <button className="clear" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{stats.total}</strong>
              <span>Curated agents</span>
            </div>
            <div className="stat">
              <strong>{stats.oss}</strong>
              <span>Open source</span>
            </div>
            <div className="stat">
              <strong>{stats.commercial}</strong>
              <span>Commercial</span>
            </div>
            <div className="stat">
              <strong>{stats.research}</strong>
              <span>Research</span>
            </div>
          </div>
        </section>

        <section className="controls" aria-label="Filters">
          <div className="type-pills" role="group" aria-label="Filter by type">
            {["all", "open-source", "commercial", "research"].map((type) => (
              <button
                key={type}
                className={activeType === type ? "pill active" : "pill"}
                onClick={() => setActiveType(type)}
              >
                {type === "all" ? "All types" : TYPE_LABELS[type]}
              </button>
            ))}
          </div>
          <div className="category-chips" role="group" aria-label="Filter by category">
            <button
              className={activeCategory === "all" ? "chip active" : "chip"}
              onClick={() => setActiveCategory("all")}
            >
              All ({visible.length})
            </button>
            {categories.map((c) => {
              const Icon = CATEGORY_ICONS[c.id] ?? Shield;
              return (
                <button
                  key={c.id}
                  className={activeCategory === c.id ? "chip active" : "chip"}
                  onClick={() => setActiveCategory(activeCategory === c.id ? "all" : c.id)}
                >
                  <Icon size={14} aria-hidden="true" />
                  {c.title} ({categoryCounts[c.id] ?? 0})
                </button>
              );
            })}
          </div>
        </section>

        {sections.length === 0 ? (
          <section className="empty">
            <p>No agents match your filters.</p>
            <button
              className="pill"
              onClick={() => {
                setQuery("");
                setActiveType("all");
                setActiveCategory("all");
              }}
            >
              Reset filters
            </button>
          </section>
        ) : (
          sections.map((section) => {
            const Icon = CATEGORY_ICONS[section.id] ?? Shield;
            return (
              <section key={section.id} className="category" aria-label={section.title}>
                <header className="category-head">
                  <span className="category-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h2>
                      {section.title} <span className="count">{section.agents.length}</span>
                    </h2>
                    <p>{section.blurb}</p>
                  </div>
                </header>
                <div className="grid">
                  {section.agents.map((agent) => (
                    <AgentCard key={agent.name} agent={agent} starCount={stars[agent.github]} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        <section className="contribute">
          <h2>Know an agent that belongs here?</h2>
          <p>
            This atlas is generated from a single <code>data/agents.json</code> file. Add an entry,
            open a pull request, and the site and README rebuild themselves.
          </p>
          <a className="gh-button large" href={`${repoUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
            Contribute on GitHub
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="footer">
        <span>
          MIT licensed · built from{" "}
          <a href={`${repoUrl}/blob/main/data/agents.json`} target="_blank" rel="noreferrer">
            data/agents.json
          </a>
        </span>
        <span>
          Inspired by{" "}
          <a
            href="https://github.com/ashishpatel26/500-AI-Agents-Projects"
            target="_blank"
            rel="noreferrer"
          >
            500-AI-Agents-Projects
          </a>
        </span>
      </footer>
    </div>
  );
}
