/** Light palette aligned with app/globals.css :root */
export const brandColors = {
  bg: "#f4f4e8",
  fg: "#1a1a12",
  muted: "#5c5c52",
  primary: "#0d4a45",
  accent: "#e5f62c",
  border: "#e2e2d4",
  card: "#ffffff",
};

const linkedinUrl = "https://www.linkedin.com/in/david-kinuthia/";
const githubUrl = "https://github.com/kd-kinuthiadavid";

export const brand = {
  name: "David Kinuthia",
  tagline: "AI & product engineering consultant",
  email: "david.kinuthia@gmail.com",
  linkedinUrl,
  githubUrl,
  /** Public profiles that identify the same person (JSON-LD `sameAs`) */
  sameAs: [linkedinUrl, githubUrl],
  location: { locality: "Nairobi", country: "KE" },
  knowsAbout: [
    "AI integration",
    "Private AI deployment",
    "Retrieval-augmented generation (RAG)",
    "Agentic automation",
    "LLM evaluation",
    "AI product readiness",
    "Full-stack product engineering",
    "Cloud infrastructure",
    "Fractional CTO",
  ],
  colors: brandColors,
  /** Stroke paths of app/icon.svg (24x24 viewBox) */
  logoPaths: [
    "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
    "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",
    "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",
  ],
};
