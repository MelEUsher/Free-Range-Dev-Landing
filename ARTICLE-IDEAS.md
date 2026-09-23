# Article Ideas and Topics

This file is the durable record of which articles are published, which topics are queued, and
which topics have been ruled out for The Free Range Dev's articles on this site.

It is not a published page. It lives at the repository root and never renders on the live site,
because only markdown files in `content/articles/` build article pages. Do not move this file
into `content/articles/`.

It is the primary source of article ideas for the Wednesday scheduled planning session. That
session runs fresh in the cloud and cannot count on reaching Mel's project memory, so this file,
not memory, is what tells it what already exists.

Flint maintains this file and Hawk reviews the changes. Mel rules on every topic.

A queued topic is a subject, not a brief. Mel sets the angle in conversation when the piece comes
up, so no briefs are recorded here. A one-line angle may sit under a queued entry once Mel has
approved it in a plan.

Cadence, Mel's ruling 2026-08-26: a category may go quiet for a week, so long as every category
gets at least one article per month.

Status markers: `- [ ] **IN PROGRESS**` is written and waiting on Mel, `- [ ] **NEXT**` is the
next piece to be written in that category, `- [ ] **SCHEDULED (YYYY-MM-DD)**` is dated for a
specific day, an untagged `- [ ]` is further back in the queue, and `- [x]` means published and
nothing else.

## Automation & Tech

Registry key: `automation-tech`

- [x] How AI Workflow Automation Saves Time for Small Teams (2026-07-20, `ai-workflow-automation-small-teams`)
- [x] Designing GoHighLevel Automations That Survive Real Customers (2026-07-29, `designing-gohighlevel-automations-that-survive-real-customers`)
- [x] What to Automate First: A Small Business Owner's Order of Operations (2026-08-05, `what-to-automate-first`)
- [x] The Seams Between Your Tools: Where Small Businesses Lose Customers (2026-08-12, `the-seams-between-your-tools`)
- [x] Where Your API Key Should Live (2026-08-19, `where-your-api-key-should-live`)
- [x] Should Your Small Business Add an AI Chatbot? (2026-09-02, `should-your-small-business-add-an-ai-chatbot`)

Nothing is queued in this category. The next Automation & Tech slot needs a topic from Mel.

## Sales & Persuasion

Registry key: `sales-persuasion`

- [x] When Discovery Decides the Sale (2026-08-19, `when-discovery-decides-the-sale`)
- [x] Good Selling Doesn't Feel Like Being Sold To (2026-08-26, `good-selling-doesnt-feel-like-being-sold-to`)
- [ ] **SCHEDULED (2026-09-03)** Creative Innovation as Market Positioning (working title)
  - Next in line for this category, Mel's call 2026-08-26, and dated to 2026-09-03 at her call on
    2026-09-02. The title is a working title. The angle is already set and recorded in Mel's
    editorial memory, so it is not restated here.
- [ ] **SCHEDULED (2026-09-09)** The Challenger Sale Piece (working title)
  - No title yet. Standing constraint: Challenger is an article angle, never a credential, and it
    does not go on a resume, a profile, or a cover letter. Scheduled for 2026-09-09, Mel's call
    2026-08-26, dated two weeks out to give her time to get further into the book.
- [ ] Customers Default to Price Only When You Give Them Nothing Else to Weigh
  - Queued 2026-08-26. The idea comes from the Alex Hormozi "Scale or Fail" transcript in Mel's
    sales training folder, near the start of the body.
- [ ] When I Tell Someone Not to Buy
  - The subject is disqualification. Standing constraint: the framing stays on what
    disqualification does for the buyer, never on the referrals it earns.
- [ ] What an Objection Is Telling You
  - Queued as a later piece, not a next piece. It is publishable only if it opens inside one
    specific conversation and never states the axiom.
- [ ] Composure in High-Stakes Conversations
  - Queued as a later piece. It carries the heaviest accuracy constraints.

## CS & Programming

Registry key: `cs-programming`

This category holds software engineering learning content: what the languages are, where they came
from, what you can build with them, and how to learn them. It is a third category, separate from
Automation & Tech and Sales & Persuasion, so that neither of those is diluted. The audience is
small teams, entrepreneurs, and people getting into development, written for someone who may never
take a job as a developer but wants to understand the work and, optionally, do it. Every article
opens with what a small team can ship using the language and which job titles ask for it.

The cadence is 2 to 3 articles per week during Phase 1. Phase 2 cadence follows book completion,
not a calendar.

There are two phases:

- Phase 1 is programming languages: twelve articles (10 core, 2 optional), grouped by primary use,
  each with history, what it is for, who hires for it, and vetted learning resources. This phase
  runs first, in the order below.
