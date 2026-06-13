import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/assets/free-range-dev-logo-no-background.png";

const navLinks = [
  { href: "/studio", label: "Studio" },
  { href: "#building", label: "What I'm Building" },
  { href: "https://www.thefreerangedev.store/", label: "Tools + Gear" },
  { href: "https://www.youtube.com/@TheFreeRangeDev", label: "Content" },
];

const pillars = [
  {
    number: "01",
    title: "Build Systems",
    body: "Software, automation, and developer tooling that do the heavy lifting - so you're not babysitting your business.",
  },
  {
    number: "02",
    title: "Earn Freely",
    body: "Sustainable income systems - services, products, and leverage built to last instead of burn you out.",
  },
  {
    number: "03",
    title: "Live Intentionally",
    body: "Location independence, low-overhead living, and honest experiments in designing a life with room to breathe.",
  },
];

const buildingCards = [
  {
    href: "/studio",
    label: "Studio",
    title: "Free Range Studio",
    live: true,
    body: "AI workflow automation built in days, not months. CRM integrations, accounting workflows, and custom API orchestration for small teams.",
    action: "Explore the Studio",
  },
  {
    href: "https://www.youtube.com/@TheFreeRangeDev",
    label: "Content",
    title: "The Squad",
    body: "Dev and entrepreneur hacks, build-in-public experiments, and honest lessons from designing a freer way to work.",
    action: "Watch + follow",
  },
  {
    href: "https://www.thefreerangedev.store/",
    label: "Store",
    title: "Tools + Gear",
    body: "The kit, software, and resources I actually use - curated for builders chasing the same kind of freedom.",
    action: "Browse the store",
  },
];

const isExternal = (href: string) => href.startsWith("http");

export default function Home() {
  return (
    <main className="home-redesign">
      <nav className="home-nav" aria-label="Primary navigation">
        <div className="home-wrap home-nav-inner">
          <Link className="home-brand-lockup" href="/">
            <Image
              src={LOGO_SRC}
              alt="The Free Range Dev logo"
              width={84}
              height={84}
              priority
            />
            <span className="home-brand-name">The Free Range Dev</span>
          </Link>
          <input
            className="home-nav-check"
            id="home-nav-toggle"
            type="checkbox"
          />
          <label
            className="home-nav-toggle"
            htmlFor="home-nav-toggle"
            aria-label="Toggle menu"
          >
            Menu
          </label>
          <div className="home-nav-links" id="home-navlinks">
            {navLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                rel={isExternal(href) ? "noopener noreferrer" : undefined}
                target={isExternal(href) ? "_blank" : undefined}
              >
                {label}
              </a>
            ))}
            <a className="home-nav-cta" href="/studio">
              Work with me
            </a>
          </div>
        </div>
      </nav>

      <header className="home-hero">
        <div className="home-wrap home-hero-inner">
          <span className="home-kicker">Software · Systems · Freedom</span>
          <h1>
            From Command Line
            <br />
            to <em>Coast Line</em>
          </h1>
          <p className="home-lede">
            Breaking stuff, building income, living free - together. Software,
            automation, and systems for designing a freer way to build, earn,
            and live.
          </p>
          <div className="home-actions">
            <a className="home-btn home-btn-primary" href="/studio">
              Explore the Studio <span className="home-arrow">→</span>
            </a>
            <a
              className="home-btn home-btn-ghost"
              href="https://www.youtube.com/@TheFreeRangeDev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
        <div className="home-hero-fade" />
      </header>

      <section className="home-section">
        <div className="home-wrap">
          <div className="home-section-head">
            <span className="home-kicker">The Approach</span>
            <h2>
              Freedom, built on <em>systems</em>
            </h2>
            <p>
              Not hype, not theory - practical pathways toward more autonomy,
              optionality, and resilience.
            </p>
          </div>
          <div className="home-pillars">
            {pillars.map(({ number, title, body }) => (
              <article className="home-pillar" key={number}>
                <div className="home-pnum">{number}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" id="building">
        <div className="home-wrap">
          <div className="home-section-head">
            <span className="home-kicker">In Motion</span>
            <h2>
              What I&apos;m <em>building</em>
            </h2>
          </div>
          <div className="home-cards">
            {buildingCards.map(({ href, label, title, live, body, action }) => (
              <a
                className="home-card"
                href={href}
                key={title}
                rel={isExternal(href) ? "noopener noreferrer" : undefined}
                target={isExternal(href) ? "_blank" : undefined}
              >
                <span className="home-clabel">{label}</span>
                <h3>
                  {title}{" "}
                  {live ? <span className="home-live">LIVE</span> : null}
                </h3>
                <p>{body}</p>
                <span className="home-go">
                  {action} <span className="home-arrow">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="home-join">
        <div className="home-wrap">
          <span className="home-kicker">Join the Squad</span>
          <h2>
            Build your <em>freedom</em>, together
          </h2>
          <p>
            Follow along as I break things, build income, and figure out a
            freer life - out loud and in public.
          </p>
          <div className="home-actions">
            <a
              className="home-btn home-btn-primary"
              href="https://www.youtube.com/@TheFreeRangeDev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Join on YouTube <span className="home-arrow">→</span>
            </a>
            <a className="home-btn home-btn-ghost" href="/studio">
              Work with the Studio
            </a>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-wrap">
          <div className="home-foot-top">
            <div className="home-foot-brand">
              <Image
                src={LOGO_SRC}
                alt="The Free Range Dev logo"
                width={96}
                height={96}
              />
              <p>
                Systems-first builder making freer ways to build, earn, and
                live. Calm truth from someone figuring it out honestly while
                building.
              </p>
            </div>
            <div className="home-foot-col">
              <h3>Explore</h3>
              <a href="/studio">Free Range Studio</a>
              <a
                href="https://www.thefreerangedev.store/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Tools + Gear
              </a>
              <a href="#building">What I&apos;m Building</a>
            </div>
            <div className="home-foot-col">
              <h3>Connect</h3>
              <a
                href="https://www.youtube.com/@TheFreeRangeDev"
                rel="noopener noreferrer"
                target="_blank"
              >
                YouTube
              </a>
              <a
                href="https://www.tiktok.com/@thefreerangedev"
                rel="noopener noreferrer"
                target="_blank"
              >
                TikTok
              </a>
              <a
                href="https://www.instagram.com/thefreerangedev/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
              <a href="#" data-fill="linkedin">
                LinkedIn
              </a>
              <a href="#" data-fill="github">
                GitHub
              </a>
            </div>
            <div className="home-foot-col">
              <h3>Support</h3>
              <a href="mailto:squad@thefreerangedev.dev">Support Squad</a>
              <a href="mailto:squad@thefreerangedev.dev">Say hello</a>
            </div>
          </div>
          <div className="home-foot-bottom">
            <span>© 2026 The Free Range Dev, LLC</span>
            <span>From the command line to the coast line</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
