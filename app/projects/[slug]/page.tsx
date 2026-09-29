import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { getPortfolio } from "@/lib/data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/portfolio";
import { ProjectArt } from "@/components/project-art";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getPortfolio();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${slug}`,
      ...(project.cover_url ? { images: [project.cover_url] } : {}),
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPortfolio();
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const related = data.projects.filter((p) => p.id !== project.id).slice(0, 2);
  return (
    <>
      <Navbar />
      <main id="main-content" className="case-study wrap">
        <div id="top" />
        <Link href="/#work" className="text-link">
          <ArrowLeft size={16} /> Back to selected work
        </Link>
        <div className="case-header">
          <span className="eyebrow">
            {project.category}
            {project.year && ` / ${project.year}`}
          </span>
          <h1>
            {project.title}
            <span>.</span>
          </h1>
          <p>{project.summary}</p>
          <div className="tech-tags">
            {project.technologies?.map((t) => (
              <span key={t.id}>{t.name}</span>
            ))}
          </div>
        </div>
        <div className="case-cover">
          {project.cover_url ? (
            <Image
              src={project.cover_url}
              alt={`${project.title} interface`}
              fill
              sizes="100vw"
              priority
            />
          ) : (
            <ProjectArt slug={project.slug} />
          )}
        </div>
        <div className="case-body">
          <aside>
            <span className="eyebrow">PROJECT OVERVIEW</span>
            <p>From idea to implementation.</p>
            {project.demo_url && (
              <a
                className="button button-dark"
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
              >
                Visit project <ArrowUpRight size={16} />
              </a>
            )}
            {project.github_url && (
              <a
                className="text-link"
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={16} /> View source <ArrowUpRight size={16} />
              </a>
            )}
          </aside>
          <article>
            {project.content
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((block, i) => {
                const lines = block.split("\n");
                return (
                  <div key={i}>
                    {lines.length > 1 ? (
                      <>
                        <h2>{lines[0]}</h2>
                        <p>{lines.slice(1).join("\n")}</p>
                      </>
                    ) : (
                      <p>{block}</p>
                    )}
                  </div>
                );
              })}
          </article>
        </div>
        {related.length > 0 && (
          <section className="related-work">
            <div className="section-heading">
              <h2>
                Keep <span>exploring.</span>
              </h2>
              <Link href="/#work" className="text-link">
                All work <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="project-grid">
              {related.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer name={data.profile.name} />
    </>
  );
}
