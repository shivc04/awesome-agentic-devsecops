import "./globals.css";

export const metadata = {
  title: "Awesome Agentic DevSecOps — AI Agents Securing the Software Lifecycle",
  description:
    "A curated atlas of AI agents for DevSecOps: autonomous code review, pentesting agents, AI SOC analysts, LLM security, supply-chain defense, and the frameworks to build your own.",
  keywords: [
    "DevSecOps",
    "AI agents",
    "agentic AI",
    "security automation",
    "LLM security",
    "autonomous pentesting",
    "AI SOC",
  ],
  openGraph: {
    title: "Awesome Agentic DevSecOps",
    description:
      "A curated atlas of AI agents that secure the software lifecycle — from threat modeling to SOC response.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
