import Image from 'next/image';
import Link from 'next/link';

const LOGO_SRC = '/assets/free-range-dev-logo-no-background.png';

const navLinks = [
  { href: '/studio', label: 'Studio' },
  { href: '/#building', label: "What I'm Building" },
  { href: 'https://thefreerangedev.com/store', label: 'Tools + Gear' },
  { href: '/#join-the-squad', label: 'Content' },
];

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export const newTabProps = (href: string) =>
  isExternalHref(href) ? { rel: 'noopener noreferrer', target: '_blank' } : {};

export const SectionDivider = () => (
  <div className="home-wrap" aria-hidden="true">
    <div className="home-section-divider" />
  </div>
);

export function HomeNav() {
  return (
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
        <input className="home-nav-check" id="home-nav-toggle" type="checkbox" />
        <label
          className="home-nav-toggle"
          htmlFor="home-nav-toggle"
          aria-label="Toggle menu"
        >
          Menu
        </label>
        <div className="home-nav-links" id="home-navlinks">
          {navLinks.map(({ href, label }) => (
            <a key={label} href={href} {...newTabProps(href)}>
              {label}
            </a>
          ))}
          <a className="home-nav-cta" href="/studio">
            Work with me
          </a>
        </div>
      </div>
    </nav>
  );
}

type HomeFooterProps = {
  tagline?: string;
};

export function HomeFooter({ tagline = 'From Command Line to Coast Line' }: HomeFooterProps) {
  return (
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
              Systems-first builder creating more sustainable ways to build, earn, and
              live.
            </p>
          </div>
          <div className="home-foot-col">
            <h3>Explore</h3>
            <Link href="/studio">Free Range Studio</Link>
            <a
              href="https://thefreerangedev.com/store"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tools + Gear
            </a>
            <Link href="/#building">What I&apos;m Building</Link>
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
          </div>
          <div className="home-foot-col">
            <h3>Support</h3>
            <a href="#supportModal" data-support-modal-trigger>
              Support Squad
            </a>
          </div>
        </div>
        <div className="home-foot-bottom">
          <span>© 2026 The Free Range Dev, LLC</span>
          <span>{tagline}</span>
        </div>
      </div>
    </footer>
  );
}
