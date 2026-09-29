import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Check,
  Command,
  BarChart3,
  LayoutDashboard,
  FileText,
  Plus,
} from "lucide-react";

export function ProjectArt({ slug }: { slug: string }) {
  if (slug === "autocar")
    return (
      <div className="project-art art-auto" aria-hidden="true">
        <div className="mini-browser auto-browser">
          <div className="mock-nav">
            <strong>
              auto<span>car</span>
            </strong>
            <div>
              Discover <span>Showroom</span> About
            </div>
            <span className="mock-circle">
              <ArrowUpRight size={10} />
            </span>
          </div>
          <div className="auto-content">
            <span className="micro">YOUR NEXT CHAPTER STARTS HERE</span>
            <h3>
              Find your
              <br />
              <em>next drive.</em>
            </h3>
            <div className="mock-pill">
              Explore the collection <ArrowUpRight size={9} />
            </div>
          </div>
          <div className="car-stage">
            <svg viewBox="0 0 600 240" fill="none">
              <ellipse
                cx="311"
                cy="205"
                rx="244"
                ry="15"
                fill="#152525"
                opacity=".16"
              />
              <path
                d="M66 153L113 127L184 111L240 57Q256 45 286 45H366Q389 48 424 87L469 116L519 133Q540 145 543 179L509 190H88Q63 184 66 153Z"
                fill="#c7d2d0"
                stroke="#7d9190"
                strokeWidth="2"
              />
              <path d="M204 111L249 61H286L283 111H204Z" fill="#324c4d" />
              <path d="M298 61H363Q389 69 416 104L298 111V61Z" fill="#3e5859" />
              <path d="M297 63L387 80" stroke="#89a4a0" strokeWidth="3" />
              <path
                d="M79 150L165 137H461L526 149M293 117V168M418 113L449 164"
                stroke="#8ca4a1"
                strokeWidth="2"
              />
              <path
                d="M79 153H129L119 166H73M491 139L531 154L534 164H505Z"
                fill="#f4f7e9"
              />
              <path
                d="M221 183H429M89 185H123M502 182H531"
                stroke="#344b4b"
                strokeWidth="6"
              />
              <circle cx="172" cy="179" r="40" fill="#223434" />
              <circle cx="172" cy="179" r="24" fill="#9caeaa" />
              <circle cx="172" cy="179" r="14" fill="#425856" />
              <circle cx="465" cy="179" r="40" fill="#223434" />
              <circle cx="465" cy="179" r="24" fill="#9caeaa" />
              <circle cx="465" cy="179" r="14" fill="#425856" />
            </svg>
          </div>
          <div className="ai-bubble">
            <span className="ai-star">
              <Sparkles size={15} />
            </span>
            <div>
              Meet your AI car companion
              <small>The right car starts with a conversation.</small>
            </div>
            <ArrowUpRight size={12} />
          </div>
        </div>
        <span className="art-caption">INTERFACE CONCEPT / AUTOCAR</span>
      </div>
    );
  if (slug === "quiztfy")
    return (
      <div className="project-art art-quiz" aria-hidden="true">
        <div className="quiz-orbit orbit-one" />
        <div className="quiz-orbit orbit-two" />
        <div className="quiz-window">
          <div className="quiz-top">
            <strong>
              quiztfy<span>✳</span>
            </strong>
            <span className="quiz-avatar">H</span>
          </div>
          <div className="quiz-greeting">A little challenge for your day.</div>
          <h3>
            Ready to test
            <br />
            your curiosity?
          </h3>
          <div className="quiz-progress">
            <span />
          </div>
          <div className="quiz-question">
            <div className="micro">
              QUESTION 01 / 10 <span>SCIENCE & TECH</span>
            </div>
            <h4>
              Great ideas start with
              <br />a good question.
            </h4>
            {[
              "Explore something new",
              "Connect the dots",
              "Keep asking why",
            ].map((s, i) => (
              <div
                className={`quiz-option ${i === 1 ? "selected" : ""}`}
                key={s}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {s}
                {i === 1 && <Check size={12} />}
              </div>
            ))}
            <div className="quiz-next">
              Next question <ArrowRight size={12} />
            </div>
          </div>
        </div>
        <span className="art-caption">INTERFACE CONCEPT / QUIZTFY</span>
      </div>
    );
  if (slug === "dyy-fragrance")
    return (
      <div className="project-art art-fragrance" aria-hidden="true">
        <div className="fragrance-top">
          DYY<span>THE ART OF EVERYDAY</span>
          <Plus size={14} />
        </div>
        <div className="fragrance-type">
          Leave a<br />
          <i>little mystery.</i>
        </div>
        <div className="bottle-shadow" />
        <div className="bottle">
          <div className="bottle-cap" />
          <div className="bottle-neck" />
          <div className="bottle-glass">
            <div className="bottle-label">
              DYY<span>NO. 01</span>
              <small>
                EAU DE PARFUM
                <br />
                50 ML — 1.7 FL.OZ.
              </small>
            </div>
          </div>
        </div>
        <span className="art-caption">INTERFACE CONCEPT / DYY FRAGRANCE</span>
      </div>
    );
  return (
    <div className="project-art art-news" aria-hidden="true">
      <div className="news-window">
        <aside>
          <Command size={20} />
          <span className="news-active">
            <LayoutDashboard size={13} />
          </span>
          <FileText size={13} />
          <BarChart3 size={13} />
        </aside>
        <div className="news-main">
          <div className="news-nav">
            Workspace <span>HN</span>
          </div>
          <div className="news-title">
            <div>
              <small>YOUR EDITORIAL SPACE</small>
              <h3>Good stories start here.</h3>
            </div>
            <span>
              <Plus size={10} /> New story
            </span>
          </div>
          <div className="news-stats">
            {[
              ["Total stories", "24"],
              ["Published", "18"],
              ["In progress", "06"],
            ].map(([a, b]) => (
              <div key={a}>
                <small>{a}</small>
                <strong>{b}</strong>
                <span>↗ This month</span>
              </div>
            ))}
          </div>
          <div className="news-search">
            <span>
              <Search size={10} /> Search stories
            </span>
            <SlidersHorizontal size={11} />
          </div>
          {[
            "Building better digital experiences",
            "A fresh perspective on technology",
            "Small ideas, meaningful impact",
          ].map((s, i) => (
            <div className="news-row" key={s}>
              <div className={`news-thumb thumb-${i}`} />
              <div>
                {s}
                <small>Editorial · 4 min read</small>
              </div>
              <span>{i === 2 ? "Draft" : "Published"}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="art-caption">
        INTERFACE CONCEPT / CONTENT MANAGEMENT
      </span>
    </div>
  );
}
