import type { Portfolio } from "./types";

export const SINGLETON_ID = "00000000-0000-4000-8000-000000000001";
const techNames = [
  ["React", "Frontend"],
  ["Next.js", "Frontend"],
  ["TypeScript", "Frontend"],
  ["Tailwind CSS", "Frontend"],
  ["Node.js", "Backend"],
  ["Express", "Backend"],
  ["PostgreSQL", "Database"],
  ["Supabase", "Database"],
  ["Prisma", "Database"],
  ["Gemini API", "AI & APIs"],
  ["RAG", "AI & APIs"],
  ["Git", "Tools"],
];
const technologies = techNames.map(([name, category], i) => ({
  id: `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`,
  name,
  category,
  icon_key: "code",
  sort_order: i,
}));
const projectData = [
  {
    title: "AutoCar",
    slug: "autocar",
    category: "AI / FULL-STACK",
    summary: "Finding the right car. Now a conversation.",
    content:
      "An automotive showroom that brings vehicle discovery and AI assistance into one experience.\n\nThe challenge\nVehicle information spans prices, specifications, fuel types, transmissions, and engine capacities. AutoCar makes that information easier to explore through a conversational interface.\n\nThe approach\nA React frontend connects to a Node.js and Express backend with PostgreSQL and Supabase. A Retrieval-Augmented Generation workflow retrieves relevant vehicle information before the Gemini API generates a response.\n\nThe focus\nFull-stack integration, vector-based retrieval, and useful AI interactions. This project demonstrates the connection between structured data and a practical customer experience.",
    tech: [0, 4, 5, 6, 7, 9, 10],
  },
  {
    title: "Quiztfy",
    slug: "quiztfy",
    category: "WEB APPLICATION",
    summary: "A little curiosity. A lot of possibilities.",
    content:
      "A full-stack quiz application connecting an interactive frontend to a structured REST API.\n\nThe approach\nThe application uses PostgreSQL and Prisma for data management, with a REST API connecting the frontend and backend.\n\nThe focus\nBuilding a connected product across interface, API, and database. Detailed project outcomes and production links can be added through the portfolio admin.",
    tech: [0, 4, 6, 8],
  },
  {
    title: "DYY Fragrance",
    slug: "dyy-fragrance",
    category: "FRONTEND / COMMERCE",
    summary: "An online presence with a lasting impression.",
    content:
      "A fragrance commerce interface focused on visual presentation and responsive layouts.\n\nThe approach\nThe experience puts the product at the centre, using considered typography, spacing, and a layout that adapts to different screens.\n\nThe focus\nFrontend craftsmanship and a clear product browsing experience. Add verified implementation details and live links through the admin panel.",
    tech: [0, 3],
  },
  {
    title: "News Management",
    slug: "news-management",
    category: "CMS / WEB APP",
    summary: "Less managing content. More telling stories.",
    content:
      "A web application for managing news content and editorial workflows.\n\nThe approach\nCreate, read, update, and delete operations support the content lifecycle, with API integration connecting the interface to the data layer.\n\nThe focus\nPractical content management and readable interfaces. Add the full case study and project links once the final materials are available.",
    tech: [0, 4, 6],
  },
];
export const demoPortfolio: Portfolio = {
  demo: true,
  profile: {
    id: SINGLETON_ID,
    name: "Muhammad Hafizh Naufal",
    title: "Full-Stack Developer",
    headline:
      "I build practical digital products with web, AI, and modern technology.",
    about:
      "I'm Hafizh, an Information Systems graduate who enjoys turning complex problems into useful digital experiences. My work connects web development, AI-enabled applications, and hands-on IT systems.\n\nFrom building a thoughtful interface to connecting the data behind it, I care about the details that make a product work for people.",
    location: "Indonesia",
    avatar_url: "",
    cv_url: "",
  },
  projects: projectData.map((p, i) => ({
    id: `20000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`,
    title: p.title,
    slug: p.slug,
    category: p.category,
    summary: p.summary,
    content: p.content,
    cover_url: "",
    github_url: "",
    demo_url: "",
    year: "",
    featured: i < 2,
    status: "published",
    sort_order: i,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    technologies: p.tech.map((index) => technologies[index]),
  })),
  technologies,
  experiences: [
    {
      id: "30000000-0000-4000-8000-000000000001",
      organization: "PT Bukit Asam",
      position: "IT experience",
      location: "",
      start_date: null,
      end_date: null,
      description:
        "Hands-on exposure to IT systems and practical problem solving. Role details and dates will be added with verified information.",
      sort_order: 0,
    },
    {
      id: "30000000-0000-4000-8000-000000000002",
      organization: "DevHandal",
      position: "Developer learning",
      location: "",
      start_date: null,
      end_date: null,
      description:
        "Continuing to develop practical skills in modern software development. Programme details will be added with verified information.",
      sort_order: 1,
    },
    {
      id: "30000000-0000-4000-8000-000000000003",
      organization: "Dicoding",
      position: "Technical learning",
      location: "",
      start_date: null,
      end_date: null,
      description:
        "A foundation of continuous learning and applied development. Course details will be added with verified information.",
      sort_order: 2,
    },
  ],
  certificates: [],
  social_links: [],
  site_settings: {
    id: SINGLETON_ID,
    seo_title: "Hafizh — Full-Stack Developer",
    seo_description:
      "Selected work by Muhammad Hafizh Naufal. Practical digital products with web, AI, and modern technology.",
    availability_text: "Let's build something useful",
    contact_email: "",
  },
};
