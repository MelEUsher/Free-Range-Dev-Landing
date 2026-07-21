import { HomeFooter, HomeNav, newTabProps, SectionDivider } from './components/HomeChrome';
import SupportModalRoot from './components/SupportModalRoot';

const pillars = [
  {
    number: '01',
    title: 'Build Systems',
    body: "Software, automation, and developer tooling that do the heavy lifting - so you're not babysitting your business.",
  },
  {
    number: '02',
    title: 'Earn Freely',
    body: 'Sustainable income systems - services, products, and leverage built to last instead of burn you out.',
  },
  {
    number: '03',
    title: 'Live and Build Intentionally',
    body: 'Location fluidity, low-overhead building, and designing a business with room to breathe.',
  },
];

const buildingCards = [
  {
    href: '/studio',
    label: 'Studio',
    title: 'Free Range Studio',
    live: true,
    body: 'AI workflow automation built fast, CRM integrations, accounting workflows, and custom API orchestration.',
    action: 'Explore the Studio',
  },
  {
    href: '#join-the-squad',
    label: 'Content',
    title: 'The Squad',
    body: 'Dev and entrepreneur hacks, build-in-public experiments, and honest lessons from designing a freer way to work.',
    action: 'Watch + follow',
  },
  {
    href: '/store',
    label: 'Store',
    title: 'Tools + Gear',
    body: 'Free Range Dev resources, gear, and tools for building a more sustainable way to work.',
    action: 'Visit the Store',
  },
];

export default function Home() {
  return (
    <>
      <main className="home-redesign">
        <HomeNav />

      <header className="home-hero">
        <div className="home-wrap home-hero-inner">
          <span className="home-kicker">Software · Systems · Freedom</span>
          <h1>
            From Command Line
            <br />
            to <em>Coast Line</em>
          </h1>
          <p className="home-lede">
            Software, automations, and systems for designing a more sustainable way to
            build, earn, and live.
          </p>
          <div className="home-actions">
            <a
              className="home-btn home-btn-primary"
              href="/studio"
              {...newTabProps('/studio')}
            >
              Explore the Studio <span className="home-arrow">→</span>
            </a>
            <a className="home-btn home-btn-ghost" href="#join-the-squad">
              Join the Journey
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
              Freedom, Built on <em>systems</em>
            </h2>
            <p>Practical pathways toward more autonomy and resilience</p>
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
      <SectionDivider />

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
              <a className="home-card" href={href} key={title} {...newTabProps(href)}>
                <span className="home-clabel">{label}</span>
                <h3>
                  {title} {live ? <span className="home-live">LIVE</span> : null}
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
      <SectionDivider />

      <section className="home-join" id="join-the-squad">
        <div className="home-wrap">
          <span className="home-kicker">Join the Squad</span>
          <h2>
            Build Your <em>freedom</em>
          </h2>
          <p>
            Follow along as I fix broken things, build income, and create more sustainable
            ways to build.
          </p>
          <div className="home-actions">
            <a
              className="home-btn home-btn-ghost"
              href="https://www.youtube.com/@TheFreeRangeDev"
              rel="noopener noreferrer"
              target="_blank"
            >
              YouTube <span className="home-arrow">→</span>
            </a>
            <a
              className="home-btn home-btn-ghost"
              href="https://www.tiktok.com/@thefreerangedev"
              rel="noopener noreferrer"
              target="_blank"
            >
              TikTok <span className="home-arrow">→</span>
            </a>
            <a
              className="home-btn home-btn-ghost"
              href="https://www.instagram.com/thefreerangedev/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Instagram <span className="home-arrow">→</span>
            </a>
            <a
              className="home-btn home-btn-ghost"
              href="https://thefreerangedev.com/studio"
              rel="noopener noreferrer"
              target="_blank"
            >
              Work with the Studio
            </a>
            <a
              className="home-btn home-btn-ghost"
              href="/articles"
              rel="noopener noreferrer"
              target="_blank"
            >
              Articles <span className="home-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

        <HomeFooter />
      </main>
      <SupportModalRoot />
    </>
  );
}
