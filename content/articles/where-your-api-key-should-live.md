---
title: "Where Your API Key Should Live"
date: "2026-08-19"
description: "Everything a browser downloads can be read, including an API key in your front-end code. Here's where the key belongs, and what to do about one that leaked."
category: "automation-tech"
---

Building something that talks to an AI model is easier than it has ever been. You describe what you want, you get working code back, and inside an afternoon you have a page that answers questions or sorts input or drafts something for you. Somewhere in that afternoon, the service you're calling asks you for an API key.

It's easy to paste that key wherever the code seems to want it and keep going. Nothing about the moment announces itself as important. The app works. The page loads. The answers come back.

That's the moment worth slowing down for. The API key is the one piece of your project that can cost you money in someone else's hands, and where you put it decides whether that happens.

## What an API Key Is

When your app calls an outside service, that service needs to know who's asking. The API key is the answer to that question. It's a long string of characters the provider issues to your account, and every request carrying it goes on your record.

The way I explain it is this: an API key is a key to a door, and the key carries a tracker. Whoever holds it can open the door. Whatever happens on the other side gets billed back to the account the tracker points to, which is yours.

Both halves of that matter. If you're on a paid plan, another person's usage lands on your invoice. If you're on a free tier, another person's usage eats the quota you were counting on, and your app stops answering for the people you built it for. Providers also suspend accounts for abuse, so the trouble can arrive as a shutdown rather than a bill.

Some keys open more than a metered service. A key to your email platform, your CRM, or your database reaches customer records. The same rule covers all of them, and the stakes climb with what the key can touch.

Take a common case. You've added a first-level support chatbot to your site, running on an Anthropic API key. If that key sits in the front-end code, anyone who opens the page can lift it and run their own usage through it, on your account and against your bill.

There's a detail here that gets mistaken for a safety net. Anthropic's API refuses calls made straight from a browser unless you opt in with a specific header. That stops your page from working. Whoever copies the key out of your bundle runs it from their own terminal, where the restriction doesn't apply.

## Everything the Browser Downloads Is Readable

The front end is everything a visitor's browser downloads to display your page: the HTML, the CSS, the JavaScript. All of it arrives on their machine, where it can be read. Anyone can open developer tools and view the source of every script your page loaded. The Network tab goes further and shows every request the page made, including the headers those requests carried.

So an API key placed in front-end code is the key left under the mat. The door is locked, and you can tell yourself the key is out of sight. Everyone knows to look under the mat, and automated scanners are far more thorough than a person.

Minifying the code changes nothing. Minifiers shorten variable names, and a key is a literal string that survives intact.

There's one version of this mistake that catches careful people, because it looks like the safe approach. Front-end build tools read variables from a `.env` file and bake a specific subset of them into the browser bundle, and the usual way they choose is by prefix. In Next.js the prefix is `NEXT_PUBLIC_`. In Vite it's `VITE_`. In Create React App, which the React team retired in 2025 but which plenty of existing projects still run, it's `REACT_APP_`. A variable carrying one of those prefixes is inlined into the code the browser downloads, as plain readable text. The `.env` file keeps the value out of your source code, and the prefix puts it into the bundle anyway.

A small number of keys are designed to sit in the browser, such as Stripe's publishable key, which is built to be seen and can do little on its own. The provider's documentation says so when that's the case. If it doesn't, treat the key as private.

## Where the Key Lives

The key stays in your pocket, and the pocket is the backend.

A backend is code that runs on a server rather than on a visitor's machine. The visitor sends it a request and receives a response, and the source never leaves the server. That property is the whole reason a secret can live there.

The pattern looks like this, and it's the same whether you're calling an AI model, a payment processor, or a weather service.

1. Someone uses your page, and the page sends their input to an endpoint you own.
2. Your backend reads the key from its own environment, attaches it, and calls the outside service.
3. The outside service responds to your backend.
4. Your backend sends the result on to the page.

The browser talks to your endpoint. It never reaches the provider's URL and never receives the key. Only the result comes back.

You don't need to run a server for this. A serverless function is a single file that runs on demand when your page calls it, and it goes back to sleep afterward. On Vercel, a file in an `/api` folder at the project root becomes a live endpoint when you deploy, and in Next.js the equivalent file lives at `app/api/<name>/route.js` instead. On Netlify, the file goes in `netlify/functions`, and it answers at `/.netlify/functions/<name>` unless you declare a custom path in the function's own config. Your host stores the key as an environment variable in its dashboard, and your function reads it at run time.