- Phase 2 is curriculum intro articles. After the language series, the category shifts to one
  conversational intro article per micro course of Mel's book-based CS / software engineering
  curriculum. These are written as each book is finished and are not queued with titles yet.

Mel named the category "CS & Programming" with the key `cs-programming`, so its topic page is
`/articles/topics/cs-programming` once its first article publishes. Articles in this category may
use a custom topic image instead of the standard title card, and they are also posted to LinkedIn.

Open decision for Mel: whether the category gets its own Resend subscription topic or segment, and
whether existing subscribers are opted in by default.

Source material: the demand data, per-language fact blocks (creator, year, problem solved, steward,
with sources), and verified learning resources for every Phase 1 article live in Hawk's report
`hawk-language-series-plan.md`, in the `AI_Agency/Plans/Programming Curricula` folder on Mel's
computer. Writers pull from it rather than re-researching.

### Phase 1: programming languages

Working titles are placeholders for Mel to replace. Order numbers are the publication order.

- [ ] 01. The Page Itself: HTML and CSS (working title)
  - It covers HTML and CSS. This is the zero-prerequisite entry point. Structure and style are
    taught as one skill, and every later web article assumes it.
- [ ] 02. Making the Page Do Things: JavaScript and TypeScript (working title)
  - It covers JavaScript and TypeScript: the language of the browser and the typed version that
    compiles to it. This is the largest hiring cluster after Python.
- [ ] 03. The Everything Language: Python (working title)
  - It covers Python: automation, data, AI, and web back ends in one readable language. Python is
    the number one language in job postings. R gets a mention as the data-analysis alternative.
- [ ] 04. Talking to Data: SQL (working title)
  - It covers SQL, which is a different, declarative way of thinking. SQL is required alongside
    nearly every other language and is the least-taught skill relative to how often postings ask
    for it.
- [ ] 05. Scripting the Machine: Bash and PowerShell (working title)
  - It covers Bash and PowerShell: automating the operating system itself, one shell per platform.
    This closes the automation trio of Python, SQL, and shell.
- [ ] 06. The Enterprise Workhorse: Java (working title)
  - It covers Java, the language behind large business systems and Android's foundation. This is
    the first of the compiled, typed back-end languages.
- [ ] 07. The Microsoft Stack: C# (working title)
  - It covers C#: .NET, Windows, and game engines. The comparison with Java is the story.
- [ ] 08. The Web's Back Office: PHP (working title)
  - It covers PHP, the language under WordPress and much of the small-business web the reader
    already runs. Ruby gets a mention as the other 2000s web workhorse.
- [ ] 09. Built for the Cloud: Go (working title)
  - It covers Go, Google's answer to slow builds and multicore machines, and the language of
    infrastructure tooling.
- [ ] 10. Close to the Metal: C and C++ (working title)
  - It covers C and C++, the languages operating systems, browsers, and games are built in, and
    why they are seldom a first language.
- [ ] 11. **OPTIONAL** The New Systems Language: Rust (working title)
  - It covers Rust: memory safety without garbage collection. Posting volume is low, interest is
    high, and C++ is feeling the pressure.
- [ ] 12. **OPTIONAL** Building for Phones: Kotlin and Swift (working title)
  - It covers Kotlin and Swift: native mobile, one language per platform, each with a parent
    article earlier in the series.

### Phase 2 placeholder: curriculum intro articles

- The format is one conversational intro article per micro course, explaining what the course
  covers, who it is for, and what the reader will be able to do afterward.
- The CTA is soft and sits at the end: buy the book, a la carte or as part of a bundle. A bundle
  equals one course.
- Articles are written as each book is finished. No titles are queued until a book is done.
- Queue entries will follow the same list format as Phase 1 when added.

## Ruled Out

These topics have been decided against, so that nobody proposes them again.

- What Transfers Across Industries
  - Ruled out as an article 2026-08-21. It is the LinkedIn About section in article form: it
    teaches nothing, it turns positioning into an argument the reader can disagree with, and it
    answers an objection the reader has not raised. It is kept as an interview answer and as
    About copy.

## How This File Is Maintained

- When an article publishes, Flint checks off its entry in the same pull request that adds the
  article, and records the date and the slug.
- A Monday 8:00 a.m. Central scheduled task syncs new ideas from Mel's project memory into this
  file, so anything she queues during the week lands here. That task is bound to Mel's computer,
  so project memory is reachable whenever her desktop is connected, and on a morning it cannot be
  reached the task reports the miss to Mel instead of skipping in silence.
- The Wednesday planning session has no such binding. It runs fresh in the cloud and cannot reach
  project memory, which is the difference that makes this file necessary. Monday can read memory;
  Wednesday can only read this repository.
- Mel adds ideas by telling Cadence to add them to the article queue.
- The Wednesday session reads this file first. If a category's queue is empty, it asks Mel for a
  topic instead of inventing one.
