import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import githubData from './data/github_data.json';
import discordData from './data/discord_data.json';
import commitsData from './data/commits_data.json';
import './index.css';

function App() {
  const earlyContributors = [
    { name: "Grzeg Wilk", role: "Co-Founder (Enzyme R&D)" },
    { name: "Jorge Beneitez", role: "Co-Founder (Enzyme R&D)" },
    { name: "Tibor Lorántfy", role: "JSON API Template & Core Architecture" },
    { name: "Viktor Kovács", role: "Core Contributor" },
    { name: "Máté Szamosi", role: "Core Contributor" },
    { name: "Mathias Jonathan", role: "Core Contributor" },
    { name: "Aitor Lezeta", role: "Early Pioneer" },
    { name: "Kaushik LS", role: "Early Pioneer" },
    { name: "Nathan Hildebrandt", role: "Early Pioneer" },
    { name: "Ferencz Tamás", role: "Early Pioneer" },
    { name: "Stian André", role: "Early Pioneer" },
  ];

  const videoTutorials = [
    {
      id: "llWnPbS7zJU",
      title: "How to start with Tapir: Download & Install",
      tag: "Getting Started",
      desc: "Step-by-step walkthrough on setting up the Tapir Add-on in Archicad and getting your first automation running."
    },
    {
      id: "Eh5hB756Oko",
      title: "Tapir Selection Methods",
      tag: "Core Workflow",
      desc: "Learn the various techniques to target, select, and filter elements inside Archicad using Python & Grasshopper."
    },
    {
      id: "sS6Uz8qClWo",
      title: "Tapir Column Workflow",
      tag: "Parametric BIM",
      desc: "Automating column placement, parameter injection, and geometry generation parametrically from Grasshopper."
    },
    {
      id: "PfivmfXDv9o",
      title: "Archicad + Grasshopper Operations",
      tag: "Grasshopper",
      desc: "Bridging Grasshopper definitions directly into native Archicad BIM elements through the Tapir JSON endpoints."
    },
    {
      id: "rT4gEMrYuYw",
      title: "Excel & Airtable Data Sync",
      tag: "Data Integration",
      desc: "Bi-directional property management: sync quantities, schedules, and custom properties with spreadsheet databases."
    },
    {
      id: "tfiAvH_fAJo",
      title: "Advanced Element Filtering",
      tag: "Power Tools",
      desc: "Deep query filtering to isolate model elements by classifications, layer combinations, and nested properties."
    }
  ];

  const useCases = [
    { icon: "📊", title: "Automated Property Management", desc: "Batch extract and update properties across hundreds of Archicad elements in seconds." },
    { icon: "🏗️", title: "Geometry Generation", desc: "Create complex walls, slabs, and beams algorithmically using Python." },
    { icon: "📋", title: "Quantity Takeoffs", desc: "Instantly generate accurate material and element quantity reports." },
    { icon: "🧠", title: "AI / LLM Integration", desc: "Use Tapir MCP to allow AI assistants to interact directly with your BIM models." },
    { icon: "🐞", title: "BCF Issue Tracking", desc: "Automate issue tracking and BCF file generation directly from Python scripts." },
    { icon: "🏷️", title: "Classification Mapping", desc: "Automatically classify elements based on naming conventions or geometry rules." },
    { icon: "📐", title: "View & Layout Automation", desc: "Script the creation of views, sections, and layout books effortlessly." },
    { icon: "✅", title: "Data Validation", desc: "Check models for missing parameters or non-compliant design guidelines." },
    { icon: "🐍", title: "Custom Python Workflows", desc: "Build standalone Python scripts tailored precisely to your office standards." },
    { icon: "🦏", title: "Grasshopper Integration", desc: "Link Rhino/Grasshopper workflows directly to Archicad through Tapir's endpoints." },
    { icon: "🔍", title: "Advanced Element Filtering", desc: "Quickly query and filter model elements based on deeply nested properties or spatial data." },
    { icon: "✏️", title: "Bulk Asset Renaming", desc: "Automate the tedious process of renaming views, layouts, and publisher sets to match project standards." },
  ];

  const roadmap = [
    { title: "Complex Hierarchical Elements", desc: "Full support for reading and writing Stairs, Roofs, and Curtain Walls." },
    { title: "Material & Composite Editing", expanded: "Expanded capabilities to modify building materials and composites directly via API." },
    { title: "Custom Add-on UI Generation", desc: "Built-in tools for creating custom Archicad dialogues using simple Python scripts." },
    { title: "2D Detailing Automation", desc: "Better handling of 2D lines, fills, and text for automated detailing." },
    { title: "Dynamic User Properties", desc: "Support for injecting custom user-defined properties at runtime." },
    { title: "Pre-built Python Recipes", desc: "An expanded community ecosystem of plug-and-play Python automation scripts." },
    { title: "Advanced Error Handling", desc: "Improved Python tracebacks and API error messages for easier script troubleshooting." },
    { title: "Direct CI/CD Integration", desc: "Seamless workflows for running automated Tapir scripts in GitHub Actions pipelines." },
  ];

  const { stats, leaderboard } = useMemo(() => {
    // Commit author counts
    const authorCounts = {};
    commitsData.forEach(c => {
      const raw = (c?.author || '').trim();
      if (!raw) return;
      const lower = raw.toLowerCase();
      let name = raw;
      if (lower === 'tlorantfy' || lower === 'tibor lorántfy') {
        name = 'Tibor Lorántfy';
      } else if (lower.includes('claude')) {
        name = 'Claude';
      } else if (lower.includes('szamosi')) {
        name = 'Máté Szamosi';
      } else if (lower.includes('kovacs') || lower.includes('kovács')) {
        name = 'Viktor Kovács';
      }
      authorCounts[name] = (authorCounts[name] || 0) + 1;
    });

    const sortedLeaderboard = Object.entries(authorCounts)
      .map(([name, commits]) => ({ name, commits }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 5);

    // Unique participants across Discord and GitHub
    const participants = new Set();
    discordData.forEach(d => d?.author && participants.add(d.author));
    githubData.forEach(g => g?.author && participants.add(g.author));

    const uniqueCommitters = new Set(
      commitsData.map(c => (c?.author || '').trim()).filter(Boolean)
    );

    return {
      stats: {
        totalCommits: commitsData.length,
        discordMessages: discordData.length,
        totalParticipants: participants.size,
        totalGithubItems: githubData.length,
        uniqueCommitters: uniqueCommitters.size,
      },
      leaderboard: sortedLeaderboard,
    };
  }, []);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const activityMap = {};
    
    const processItem = (item, type) => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      if (isNaN(date.getTime())) return;
      
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!activityMap[monthYear]) {
        activityMap[monthYear] = { name: monthYear, Commits: 0, GitHub: 0, Discord: 0 };
      }
      activityMap[monthYear][type] += 1;
    };

    commitsData.forEach(item => processItem(item, 'Commits'));
    githubData.forEach(item => processItem(item, 'GitHub'));
    discordData.forEach(item => processItem(item, 'Discord'));

    const sortedData = Object.values(activityMap).sort((a, b) => a.name.localeCompare(b.name));
    
    const formattedData = sortedData.map(item => {
      const [year, month] = item.name.split('-');
      const date = new Date(year, month - 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      return {
        ...item,
        name: `${monthName} '${year.slice(2)}`
      };
    });

    setChartData(formattedData);
  }, []);

  return (
    <div className="container">
      <nav className="navbar">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <img src="/tapir-logo.svg" alt="Tapir Logo" className="logo-icon-img" />
          Tapir
        </a>
        <div className="nav-links">
          <a href="#story">Our Story</a>
          <a href="#tutorials">Tutorials</a>
          <a href="#usecases">Workflows</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#stats">Community</a>
          <a href="https://discord.gg/FZAM7Fbg7C" target="_blank" rel="noreferrer" className="nav-cta">Join Discord</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-pill">
          🌍 100% Free & Open Source for Archicad
        </div>
        <h1>
          Automate Archicad with <span className="hero-gradient-text">Ease.</span>
        </h1>
        <p>
          <strong>From the users, to the community.</strong> Tapir is an open-source bridge connecting Archicad to the modern computational ecosystem (Grasshopper, Python, and AI) without requiring deep C++ development. Built by architects and developers who wanted to make BIM automation accessible to everyone.
        </p>
        <div className="hero-buttons">
          <a href="#tutorials" className="btn btn-primary">Watch Video Tutorials ▶</a>
          <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer" className="btn btn-secondary">Documentation & Commands</a>
          <a href="https://discord.gg/FZAM7Fbg7C" target="_blank" rel="noreferrer" className="btn btn-discord">Join Community</a>
        </div>
      </section>

      {/* Section: The Story of Tapir */}
      <section id="story" className="section">
        <div className="section-header">
          <span className="section-tag">Origins & Mission</span>
          <h2>The Story of Tapir</h2>
          <p>How an internal architectural R&D experiment grew into a global open-source community movement.</p>
        </div>

        <div className="grid-2" style={{ marginBottom: "2rem" }}>
          <div className="story-card">
            <span className="story-badge">💡 The Inception</span>
            <h3 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>Born from Enzyme's R&D</h3>
            <p className="story-lead">
              A quest to connect Grasshopper directly to Archicad without C++ barriers.
            </p>
            <p className="story-text">
              Tapir began as an internal research and development initiative at <strong>Enzyme APD</strong>, spearheaded by <strong>Grzeg Wilk</strong> and <strong>Jorge Beneitez</strong>.
            </p>
            <p className="story-text">
              When Archicad introduced its JSON interface, it was a massive step forward — yet heavily restricted in scope. Architects using Grasshopper for parametric design were left without a direct, flexible bridge into native Archicad elements without compiling complex C++ add-ons.
            </p>
          </div>

          <div className="story-card">
            <span className="story-badge">⚡️ The Breakthrough</span>
            <h3 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>Unlocking the Internal Levers</h3>
            <p className="story-lead">
              Tibor Lorántfy's template changed the game.
            </p>
            <p className="story-text">
              While investigating ways to expand the JSON API, the team discovered a repository published by <strong>Tibor Lorántfy</strong>. Tibor had created an ingenious C++ template that could expose virtually <em>any</em> native Archicad API command as a clean JSON endpoint.
            </p>
            <p className="story-text">
              Joining forces, the scope of Tapir expanded overnight: suddenly, every internal lever of Archicad — from geometry generation and classifications to materials, views, and properties — was accessible to visual scripting and simple Python code.
            </p>
          </div>
        </div>

        {/* Why Open Source & Pioneers */}
        <div className="story-card">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="story-badge" style={{ background: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.3)", color: "var(--accent-blue-light)" }}>
                🌱 100% Free & Open Source
              </span>
              <h3 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>Why We Opened It to the World</h3>
              <p className="story-text">
                Rather than keeping this technology proprietary, Enzyme decided to open-source the entire codebase for the global Archicad community — heavily inspired by groundbreaking movements like <strong>ifc.js</strong>.
              </p>
              <p className="story-text">
                In today's fast-paced AEC industry, we cannot wait years for software vendors to fulfill every firm's specific workflow need. Open-source puts innovation, ownership, and agility back into the hands of the practitioners who use these tools every day.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                Early Pioneers & Core Contributors
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Grateful to the dedicated pioneers whose code, testing, and feedback built the foundation of Tapir:
              </p>
              <div className="contributor-chips">
                {earlyContributors.map((c, i) => (
                  <div className={`contributor-chip ${i < 3 ? 'highlight' : ''}`} key={i}>
                    <span>{c.name}</span>
                    <small style={{ opacity: 0.7, fontSize: "0.75rem" }}>• {c.role}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Video Tutorials Grid */}
      <section id="tutorials" className="section">
        <div className="section-header">
          <span className="section-tag">Visual Learning</span>
          <h2>Learn Tapir in Action</h2>
          <p>Step-by-step video tutorials from our community playlist. See how easily you can automate Archicad without writing lines of C++.</p>
        </div>

        <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
          {videoTutorials.map((vid) => (
            <a
              key={vid.id}
              href={`https://www.youtube.com/watch?v=${vid.id}&list=PLGc943dgyfjjqzeFglpYLIPrcn_HFicDn`}
              target="_blank"
              rel="noreferrer"
              className="video-card"
            >
              <div className="video-thumb-wrap">
                <img
                  src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                  alt={vid.title}
                  className="video-thumb-img"
                  loading="lazy"
                />
                <div className="video-play-overlay">
                  <div className="video-play-btn">▶</div>
                </div>
              </div>
              <div className="video-info">
                <span className="video-tag">{vid.tag}</span>
                <h4>{vid.title}</h4>
                <p>{vid.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href="https://youtube.com/playlist?list=PLGc943dgyfjjqzeFglpYLIPrcn_HFicDn&si=60f57YfregEnND9A"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: "1rem", padding: "0.9rem 2rem" }}
          >
            ▶ View All 21+ Episodes on the YouTube Playlist ↗
          </a>
        </div>
      </section>

      {/* Section: How Tapir Works (Architecture) */}
      <section id="architecture" className="section">
        <div className="section-header">
          <span className="section-tag">Technical Foundation</span>
          <h2>How It Works Under the Hood</h2>
          <p>A simple, stateless architecture connecting any environment to Archicad.</p>
        </div>
        
        <div className="grid-2">
          <div className="feature-card">
            <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>System Architecture</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Tapir is an Archicad C++ add-on that wraps native API functions into an accessible, stateless JSON server. Anything that can send an HTTP request or run Python can command Archicad.
            </p>
            
            <div className="architecture-diagram">
              <div className="arch-layer">
                <h4>Archicad Core</h4>
                <small>BIM Model & Native C++ Engine</small>
              </div>
              <div className="arch-arrow">↓</div>
              <div className="arch-layer addon">
                <h4>Tapir Add-On</h4>
                <small>Lightweight JSON API Layer</small>
              </div>
              <div className="arch-arrow">↓</div>
              <div className="arch-consumers">
                <div className="arch-node">
                  <h4>Grasshopper</h4>
                  <small>Visual Parametric Nodes</small>
                </div>
                <div className="arch-node">
                  <h4>Python Scripts</h4>
                  <small>Automated Batch Routines</small>
                </div>
                <div className="arch-node">
                  <h4>AI & Tapir MCP</h4>
                  <small>Autonomous Claude Agents</small>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card" style={{ justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>AI-Assisted Scripting with Claude</h3>
              <p style={{ marginBottom: "1.25rem" }}>
                You don't need a computer science degree to automate your office. The Tapir community is heavily pairing Tapir with AI models like Claude to generate custom automation scripts on the fly.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Simply describe what you want to achieve (e.g., <em>"Extract all composite exterior walls on level 2 and calculate their net volume"</em>), share the Tapir Command List with Claude, and execute the generated Python script directly.
              </p>
              
              <div className="graphic-frame" style={{ marginBottom: "1.5rem" }}>
                <div className="graphic-frame-bar">
                  <span className="frame-dot red"></span>
                  <span className="frame-dot yellow"></span>
                  <span className="frame-dot green"></span>
                  <span className="frame-title">claude_script_sample.py</span>
                </div>
                <div style={{ padding: "1.25rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#94a3b8", textAlign: "left", lineHeight: "1.6" }}>
                  <span style={{ color: "#60a5fa" }}>import</span> tapir<br/>
                  elements = tapir.get_elements(type=<span style={{ color: "#34d399" }}>"Wall"</span>, story=<span style={{ color: "#f59e0b" }}>2</span>)<br/>
                  <span style={{ color: "#64748b" }}># Claude writes the endpoints for you automatically!</span><br/>
                  tapir.update_properties(elements, &#123;<span style={{ color: "#34d399" }}>"FireRating"</span>: <span style={{ color: "#34d399" }}>"EI 60"</span>&#125;)
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer" className="btn btn-secondary">Command List ↗</a>
              <a href="https://pypi.org/project/tapir-archicad-mcp/" target="_blank" rel="noreferrer" className="btn btn-secondary">Tapir MCP for AI ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Workflows & Use Cases */}
      <section id="usecases" className="section">
        <div className="section-header">
          <span className="section-tag">Real-World Automation</span>
          <h2>What Can You Do Today?</h2>
          <p>12 ways architects, BIM managers, and computational designers are using Tapir right now.</p>
        </div>
        <div className="grid-4">
          {useCases.map((useCase, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{useCase.icon}</div>
              <h3>{useCase.title}</h3>
              <p>{useCase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Community Contribution Pillars (Inspired by the Slides) */}
      <section className="section">
        <div className="section-header">
          <span className="section-tag">Empower the Movement</span>
          <h2>How Can You Contribute?</h2>
          <p>Tapir is non-profit, free, and open-source. Here is how we ensure it remains sustainable, up-to-date, and growing.</p>
        </div>

        <div className="grid-3">
          <div className="pillar-card">
            <div className="pillar-icon-box">🤝</div>
            <h3>Community Crowdfunding</h3>
            <p>
              Small contributions from a large number of users make a tremendous difference. If regular users support with small pledges, we can fund dedicated maintainers to update the plugin for each new Archicad version.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">🏢</div>
            <h3>Corporate Sponsoring</h3>
            <p>
              We partner with larger architecture practices and engineering organizations who adopt Tapir as part of their internal R&D, prioritizing specific endpoints they require for complex commercial projects.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">🎓</div>
            <h3>Training & Services</h3>
            <p>
              We provide tailored training sessions, implementation workshops, and custom node development for offices transitioning to computational BIM workflows with Tapir.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Marketplace */}
      <section id="marketplace" className="section">
        <div className="section-header">
          <span className="section-tag">Ecosystem</span>
          <h2>Tapir Marketplace</h2>
          <p>A community hub to discover, download, and share plug-and-play Tapir scripts and Archicad add-ons.</p>
        </div>
        
        <div className="grid-2">
          <div className="feature-card" style={{ justifyContent: "space-between", background: "linear-gradient(145deg, rgba(22, 32, 47, 0.9) 0%, rgba(15, 23, 34, 0.95) 100%)", borderColor: "rgba(96, 165, 250, 0.3)" }}>
            <div>
              <h3 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>Discover & Download</h3>
              <ul style={{ color: "var(--text-secondary)", marginBottom: "1.75rem", paddingLeft: "1.25rem", lineHeight: "1.8" }}>
                <li><strong>No account needed:</strong> Search, filter by Archicad version or category, and download immediately.</li>
                <li><strong>Community Voting:</strong> Upvote useful scripts to help the best office tools surface.</li>
                <li><strong>Automated Integrity:</strong> Downloads are fingerprinted and checked hourly for safety.</li>
              </ul>
            </div>
            <a href="https://tapir-marketplace.vercel.app/" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              Explore the Marketplace ↗
            </a>
          </div>

          <div className="feature-card">
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Publish Your Own Scripts</h3>
            <p style={{ marginBottom: "1rem" }}>
              Publishing is free using your GitHub account. Fill in a quick form with your script name, description, and download link. Automated checks run and your listing goes live in minutes.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Your listing stays yours:</strong> Filed under your own GitHub handle so you retain complete control over updates or removal.
            </p>
            <p>
              <strong>100% Author Revenue:</strong> Whether scripts are free, donation-supported, or paid, all contributions go directly to the author. Tapir takes zero cut.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Roadmap */}
      <section id="roadmap" className="section">
        <div className="section-header">
          <span className="section-tag">Looking Forward</span>
          <h2>What's Cooking?</h2>
          <p>The 8 most anticipated features and ideas driving the next major releases of Tapir.</p>
        </div>
        <div className="grid-4">
          {roadmap.map((item, idx) => (
            <div className="feature-card" key={idx} style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.05rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.88rem" }}>{item.desc || item.expanded}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Live Stats & Analytics */}
      <section id="stats" className="section">
        <div className="section-header">
          <span className="section-tag">Live Activity</span>
          <h2>Community & Momentum</h2>
          <p>Real-time data scraped daily from GitHub commits and Discord discussions.</p>
        </div>
        
        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCommits.toLocaleString()}</div>
            <div className="stat-label">GitHub Commits</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.discordMessages.toLocaleString()}</div>
            <div className="stat-label">Discord Messages</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalParticipants.toLocaleString()}</div>
            <div className="stat-label">Active Participants</div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div style={{ gridColumn: "span 3" }}>
            <div className="feature-card" style={{ height: "420px", padding: "1.75rem", display: "flex", flexDirection: "column" }}>
              <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Growth Over Time</h3>
              <div style={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDiscord" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5865F2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#5865F2" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGitHub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(148, 163, 184, 0.2)', color: '#fff', borderRadius: '10px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="Discord" stackId="1" stroke="#5865F2" fillOpacity={1} fill="url(#colorDiscord)" />
                    <Area type="monotone" dataKey="GitHub" stackId="1" stroke="#94a3b8" fillOpacity={1} fill="url(#colorGitHub)" />
                    <Area type="monotone" dataKey="Commits" stackId="1" stroke="#60a5fa" fillOpacity={1} fill="url(#colorCommits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: "3rem" }}>
          <div style={{ gridColumn: "span 2" }}>
            <div className="feature-card" style={{ height: "100%" }}>
              <h3>Project Momentum</h3>
              <p style={{ marginBottom: "1rem" }}>
                Development speed has accelerated massively over the past year. 
                With <strong>{stats.totalGithubItems.toLocaleString()} active Issues, Pull Requests, and Discussions</strong> currently tracked, 
                and <strong>{stats.uniqueCommitters} unique code contributors</strong> submitting patches, the ecosystem is growing faster than ever. 
                The community discord has become a vibrant hub for testing new workflows, reporting bugs, and suggesting incredible ideas for Archicad automation.
              </p>
              <p>
                Whether it's bridging the gap with Grasshopper or building LLM agents with the new <strong>Tapir MCP</strong>, 
                the community is consistently pushing the envelope of what's possible in AEC.
              </p>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Top Code Contributors</h3>
            <div className="leaderboard">
              {leaderboard.map((user, idx) => (
                <div className="leaderboard-item" key={idx}>
                  <div className="leaderboard-name">{user.name}</div>
                  <div className="leaderboard-score">{user.commits} commits</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Discord CTA banner */}
        <div className="discord-banner">
          <h2>Do you want to get involved?</h2>
          <p>We are putting together a motivated and diverse community to help push forward Archicad automation.</p>
          <a href="https://discord.gg/FZAM7Fbg7C" target="_blank" rel="noreferrer" className="btn btn-discord" style={{ fontSize: "1.1rem", padding: "1rem 2.25rem" }}>
            Join the Discord Community 💬
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer">📖 Documentation & Command List</a>
          <a href="https://github.com/enzyme-apd/tapir-archicad-automation" target="_blank" rel="noreferrer">💻 GitHub Project</a>
          <a href="https://discord.gg/FZAM7Fbg7C" target="_blank" rel="noreferrer">💬 Discord Community</a>
          <a href="https://tapir-marketplace.vercel.app/" target="_blank" rel="noreferrer">🛒 Marketplace</a>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.6" }}>
          <p><strong>Tapir is 100% Free and Open Source software</strong> (MIT License).</p>
          <p>Maintained by Enzyme APD and the community. <a href="mailto:contact@enzyme-apd.com" style={{color: "var(--accent-blue-light)"}}>Contact Us</a></p>
          <p style={{ marginTop: "1rem", opacity: 0.7 }}>Not affiliated with Graphisoft. Archicad is a trademark of Graphisoft SE.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
