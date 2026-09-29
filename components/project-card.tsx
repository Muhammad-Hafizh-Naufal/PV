import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectArt } from "./project-art";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card">
      <div className="project-cover">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={`${project.title} project preview`}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        ) : (
          <ProjectArt slug={project.slug} />
        )}
        <span className="project-open">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="project-meta">
        <span className="micro">
          {String(index + 1).padStart(2, "0")} / {project.category}
        </span>
        {project.year && <span className="micro">{project.year}</span>}
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tech-tags">
        {project.technologies?.slice(0, 4).map((tech) => (
          <span key={tech.id}>{tech.name}</span>
        ))}
      </div>
    </Link>
  );
}
