import Image from "next/image";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Code2,
  Braces,
  Database,
  Sparkles,
  Terminal,
  Globe2,
  Plus,
} from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { Reveal } from "./motion";
import { Navbar } from "./navbar";
import { ProjectCard } from "./project-card";
import { Spotlight } from "./ui/spotlight";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {name}
      </span>
      <span>Thoughtfully designed. Purposefully built.</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}

export function PortfolioView({ data }: { data: Portfolio }) {
  const {
    profile,
    projects,
    technologies,
    experiences,
    certificates,
    social_links: socials,
    site_settings: settings,
  } = data;
  const groups = [...new Set(technologies.map((t) => t.category))];
  const icons = [Code2, Braces, Database, Sparkles, Terminal];
  const featured = projects.filter((p) => p.featured);
  const orderedProjects = [...featured, ...projects.filter((p) => !p.featured)];
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section id="top" className="hero wrap">
          <Spotlight />
          <div className="hero-topline">
            <span className="eyebrow">
              <span className="status-dot" />
              {settings.availability_text}
            </span>
            <span className="micro hero-coordinate">
              BASED IN {profile.location.toUpperCase()} ↗
            </span>
          </div>
          <div className="hero-main">
            <div className="hero-copy">
              <Reveal>
                <div className="hero-intro">
                  Hi, I’m Hafizh <span className="wave">✳</span>
                </div>
                <h1>
                  Thoughtful code.
                  <br />
                  <span>Useful things.</span>
                </h1>
                <p>{profile.headline}</p>
                <div className="hero-actions">
                  <a href="#work" className="button button-dark">
                    Explore my work <ArrowDownRight size={18} />
                  </a>
                  <a href="#about" className="text-link">
                    A little about me <ArrowUpRight size={16} />
                  </a>
                </div>
              </Reveal>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="blue-glow" />
              <div className="orbit-ring ring-a" />
              <div className="orbit-ring ring-b" />
              <div className="orbit-ring ring-c" />
              <div className="hero-grid" />
              <div className="code-object">
                <div className="object-top" />
                <div className="object-front">
                  <span>&lt;</span>
                  <i>/</i>
                  <span>&gt;</span>
                </div>
                <div className="object-side" />
              </div>
              <span className="floating-label label-web">
                <span className="label-dot" />
                WEB DEVELOPMENT
              </span>
              <span className="floating-label label-ai">
                <Sparkles size={12} /> AI × POSSIBILITIES
              </span>
              <div className="visual-marker marker-a">+</div>
              <div className="visual-marker marker-b">+</div>
              <span className="visual-note">IDEAS → INTERFACES → IMPACT</span>
            </div>
          </div>
          <div className="hero-bottom">
            <div>
              <span className="micro">{profile.title.toUpperCase()}</span>
              <span className="hero-divider" />
              <span className="micro">WEB · AI · IT SYSTEMS</span>
            </div>
            <a href="#work" className="micro scroll-cue">
              SCROLL TO EXPLORE <ArrowDown size={13} />
            </a>
          </div>
        </section>
        <section id="work" className="work-section wrap">
          <Reveal>
            <div className="section-top">
              <span className="eyebrow">01 — SELECTED WORK</span>
              <span className="micro">A FEW THINGS I’VE BUILT</span>
            </div>
            <div className="section-heading">
              <h2>
                Ideas made <span>real.</span>
              </h2>
              <p>
                A selection of practical products.
                <br />
                Built with care, from interface to infrastructure.
              </p>
            </div>
          </Reveal>
          <div className="project-grid">
            {orderedProjects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 0.08}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>
          {!projects.length && (
            <p className="empty-state">
              New projects are on the way. Check back soon.
            </p>
          )}
        </section>
        <section id="about" className="about-section">
          <div className="wrap">
            <div className="section-top">
              <span className="eyebrow">02 — BEHIND THE CODE</span>
              <span className="micro">CURIOUS BY DEFAULT</span>
            </div>
            <div className="about-grid">
              <Reveal className="about-portrait">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 760px) 100vw, 40vw"
                  />
                ) : (
                  <>
                    <div className="portrait-grid" />
                    <span className="portrait-label micro">
                      THE PERSON BEHIND THE PIXELS
                    </span>
                    <div className="portrait-monogram">
                      hn<span>.</span>
                    </div>
                    <div className="portrait-caption">
                      <strong>{profile.name}</strong>
                      <span>
                        <Globe2 size={13} /> {profile.location}
                      </span>
                    </div>
                    <span className="portrait-plus">+</span>
                  </>
                )}
              </Reveal>
              <Reveal className="about-copy">
                <h2>
                  A builder’s mindset.
                  <br />
                  <span>A human perspective.</span>
                </h2>
                {profile.about.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                <div className="about-links">
                  {profile.cv_url && (
                    <a
                      href={profile.cv_url}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-outline"
                    >
                      Download CV <ArrowUpRight size={16} />
                    </a>
                  )}
                  <a href="#contact" className="text-link">
                    Let’s connect <ArrowUpRight size={16} />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
        <section id="experience" className="experience-section wrap">
          <div className="experience-heading">
            <span className="eyebrow">03 — THE JOURNEY</span>
            <h2>
              Always learning.
              <br />
              <span>Always building.</span>
            </h2>
            <p>
              Experience, exploration, and the things
              <br className="desktop-only" /> learned along the way.
            </p>
          </div>
          <div className="timeline">
            {experiences.map((experience, i) => (
              <Reveal key={experience.id} className="timeline-item">
                <span className="timeline-node" />
                <div className="timeline-meta micro">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {experience.start_date && (
                    <span>
                      {new Date(
                        experience.start_date + "T00:00:00",
                      ).getFullYear()}{" "}
                      —{" "}
                      {experience.end_date
                        ? new Date(
                            experience.end_date + "T00:00:00",
                          ).getFullYear()
                        : "PRESENT"}
                    </span>
                  )}
                </div>
                <h3>{experience.organization}</h3>
                <span className="timeline-position">
                  {experience.position}
                  {experience.location && ` · ${experience.location}`}
                </span>
                <p>{experience.description}</p>
              </Reveal>
            ))}
            {!experiences.length && (
              <p className="muted">More of the journey, coming soon.</p>
            )}
          </div>
        </section>
        <section id="capabilities" className="capabilities-section wrap">
          <div className="section-top">
            <span className="eyebrow">04 — THE TOOLKIT</span>
            <span className="micro">THE RIGHT TOOLS. THE RIGHT REASONS.</span>
          </div>
          <div className="section-heading">
            <h2>
              Connected by <span>curiosity.</span>
            </h2>
            <p>
              Different technologies.
              <br />
              One goal: make it work beautifully.
            </p>
          </div>
          <div className="capability-grid">
            {groups.map((group, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal className="capability" key={group} delay={i * 0.04}>
                  <Icon size={22} strokeWidth={1.4} />
                  <h3>{group}</h3>
                  <div>
                    {technologies
                      .filter((t) => t.category === group)
                      .map((t) => (
                        <span key={t.id}>{t.name}</span>
                      ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
          {certificates.length > 0 && (
            <details className="certificates">
              <summary>
                <span>
                  Learning, backed by practice{" "}
                  <small>{certificates.length} certifications</small>
                </span>
                <Plus size={19} />
              </summary>
              <div className="certificate-list">
                {certificates.map((c) => (
                  <div key={c.id}>
                    <div>
                      <strong>{c.title}</strong>
                      <span>
                        {c.issuer} · {c.year}
                      </span>
                    </div>
                    {(c.credential_url || c.asset_url) && (
                      <a
                        href={c.credential_url || c.asset_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${c.title} credential`}
                      >
                        <ArrowUpRight size={20} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>
        <section id="contact" className="contact-section">
          <div className="contact-glow" />
          <div className="wrap">
            <div className="section-top">
              <span className="eyebrow">05 — WHAT’S NEXT?</span>
              <span className="eyebrow">
                <span className="status-dot" />
                {settings.availability_text}
              </span>
            </div>
            <Reveal>
              <h2>
                Have something
                <br />
                in <span>mind?</span>
                <ArrowUpRight className="contact-arrow" strokeWidth={1} />
              </h2>
              <div className="contact-bottom">
                <p>
                  A good conversation is a great place to start.
                  <br />
                  Let’s make something that matters.
                </p>
                {settings.contact_email ? (
                  <a
                    className="button contact-button"
                    href={`mailto:${settings.contact_email}`}
                  >
                    Say hello <ArrowUpRight size={19} />
                  </a>
                ) : (
                  <span className="contact-pending">
                    Contact details coming soon <ArrowRight size={17} />
                  </span>
                )}
              </div>
            </Reveal>
            <div className="contact-links">
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`}>
                  {settings.contact_email} <ArrowUpRight size={14} />
                </a>
              )}
              <div>
                {socials.map((s) => (
                  <a href={s.url} key={s.id} target="_blank" rel="noreferrer">
                    {s.label || s.platform} <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer name={profile.name} />
    </>
  );
}