I wrote a public tutorial that builds this end to end with a free Gemini key and one Vercel function. The code is at [github.com/MelEUsher/ai-api-tutorial](https://github.com/MelEUsher/ai-api-tutorial), and it runs live at [ai-api-tutorial.vercel.app](https://ai-api-tutorial.vercel.app). The line that carries the entire lesson is in the front-end script, where the page calls its own backend at `/api/recommend` and never touches the Gemini URL.

## The Two Files That Keep Your Key off GitHub

A `.env` file is a plain-text file at the root of your project holding one variable per line, like `GEMINI_API_KEY=your_key_here`. Nothing about the file format makes it secret. It's ordinary text that anyone with the file can read. What keeps it private is that it stays on your machine and on your host, and never enters your repository.

A `.gitignore` file is the list of paths Git leaves alone. Put `.env` on its own line, along with anything else that should stay local, such as `node_modules/` and your host's build folder. From then on, Git won't offer to commit the file and won't push it.

One detail decides whether that protects you. `.gitignore` governs files Git isn't already tracking. If `.env` was committed even once, adding it to `.gitignore` afterward has no effect on the copy already in the repository. You untrack it with `git rm --cached .env`, then commit and push. That takes the file off the branch going forward. The file stays on your own machine, and the copy in the earlier commits remains in the history. Then you treat the key as leaked, which is what the next section covers.

The habit that prevents all of this takes two seconds. Run `git status` before you commit and read the list of files. If `.env` appears there, stop and fix the ignore file before you go any further.

GitHub gives you one more layer for free. Push protection is on by default for user accounts, and it blocks a push to a public repository when it recognizes a secret in the contents, telling you what it found. Treat it as a backstop rather than a plan, for two reasons: it catches only key formats it has learned to recognize, and it offers you a way to push anyway, which is a button a person in a hurry will click. The two files above are what keep the secret out of the commit in the first place.

## Rotating a Key That Has Already Leaked

Here's the part people learn the hard way. Deleting the commit doesn't remove the key. Git keeps the full history, and a later commit that removes the line is a new commit rather than an erasure. The earlier commit still contains the key and stays readable to anyone with the repository. Anyone who cloned or forked it before you noticed holds a copy on their own machine. Tools exist for rewriting history, `git filter-repo` and the BFG among them, and they don't reach any of those copies.

So the order is rotation first and cleanup second.

1. Open the provider's dashboard, create a new key, and revoke the old one. Once the old key is revoked, the copy sitting in your history is a dead string that opens nothing.
2. Confirm the revocation took effect and didn't start a grace period. Stripe, for one, keeps both the old and new keys working for up to seven days unless you set the old one to expire immediately.
3. Put the new key in your local `.env` and in the environment variables on your host, then redeploy.
4. Clean up the repository afterward, once nothing is at stake.

Do step one the same hour you notice. Automated scanners watch public repositories for the recognizable shapes of provider keys, which is why exposure gets measured in minutes rather than days. A private repository buys you a little room, though not much, since everyone with access has the key, and repository visibility gets changed by accident.

There are two things rotation doesn't do. It doesn't undo usage that already happened on the leaked key, so check the provider's usage or request log to see what ran. It also covers only credentials with a revoke button. If that same `.env` also held a database URL or a signing secret, each of those needs its own remedy.

## How to Check Your Own Project

You can audit what you've already shipped in about ten minutes. Start by copying a distinctive slice of ten or twelve characters out of your key, from somewhere past the vendor prefix at the start. Don't use the first eight. Providers share those across every key they issue, so `sk-ant-a` or `sk_live_` will match documentation, sample code, and somebody else's key, while telling you nothing about your own.

Load your deployed site in a browser and open developer tools. Click through your app's routes first, so any code that loads on demand has loaded. Then use the global search in the Sources panel, which searches every resource the page has pulled in at once. In Chrome, that's Command Option F on a Mac and Control Shift F on Windows. Search for your slice. Anything that turns up is public. While you're reading, keep one thing in mind. If your build ships source maps, the panel may be showing you a reconstruction of your original files rather than the bundle the browser actually downloaded.

Search your project folder for the same slice and note every file it appears in. Anything in an HTML file, a front-end script, or a variable carrying a `NEXT_PUBLIC_`, `VITE_`, or `REACT_APP_` prefix is exposed.

Search your Git history. Run `git fetch --all` first, so you're searching branches you may never have pulled. Then run `git log -S "your slice" --all`, which lists any commit where that string entered or left the code. An empty result means the key isn't in your reachable history, and that doesn't mean it's gone. If you ever amended, reset, or force-pushed the commit that held it, the object still exists, and a commit that reached GitHub stays reachable by its SHA even after a force-push or a deleted fork. Rotation is what settles it, which is why it comes first.

Open `.gitignore` and confirm `.env` is listed. Then open your host's dashboard and confirm the key is stored there as an environment variable, where your backend reads it at run time.

If any of those checks turn up a key, you know the sequence now. Create a new one, revoke the old one, confirm the revocation took effect and didn't start a grace period, put the new key on the backend and redeploy, and then go clean up.

I am Melissa Usher with The Free Range Dev, LLC. I build automation and AI integrations for small businesses, and a good share of that work is the part customers never see, like keeping the keys to your accounts in your own pocket. If that's the kind of help you're looking for, you can find me at thefreerangedev.com.
