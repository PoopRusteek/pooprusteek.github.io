// Source of truth for all translatable copy (English is the default locale).
// `ru.ts` is pinned to this shape — add a key here and the build fails until
// it's translated there. TUI-verbatim strings (status badges, slash commands,
// the TerminalDemo script, config snippets, the status bar) stay hard-coded
// in components on purpose: they're the product, not copy.
const en = {
  meta: {
    home: {
      title: 'PoopRusteek 🧻 — free terminal coding agent',
      desc: 'A free, terminal-native coding agent written in Rust. Parallel chats, sub-agents, a GOAL loop, local RAG, MCP and an OpenAI-compatible server. Installers for Windows, macOS and Linux.',
    },
    download: {
      title: 'Download — PoopRusteek 🧻',
      desc: 'Installers and prebuilt binaries for Windows, macOS and Linux, with sizes, SHA-256 digests, update channels and verification steps.',
    },
    rag: {
      title: 'Local RAG — PoopRusteek 🧻',
      desc: 'How the offline semantic layer works: e5-small embeddings, stemmed keyword search and rank fusion over skills, MCP tools and conversation history.',
    },
    serve: {
      title: 'Local API server — PoopRusteek 🧻',
      desc: '/serve turns the agent into an OpenAI-compatible gateway on 127.0.0.1 — model routing, clients, endpoints and the defaults that keep it local.',
    },
    architecture: {
      title: 'Architecture — PoopRusteek 🧻',
      desc: 'One tokio::select! loop, an agent in a spawned task, scoped tool approvals, edit checkpoints, and the numbers behind the claims.',
    },
  },

  common: {
    copyTitle: 'Copy to clipboard',
    copied: '✓ copied',
  },

  os: {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
  },

  nav: {
    themes: 'Theme — the agent’s own presets',
  },

  hero: {
    pill: 'free forever — it talks to chat.deepseek.com, not to your wallet',
    tagline: 'Terminal coding agent · powered by DeepSeek web',
    desc: 'A free, terminal-native alternative to Claude Code — written in Rust. Parallel chats, background sub-agents, an iterative <goal>GOAL</goal> loop, an offline semantic layer over your skills, tools and history, and a local OpenAI-compatible server. No API key. No subscription. No fluff.',
  },

  cta: {
    windows: 'Download for Windows',
    downloads: 'Downloads',
    noAdmin: 'no admin rights',
    portableZip: 'portable .zip',
    intoPath: 'installs into ~/.local/bin',
    unknown: 'Prebuilt for Windows, macOS and Linux',
    allPlatforms: 'all builds & checksums',
  },

  install: {
    kicker: 'installation',
    title: 'One file on Windows. One line everywhere else.',
    sub: 'Prebuilt for five targets, an installer that never asks for admin rights, and a shell script that checks SHA-256 before it puts anything on your PATH.',
    updates: 'It updates itself:',
    more: 'All builds, checksums and channels',
    flagsKicker: 'script options',
    flags: [
      {
        k: '--dir <path>',
        v: 'Install somewhere else (or set POOPRUSTEEK_INSTALL_DIR). /update writes to the same folder afterwards.',
      },
      {
        k: '--channel dev',
        v: 'The rolling build from every push to develop, instead of the last tagged release.',
      },
      {
        k: '--uninstall',
        v: 'Removes the binary, the PATH line it added, and — if you agree — your settings and sessions.',
      },
      {
        k: '--help',
        v: 'Prints the same list. The script is a few hundred readable lines; download it first if you’d rather look before you pipe.',
      },
    ],
    fromSource: 'Rust edition 2024, MSRV 1.91 — or build it yourself and skip releases entirely:',
    windows: {
      steps: [
        'Run pooprusteek-setup.exe. It installs per user into %LOCALAPPDATA%\\Programs, so Windows never asks for admin rights.',
        'One screen: pick the folder, press Install. It adds pooprusteek to your PATH and a Start-menu shortcut that opens in Windows Terminal.',
        'Uninstalling is an entry in Apps — and it asks whether your settings and sessions should go too.',
      ],
      smartscreen:
        'The installer isn’t code-signed yet, so SmartScreen may warn on first run: More info → Run anyway. Every file’s SHA-256 ships with the release if you’d rather trust math than a vendor.',
      altKicker: 'without the wizard',
      altBody: 'Pull the installer from PowerShell and run it — same file, no browser involved.',
      portable: 'Or skip installing altogether: the portable archive carries the same binary —',
    },
    macos: {
      notes: [
        'Installs into ~/.local/bin and adds it to your PATH. /update writes to that same folder, so keep it yours.',
        'Apple Silicon only: ONNX Runtime publishes no prebuilt library for Intel Macs, and the local embedder needs one.',
        'The script verifies the SHA-256 from the release manifest before it moves the binary into place.',
      ],
    },
    linux: {
      notes: [
        'Installs into ~/.local/bin and adds it to your PATH. /update writes to that same folder, so keep it yours.',
        'x86_64 and arm64, glibc 2.39+ — Ubuntu 24.04, Debian 13 or anything newer.',
        'The script verifies the SHA-256 from the release manifest before it moves the binary into place.',
      ],
    },
  },

  zero: {
    kicker: 'monthly bill',
    blurb:
      'Not a trial. Not a free tier with a token ration. PoopRusteek drives the same web chat you already use for free — it just does it from your terminal, with tools.',
    powSolved: 'solved locally',
    ledger: [
      {
        k: 'auth',
        v: 'your own chat.deepseek.com session — cookie + userToken, stored in the OS keyring, encrypted at rest',
      },
      {
        k: 'proof-of-work',
        v: 'the SHA-3 challenge DeepSeek uses to gate its web API is solved locally, on your CPU',
      },
      {
        k: 'api key',
        v: 'none. there is nothing to leak, rotate, or top up',
      },
      {
        k: 'telemetry',
        v: 'none. your code goes to the model you chose and nowhere else',
      },
    ],
  },

  features: {
    kicker: 'capabilities',
    title: 'Small binary. Senior engineer.',
    sub: '«Работает как старший инженер: автономно, хирургически, без воды.» — the system prompt, and it means it.',
    cards: [
      {
        title: 'Parallel conversations',
        body: 'Every chat owns its own forked session and agent task. Background turns keep streaming while you type somewhere else — nothing ever collides.',
      },
      {
        title: 'Sub-agents',
        body: 'Spawn isolated workers — foreground for a clean answer, background for fire-and-forget. Only the conclusion comes back, not the noise.',
      },
      {
        title: 'GOAL loop',
        body: 'A worker writes, an evaluator judges. The loop iterates on concrete feedback until the goal passes, and swaps sessions to escape a dead end.',
      },
      {
        title: 'Local RAG',
        body: 'Multilingual embeddings and keyword search over your skills, MCP tools and every past conversation. Your CPU, offline, after one 120 MB download.',
      },
      {
        title: 'MCP, with OAuth',
        body: 'stdio, HTTP and SSE servers, auto-discovered from eight config sources. Full RFC OAuth, with tokens in the OS keyring instead of a plaintext file.',
      },
      {
        title: 'Markdown skills',
        body: 'Reusable instruction sets found across a dozen agent directories. Pin one by hand, or let the matcher offer it the moment it applies.',
      },
      {
        title: 'Bring any model',
        body: 'DeepSeek web by default; OpenAI-compatible, Anthropic and Gemini endpoints alongside it. Switch from a panel, pick models from the live list.',
      },
      {
        title: 'Local API gateway',
        body: 'One command turns the agent into an OpenAI-compatible server on 127.0.0.1. Every tool that speaks that dialect inherits the free backend.',
      },
      {
        title: 'Surgical edits',
        body: 'Anchored replacements with a real diff preview, not sed. Every write is checkpointed first, so /undo puts the file back the way it was.',
      },
      {
        title: 'Real shell, real PTY',
        body: 'Foreground, background and interactive PTY processes. Dev servers survive turns on an idle TTL; /jobs and /ps list and kill them.',
      },
      {
        title: 'Approvals with a scope',
        body: 'Allow cargo test, not all of bash. A rule is a tool plus a scope — and a compound command gets none, because it only looks like its first word.',
      },
      {
        title: 'Yours to keep',
        body: 'Self-update on two channels, verified against the release manifest. Ten built-in palettes, plus a wizard for one of your own.',
      },
    ],
  },

  rag: {
    teaser: {
      kicker: 'local rag',
      title: 'It finds its own skills, tools and memories.',
      sub: 'A semantic layer that never leaves your machine: multilingual embeddings and stemmed keyword search, fused, over three corpora. One 120 MB model downloads once — after that nothing goes out.',
      pipelineKicker: 'every prompt, before it is sent',
      pipeline: ['prompt', 'dense', 'lexical', 'fusion', 'hint'],
      note: 'Cross-language by construction: a Russian prompt matches an English skill description, and the other way round.',
      more: 'How the retrieval works',
      corpora: [
        {
          k: 'skills',
          v: 'Every outgoing prompt is matched against the whole catalog; the top hits ride along as an ephemeral hint. The model discovers what it can do instead of you enabling it by hand.',
        },
        {
          k: 'mcp tools',
          v: 'With thirty tools connected the prompt carries one line per server. Full schemas arrive only when a tool matches — or when the model asks for them with tool_search.',
        },
        {
          k: 'history',
          v: 'Every saved session is chunked, embedded and kept. Search it yourself with /search, or let the agent recall the fix it already wrote via history_search.',
        },
      ],
      stats: [
        { k: '0.927', v: 'MRR over the skill catalog, from the repo’s own eval harness' },
        { k: '0.836', v: 'MRR over MCP tool descriptions' },
        { k: '120 MB', v: 'downloaded once — e5-small, quantized ONNX' },
        { k: '0', v: 'bytes over the network after that' },
      ],
    },
    page: {
      title: 'A retrieval layer that never phones home',
      lede: 'Embeddings, keyword search and rank fusion, all on your CPU. This is what happens to every prompt before it reaches the model — and what happens when any part of it is missing.',
      stats: [
        { k: '0.927', v: 'MRR — skills' },
        { k: '0.836', v: 'MRR — MCP tools' },
        { k: '120 MB', v: 'model, downloaded once' },
        { k: '3', v: 'corpora, one engine' },
      ],
      pipeline: {
        kicker: 'the pipeline',
        title: 'Two scorers, one fusion',
        lede: 'Neither half is trusted alone: embeddings catch the paraphrase, keywords catch the identifier embeddings smooth away, and reciprocal rank fusion settles the argument.',
        stages: [
          {
            k: 'Dense — e5-small',
            v: 'Quantized ONNX through fastembed, multilingual, 384 dimensions. It runs on a blocking thread, so the event loop never waits on an embedding.',
          },
          {
            k: 'Lexical — TF-IDF',
            v: 'Snowball stemming for English and Russian, so release, releasing and «релиз» collapse onto the same stem before scoring.',
          },
          {
            k: 'Fusion — RRF',
            v: 'Reciprocal rank fusion over both rankings, then a cosine floor (min_dense_score = 0.80) for candidates with no keyword overlap. Top 3 per corpus, per turn.',
          },
        ],
      },
      corpora: {
        kicker: 'three corpora',
        title: 'One engine, three things worth remembering',
        lede: 'Skills, tools and your own history are indexed the same way and searched by the same code — the difference is only what a hit is allowed to do next.',
        items: [
          {
            cmd: '/skills',
            k: 'Skills',
            v: 'Markdown instruction sets discovered across a dozen agent directories. A match rides along as a hint — «this skill may apply, load it with the skill tool» — so capability discovery isn’t your job.',
          },
          {
            cmd: '/mcp · tool_search',
            k: 'MCP tools',
            v: 'Every connected server’s tools are indexed by name and description. Matches get their full schema inlined; everything else stays a one-line summary until it is asked for.',
          },
          {
            cmd: '/search · history_search',
            k: 'Conversation history',
            v: 'Sessions are chunked, embedded and persisted to data_dir/semantic/history.json, incrementally, with a per-session watermark so a restart re-reads a marker and not the corpus.',
          },
        ],
      },
      deferred: {
        kicker: 'deferred schemas',
        title: 'The tools you aren’t using cost nothing',
        lede: 'One Playwright server is about 25 tool definitions. Sending all of them on every request is how a context window disappears before the work starts.',
        before: 'every request, the usual way',
        after: 'every request, deferred',
        note: 'mcp_schemas = "auto" defers above twelve tools, "full" never defers, "deferred" always does. Turn RAG off entirely and full schemas come back on their own — the model is never left guessing what exists.',
      },
      history: {
        kicker: 'your own history',
        title: 'The answer you already found',
        lede: 'The agent has solved things with you before. That transcript is an index, not an archive — both you and the model can query it.',
        rows: [
          {
            k: '/search',
            v: 'A dedicated screen: sort by relevance, newest or oldest, filter by role, collapse to one hit per session. Enter opens that session.',
          },
          {
            k: 'history_search',
            v: 'The same index as a tool, so the model recalls its own past solution without you remembering that it happened.',
          },
          {
            k: 'incremental',
            v: 'Sessions are embedded once and tracked by a watermark; nothing is re-embedded because you restarted.',
          },
          {
            k: 'on disk',
            v: 'data_dir/semantic/history.json — local, plain, and deletable. Nothing about it is a service.',
          },
        ],
      },
      control: {
        kicker: 'controls',
        title: 'Every knob, including the off switch',
        lede: 'A layer you can’t turn off is a liability. This one is four commands and four config keys.',
        rows: [
          {
            k: '/rag',
            v: 'Live status: which corpora are indexed, how large they are, whether the model is ready.',
          },
          {
            k: '/rag on|off',
            v: 'The whole layer — hints, deferred schemas, history indexing. Off means off.',
          },
          {
            k: '/rag reload',
            v: 'Re-verify (or re-download) the model and re-embed skills, MCP tools and history.',
          },
          {
            k: '/rag-limit',
            v: 'The embedder’s batch cap: auto, off, or a fixed number when RAM is tight.',
          },
        ],
      },
      fallback: {
        kicker: 'failure modes',
        title: 'It degrades, it doesn’t brick',
        lede: 'Every dependency here is optional at runtime, and each one has a defined answer for being missing.',
        rows: [
          {
            k: 'no model on disk',
            v: 'Retrieval falls back to lexical search alone. Hints get cruder; nothing stops working.',
          },
          {
            k: 'RAG switched off',
            v: 'Full MCP schemas return to the system prompt automatically, so no tool becomes unreachable.',
          },
          {
            k: 'first launch',
            v: 'The model downloads in the background and the status bar reports progress. The agent is usable the whole time.',
          },
          {
            k: 'tight RAM',
            v: '/rag-limit caps the embedding batch — the index takes longer to build, and that is the entire consequence.',
          },
        ],
      },
      next: 'See how the loop around it is built',
    },
  },

  goal: {
    kicker: '/goal mode',
    title: 'It doesn’t stop when it sounds done. It stops when it is.',
    sub: 'Two agents, one loop: a worker does the job, an evaluator refuses to be impressed. You watch the status bar.',
    // One entry per STATES badge in GoalLoop.tsx, same order.
    logs: [
      'worker + evaluator armed, waiting for a goal',
      'state the success criteria — it will be held to them',
      'worker edits code, runs the suite, reports back',
      'a second agent judges the result against the goal',
      'rejected — evaluator feeds concrete fixes back in',
      'sessions swap after repeated failures to escape dead ends',
      'goal met — loop closed, hard-capped at 10 iterations',
    ],
  },

  serve: {
    teaser: {
      kicker: '/serve',
      title: 'Your free backend, on localhost.',
      sub: 'One command turns the agent into an OpenAI-compatible server. Anything that speaks that dialect — aider, Continue, Open WebUI, the OpenAI SDKs — points at 127.0.0.1:7667 and inherits the same free session.',
      headless: 'No interface needed:',
      points: [
        {
          k: 'one dialect, every backend',
          v: 'Model ids route to the built-in DeepSeek client or to any /providers entry: deepseek-chat, lmstudio/qwen2.5-coder, gemini/…',
        },
        {
          k: 'stateless per request',
          v: 'Every completion runs on a fresh fork, and DeepSeek forks drop their remote session afterwards — server traffic never piles junk chats onto your account.',
        },
        {
          k: 'loopback by default',
          v: '127.0.0.1 unless you say otherwise. Set a bearer token and CORS turns on with it, not before.',
        },
      ],
    },
    page: {
      title: 'Pooprusteek as an API',
      lede: 'The same provider stack the TUI drives, exposed as OpenAI Chat Completions on a port you choose. Start it from inside the agent, or run the whole thing headless.',
      stats: [
        { k: '7667', v: 'default port — /server <port> persists another' },
        { k: '/v1', v: 'chat/completions + models, /v1-less spellings accepted' },
        { k: 'SSE', v: 'token-by-token streaming, the shape clients expect' },
        { k: '$0.00', v: 'the built-in backend still costs nothing' },
      ],
      start: {
        kicker: 'starting it',
        title: 'Four ways in',
        lede: 'The server is a detached task owned by the TUI, so starting and stopping it never interrupts a turn.',
        headless: 'Or drop the interface entirely: --proxy prints a timestamped request log instead of a UI (the same as --api --uiless).',
        rows: [
          {
            k: '/serve on|off',
            v: 'Start and stop from inside the TUI. The status line keeps count of requests and errors.',
          },
          {
            k: '/server <port>',
            v: 'Persist a different port, restarting the server if it is already up.',
          },
          {
            k: '/serve api <dialect>',
            v: 'openai today. anthropic and gemini are reserved in the config and say so plainly instead of half-working.',
          },
          {
            k: '--serve',
            v: 'Launch the TUI with the server already running. --server and --api are aliases.',
          },
        ],
      },
      routing: {
        kicker: 'model ids',
        title: 'One name picks the backend',
        lede: 'Routing is a pure function over your provider list — no network, no guessing, and testable on its own.',
        rows: [
          {
            k: 'deepseek-chat · deepseek-reasoner',
            v: 'The built-in DeepSeek web client, when a token is configured. Also reachable as deepseek/<id>.',
          },
          {
            k: '<entry>/<model>',
            v: 'A /providers entry with an explicit model: its default plus everything the upstream lists. Unlisted ids pass through, so whatever the endpoint actually serves works.',
          },
          {
            k: '<entry>',
            v: 'The entry’s configured model — or the first one fetched from it, when no default is set.',
          },
          {
            k: 'a bare model id',
            v: 'If it matches some entry’s configured or fetched model, that entry wins. Ids copied out of upstream docs work unprefixed.',
          },
        ],
      },
      clients: {
        kicker: 'clients',
        title: 'Point anything at it',
        lede: 'There is no SDK to adopt. If a tool has a base-URL field, it is already compatible.',
        items: [
          {
            k: 'aider',
            v: 'Set OPENAI_BASE_URL, pass --model deepseek-chat, and the pair programmer runs on the free backend.',
          },
          {
            k: 'Continue & IDE plugins',
            v: 'Anything with an OpenAI-compatible provider block: base URL, any api-key string, a model id from the catalog.',
          },
          {
            k: 'Open WebUI',
            v: 'Add it as an OpenAI connection and the whole model catalog shows up in the picker.',
          },
          {
            k: 'OpenAI SDKs',
            v: 'Python, JS, curl — the request shape is unchanged, streaming included.',
          },
          {
            k: 'GET /v1/models',
            v: 'The catalog rendered as the listing clients ask for on connect.',
          },
          {
            k: 'Legacy /v1/completions',
            v: 'Synthesized on top of the chat path for older clients that never moved.',
          },
        ],
      },
      safety: {
        kicker: 'defaults',
        title: 'Local until you say otherwise',
        lede: 'The gateway hands out access to accounts and paid upstreams. Every default here assumes you did not mean to publish it.',
        rows: [
          {
            k: 'host',
            v: '127.0.0.1. Exposing a keyless gateway on a LAN has to be a decision, not an accident.',
          },
          {
            k: 'api_key',
            v: 'Set it and every request must carry Authorization: Bearer …',
          },
          {
            k: 'CORS',
            v: 'Only sent when a bearer token is configured — the browser gate follows the auth gate, never leads it.',
          },
          {
            k: 'sessions',
            v: 'A fresh fork per request; DeepSeek forks discard their remote session, so serving never litters your chat list.',
          },
          {
            k: 'providers',
            v: 'Settings are snapshotted at launch — edits made in the TUI apply on the next /serve off + on.',
          },
        ],
      },
      next: 'How the whole thing is wired',
    },
  },

  commands: {
    kicker: 'the surface area',
    title: '50 slash commands. Zero menus.',
    sub: 'Everything is a command, exactly where your hands already are.',
    tail: 'Every one of them is a file in src/commands/defs/, and the help screen is generated from the same registry.',
  },

  themes: {
    kicker: '/themes',
    title: 'Ten palettes. This page wears them too.',
    sub: 'The gallery below is the agent’s real preset table from src/tui/theme.rs. Click one: it is what the TUI looks like, and it is what this site looks like — both are built on the same color roles.',
    note: 'Your own is a wizard away: /themes new takes a base preset plus per-role overrides and lands as a [[ui.custom_themes]] entry in config.toml.',
  },

  tech: {
    // One label per number in TechStrip.tsx (1 / 62k / 0 / 5), same order.
    stats: [
      'static binary — no node, no electron, no runtime',
      'lines of Rust on tokio + ratatui',
      'garbage-collector pauses while you type',
      'prebuilt targets: Windows, Linux and macOS',
    ],
    meta: 'Rust edition 2024 · MSRV 1.91 · ~900 tests on Windows, Linux and macOS',
    metaTail: 'one tokio::select! loop, everything else is an event',
  },

  download: {
    title: 'Get PoopRusteek',
    lede: 'Prebuilt for Windows, macOS and Linux. Take the file or paste the line — both point at the release the CI published, with the sizes and digests it reported.',
    live: 'live from the GitHub API',
    offline: 'cached links — GitHub didn’t answer',
    detected: 'Detected: {{os}} · {{arch}}',
    mobile: 'It is a terminal agent, so your phone is out of scope — but every desktop build is listed below.',
    unknownOs: 'Couldn’t tell what you’re running. Every build is listed below.',
    channels: {
      stable: {
        name: 'stable',
        body: 'The last tagged release. On this channel /update only moves you forward — it never downgrades.',
      },
      dev: {
        name: 'dev',
        body: 'Rebuilt on every push to develop: newer, rougher, and the channel the installers landed on first.',
      },
    },
    assets: {
      kicker: 'all builds',
      title: 'Every file in the release',
      lede: 'Sizes and digests come from the API, so this table is what CI actually uploaded — not what a page once said it did.',
      empty:
        'This release predates the current build matrix — open it on GitHub to see what it carries.',
      onGithub: 'Open on GitHub',
      published: 'published {{date}}',
      copySha: 'Copy the full digest',
      cols: { file: 'file', target: 'target', size: 'size', sha: 'sha-256' },
      kinds: {
        installer: 'Windows installer',
        script: 'macOS / Linux installer',
        archive: 'archive',
        meta: 'checksums & manifest',
      },
    },
    pending: {
      title: 'Stable builds are on their way',
      body: 'v0.1.0 was tagged before the installers existed, so it carries a single Windows zip and no manifest for /update to read. The next tagged release ships the whole matrix — and this page switches its buttons to it on its own. Until then the dev channel already has every file, verified the same way.',
      cta: 'Take the dev build',
      checklist: 'next release carries',
      manifest: 'what /update and install.sh verify against',
      ready: 'ready',
      waiting: 'waiting',
      legacy: 'Still in this release:',
    },
    verify: {
      kicker: 'integrity',
      title: 'Check it before you run it',
      lede: 'Every release carries SHA256SUMS and a manifest.json. The shell installer and /update both verify against them before anything moves into place — you can do the same by hand.',
      sums: 'One file, every digest. Verify what you took from this page:',
      manifest: 'What the updater reads: version, tag, and a hash per platform asset.',
      signing:
        'Integrity is guaranteed; authenticity is not. The binaries aren’t code-signed yet, so trust rests on TLS and GitHub — exactly as much as any unsigned release deserves.',
    },
    update: {
      kicker: 'staying current',
      title: 'It updates itself',
      lede: 'No package manager to wait for, and no silent replacement of a running program either.',
      rows: [
        {
          k: '/update',
          v: 'Checks your channel, verifies the download against the release manifest, stages it next to the current binary and swaps it in.',
        },
        {
          k: 'next launch',
          v: 'The running executable is renamed aside rather than overwritten, so the new build takes effect the next time you start it.',
        },
        {
          k: '/update channel',
          v: 'stable or dev. stable installs only a newer version; dev installs whenever the build differs from yours.',
        },
        {
          k: '/autoupdate on',
          v: 'Runs the same check in the background at startup. Off by default — it is your machine.',
        },
        {
          k: 'the install folder',
          v: '/update writes where you installed. Keep that folder owned by you, not by root.',
        },
      ],
    },
    firstRun: {
      kicker: 'first launch',
      title: 'Three things happen once',
      lede: 'Then it is a binary that starts in a terminal and asks nothing of you.',
      steps: [
        {
          k: 'Onboarding',
          v: 'A guided flow sets your DeepSeek session token and model. There is no API key to paste — it is the web session you already have.',
        },
        {
          k: 'The embedder',
          v: '~120 MB of quantized ONNX downloads in the background and your saved sessions get indexed. The status bar reports progress; everything else works meanwhile.',
        },
        {
          k: 'Nothing else',
          v: 'No account, no telemetry, no phone-home. /rag off skips the model entirely if you would rather not have it.',
        },
      ],
    },
    requirements: {
      kicker: 'requirements',
      title: 'What it needs',
      lede: 'Short list, and the two exclusions are honest ones rather than neglect.',
      source: 'Rust edition 2024, MSRV 1.91 — build it yourself and skip releases entirely:',
      rows: [
        {
          k: 'Windows',
          v: 'x86_64 or arm64. The installer is per-user: no admin rights, no UAC prompt. Windows Terminal recommended — the Start-menu shortcut opens it there.',
        },
        {
          k: 'macOS',
          v: 'Apple Silicon only. ONNX Runtime publishes no prebuilt library for Intel Macs, and the local embedder needs one.',
        },
        {
          k: 'Linux',
          v: 'x86_64 or arm64, glibc 2.39+ — Ubuntu 24.04, Debian 13 or newer.',
        },
        {
          k: 'Disk',
          v: '~50 MB for the binary, plus ~120 MB for the embedding model if you keep RAG on.',
        },
        {
          k: 'Network',
          v: 'Only to DeepSeek (or the provider you configured) and to GitHub when you ask for an update.',
        },
      ],
    },
    uninstall: {
      unix: 'Removing it on macOS or Linux — the binary, the PATH line, and your data if you agree:',
      windows:
        'On Windows it is an entry in Apps. Uninstalling asks whether your settings and sessions should go with it, and takes no for an answer.',
    },
  },

  arch: {
    title: 'One event loop, no render races',
    lede: 'The agent runs in a spawned task and reaches the interface only through events. Nothing that renders mutates state, and nothing that thinks touches the screen.',
    next: 'Go get it',
    stats: [
      { k: '62k', v: 'lines of Rust across 207 files' },
      { k: '~900', v: 'tests, none of which touch the network' },
      { k: '51', v: 'slash commands, one file each' },
      { k: '16', v: 'built-in tools before a single MCP server' },
    ],
    loop: {
      kicker: 'the shape',
      title: 'Everything hangs off one select!',
      lede: 'Conversations own their state, the runtime owns the turns, and the renderer owns nothing at all.',
      note: 'CPU-heavy work — ONNX embeddings, the SHA-3 proof-of-work — runs on blocking threads, so a long hash never costs you a frame.',
    },
    turn: {
      kicker: 'a turn',
      title: 'What happens between Enter and the answer',
      lede: 'Six steps, and you can stop it at any of them.',
      steps: [
        {
          k: 'Match',
          v: 'The prompt is scored against skills and MCP tools. The top hits become an ephemeral hint that never persists into the conversation history.',
        },
        {
          k: 'Send',
          v: 'The provider forks a session for this chat. On DeepSeek that means solving its SHA-3 proof-of-work locally, then streaming the reply over SSE.',
        },
        {
          k: 'Call',
          v: 'Tool calls come out of the stream — native ones where a provider emits them, parsed ones everywhere else, with the provider’s own call id.',
        },
        {
          k: 'Ask',
          v: 'Anything with side effects stops at an approval modal with a readable preview: a real diff for edit, the actual text for write, a warning for paths outside the workspace.',
        },
        {
          k: 'Checkpoint',
          v: 'Before a write lands, the old content goes into an append-only journal. /undo puts it back — and refuses when the file changed after the edit, because then someone else was editing too.',
        },
        {
          k: 'Judge',
          v: 'In GOAL mode a second agent reads the result against your success criteria and either signs off or sends concrete fixes back into the loop.',
        },
      ],
    },
    modules: {
      kicker: 'src/',
      title: 'Where everything lives',
      lede: 'Layering is enforced by the module graph: tools know nothing about the app, the renderer knows nothing about providers.',
      rows: [
        { k: 'app/', v: 'The coordinator: conversations, the event loop, the agent runtime, keys, GOAL, the search screen, the providers panel.' },
        { k: 'provider/', v: 'DeepSeek web (auth, PoW, SSE, sessions) plus OpenAI-compatible, Anthropic Messages and Gemini clients.' },
        { k: 'agent/', v: 'The agent loop, the sub-agent runner, the tool-call parser.' },
        { k: 'semantic/', v: 'The local RAG layer: embedder, hybrid index, corpora, history store, eval harness.' },
        { k: 'tools/', v: 'Shell and PTY, edit and write, todo, timers, task, and the semantic builtins.' },
        { k: 'mcp/', v: 'Clients, transports, config discovery across eight sources, the manager, OAuth.' },
        { k: 'server/', v: 'The OpenAI-compatible gateway: catalog routing, hyper transport, the dialect itself.' },
        { k: 'tui/', v: 'ratatui views, widgets, markdown rendering — and the theme table this website borrows.' },
        { k: 'update/', v: 'Channels, manifest verification, the staged binary swap.' },
        { k: 'acp/', v: 'Agent Client Protocol server mode: JSON-RPC over stdio, for IDEs that speak it.' },
      ],
    },
    safety: {
      kicker: 'rails',
      title: 'The parts that say no',
      lede: 'An agent with a shell is a security surface. These are the places where it is deliberately less convenient.',
      rows: [
        {
          k: 'scoped approvals',
          v: 'A rule is a tool plus a scope: bash · cargo test allows that prefix, edit · <folder> allows writes there. A compound command gets no scope at all — git status && rm -rf / starts with git status.',
        },
        {
          k: 'checkpoints',
          v: 'Every edit and write is journaled first. Files that look like secrets (.env, *.pem, id_rsa) and anything over 8 MiB are never copied anywhere — such an edit is honestly marked irreversible instead.',
        },
        {
          k: 'the keyring',
          v: 'The DeepSeek session and MCP OAuth tokens live encrypted in the OS keyring, never in a plaintext config file.',
        },
        {
          k: 'untrusted text',
          v: 'Project instructions (AGENTS.md, CLAUDE.md…) come from someone else’s repository: symlinks aren’t followed, the text arrives inside an envelope with a one-time marker, and the absolute rules are repeated after it.',
        },
        {
          k: 'off-limits files',
          v: 'The edit tool refuses to write the agent’s own config or any MCP config, and aborts when a file changed since it was read.',
        },
      ],
    },
    proof: {
      kicker: 'evidence',
      title: 'Measured, not asserted',
      lede: 'Claims on this page are checkable in the repository, and most of them are checked on every push.',
      rows: [
        { k: '~900 tests', v: 'Unit tests with no network, run on Windows, Linux and macOS.' },
        { k: 'MRR evals', v: 'Retrieval quality is a number, not a feeling: 0.927 for skills, 0.836 for MCP tools.' },
        {
          k: 'field ladder',
          v: 'A scenario harness runs the agent against real tasks — and fails a run where every tool call errored but the summary sounded fine.',
        },
        { k: 'gates', v: 'fmt, clippy -D warnings and the suite block the commit locally and the merge in CI.' },
        { k: '--locked', v: 'Cargo.lock is committed and CI builds from it: a release is the exact dependency set the tests passed on.' },
      ],
    },
  },

  footer: {
    title: 'Your terminal. Your session. Your agent.',
    blurb: 'Yes, it’s really called PoopRusteek. The code is surgical anyway — go read it, or just install it.',
    cta: 'Download',
    tagline: 'PoopRusteek 🧻 · built with ratatui, tokio and questionable naming decisions',
  },
}

export default en
