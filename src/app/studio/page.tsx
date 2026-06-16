import type { Metadata } from 'next';
import {
  HomeFooter,
  HomeNav,
  SectionDivider,
} from '@/app/components/HomeChrome';
import SupportModalRoot from '@/app/components/SupportModalRoot';

const offerings = [
  {
    label: 'CRM',
    title: 'CRM Integration',
    body: 'Connect and automate your customer pipeline so leads and follow-ups run themselves',
  },
  {
    label: 'Accounting',
    title: 'Accounting Workflow',
    body: 'Automate invoicing, reconciliation, and reporting busywork',
  },
  {
    label: 'APIs',
    title: 'Custom API Orchestration',
    body: 'Wire your tools together into one system that runs without babysitting',
  },
];

export const metadata: Metadata = {
  title: 'Free Range Studio | The Free Range Dev',
  description:
    'AI-powered workflow automations for CRM, accounting, and custom API orchestration.',
};

export default function StudioPage() {
  return (
    <>
      <main className="home-redesign studio-page">
        <HomeNav />

        <header className="home-hero studio-hero">
          <div className="home-wrap home-hero-inner">
            <span className="home-kicker">The Free Range Studio</span>
            <h1>
              Workflow Automations That Run 24/7
              <br />
              <em>Built to Last, Delivered Fast</em>
            </h1>
            <p className="home-lede">
              AI-powered automations for businesses drowning in manual work.
            </p>
            <div className="home-actions">
              <a
                className="home-btn home-btn-primary"
                href="#supportModal"
                data-support-modal-trigger
              >
                Start a project <span className="home-arrow">→</span>
              </a>
            </div>
          </div>
          <div className="home-hero-fade" />
        </header>
        <SectionDivider />

        <section className="home-section" aria-labelledby="studio-offerings">
          <div className="home-wrap">
            <div className="home-section-head">
              <span className="home-kicker">What We Build</span>
              <h2 id="studio-offerings">
                Practical Automations for <em>daily work</em>
              </h2>
            </div>
            <div className="home-cards">
              {offerings.map(({ label, title, body }) => (
                <article className="home-card" key={title}>
                  <span className="home-clabel">{label}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <SectionDivider />

        <section className="home-join" id="start-a-project">
          <div className="home-wrap">
            <span className="home-kicker">Start Here</span>
            <h2>
              Bring the manual work. <em>We&apos;ll map the system.</em>
            </h2>
            <p>
              Send over the workflow that is eating time, and we&apos;ll talk through
              what can be automated first.
            </p>
            <div className="home-actions">
              <a
                className="home-btn home-btn-primary"
                href="#supportModal"
                data-support-modal-trigger
              >
                Start a project <span className="home-arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        <HomeFooter tagline="A division of The Free Range Dev, LLC" />
      </main>
      <SupportModalRoot />
    </>
  );
}
