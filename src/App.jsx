import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import githubData from './data/github_data.json';
import discordData from './data/discord_data.json';
import commitsData from './data/commits_data.json';
import './index.css';

function App() {
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
    { title: "Cloud & Headless Execution", desc: "Support for server-side automation running Archicad in headless mode." },
    { title: "Autonomous AI Drafting", desc: "Deeper integration with AI agents for autonomous drafting and modeling tasks." },
    { title: "Real-time Event Listeners", desc: "Enhanced API hooks to trigger scripts instantly when elements change." },
    { title: "Database Bi-directional Sync", desc: "Seamless syncing of model properties with external databases like SQL or Airtable." },
    { title: "Material & Composite Editing", expanded: "Expanded capabilities to modify building materials and composites directly via API." },
    { title: "Custom Add-on UI Generation", desc: "Built-in tools for creating custom Archicad dialogues using simple Python scripts." },
    { title: "2D Detailing Automation", desc: "Better handling of 2D lines, fills, and text for automated detailing." },
    { title: "Dynamic User Properties", desc: "Support for injecting custom user-defined properties at runtime." },
    { title: "Pre-built Python Recipes", desc: "An expanded community ecosystem of plug-and-play Python automation scripts." },
    { title: "Advanced Error Handling", desc: "Improved Python tracebacks and API error messages for easier script troubleshooting." },
    { title: "Direct CI/CD Integration", desc: "Seamless workflows for running automated Tapir scripts in GitHub Actions pipelines." },
  ];

  const leaderboard = [
    { name: "Tibor Lorántfy (tlorantfy)", commits: 590 },
    { name: "Viktor Kovacs", commits: 97 },
    { name: "fuzesArch", commits: 55 },
    { name: "MathiasJon", commits: 52 },
    { name: "grzegorzwilk", commits: 41 }
  ];

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
      const monthName = date.toLocaleString('default', { month: 'short' });
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
          <a href="#about">What is Tapir?</a>
          <a href="#architecture">Architecture & History</a>
          <a href="#usecases">Use Cases</a>
          <a href="#usecases">Use Cases</a>
          <a href="#learning">Learn & Build</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#roadmap">What's Cooking</a>
          <a href="#stats">Community</a>
        </div>
      </nav>

      <section className="hero">
        <h1 className="text-gradient">Automate Archicad with Elegance.</h1>
        <p>
          Tapir is the easiest way to interact with the Archicad JSON/Python API without deep C++ knowledge. 
          Unleash incredible time-saving workflows, generate complex geometries, and integrate your BIM models directly with AI.
        </p>
        <div className="hero-buttons">
          <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer" className="btn btn-primary">Read the Docs</a>
          <a href="https://pypi.org/project/tapir-archicad-mcp/" target="_blank" rel="noreferrer" className="btn btn-secondary">Tapir MCP for AI</a>
        </div>
      </section>

      <section id="architecture" className="section">
        <div className="section-header">
          <h2>Architecture & History</h2>
          <p>How Tapir works under the hood and how it evolved.</p>
        </div>
        
        <div className="grid-2">
          <div className="feature-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>System Architecture</h3>
            <p style={{ color: "var(--text-primary)", marginBottom: "2rem" }}>
              Tapir is built on a robust C++ foundation that exposes Archicad's internal capabilities as an accessible JSON API. This allows multiple different ecosystems to interface with Archicad seamlessly.
            </p>
            
            <div className="architecture-diagram">
              <div className="arch-layer core">
                <h4>Archicad</h4>
                <small>Core Application</small>
              </div>
              <div class="arch-arrow">↓</div>
              <div className="arch-layer addon">
                <h4>Tapir Add-On</h4>
                <small>C++ JSON API Layer</small>
              </div>
              <div class="arch-arrow">↓</div>
              <div className="arch-consumers">
                <div className="arch-node">
                  <h4>Grasshopper</h4>
                  <small>Visual Scripting</small>
                </div>
                <div className="arch-node">
                  <h4>Python</h4>
                  <small>Automated Scripts</small>
                </div>
                <div className="arch-node">
                  <h4>Tapir MCP</h4>
                  <small>AI Agents (Claude)</small>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Project History</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">Phase 1</div>
                <div className="timeline-content">
                  <h4>The JSON API Foundation</h4>
                  <p>Tapir was born out of a need to bypass C++ complexity. The first major milestone was building the C++ Add-On to expose Archicad's core functions as a simple, stateless JSON API.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">Phase 2</div>
                <div className="timeline-content">
                  <h4>Grasshopper Integration</h4>
                  <p>To bring the power of Tapir to designers, the team developed the Grasshopper plugin, allowing visual programmers to manipulate Archicad elements parametrically.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">Phase 3</div>
                <div className="timeline-content">
                  <h4>Community & Python</h4>
                  <p>The project went fully open-source. A vibrant Discord community emerged, with dozens of contributors building and sharing their own Python automation scripts globally.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">Phase 4</div>
                <div className="timeline-content">
                  <h4>The AI Era (Current)</h4>
                  <p>The introduction of the Tapir MCP server enabled AI models like Claude to autonomously interact with Archicad, opening a new frontier of natural-language automation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="section-header">
          <h2>Why Tapir?</h2>
          <p>Everything you need to know about the project.</p>
        </div>
        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Incredibly Simple</h3>
            <p>Getting started is easy. Tapir wraps complex C++ APIs into an accessible, developer-friendly JSON and Python interface.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Ready</h3>
            <p>Designed for the future. With the new Tapir MCP, your AI assistants can interact directly with your Archicad models.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡️</div>
            <h3>Blazing Fast Development</h3>
            <p>The open-source project is accelerating rapidly, with continuous contributions pushing the boundaries of AEC automation.</p>
          </div>
        </div>
      </section>

      <section id="usecases" className="section">
        <div className="section-header">
          <h2>What is possible today?</h2>
          <p>12 ways the community is using Tapir to save time and redefine workflows.</p>
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

      <section id="learning" className="section">
        <div className="section-header">
          <h2>Learn & Build</h2>
          <p>Everything you need to master Archicad automation, from video guides to AI scripting.</p>
        </div>
        
        <div className="grid-3">
          <div className="feature-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Video Tutorials</h3>
              <p style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                Prefer visual learning? Check out our comprehensive YouTube playlist covering everything from installation to building your first automation scripts.
              </p>
            </div>
            <a href="https://youtube.com/playlist?list=PLGc943dgyfjjqzeFglpYLIPrcn_HFicDn&si=60f57YfregEnND9A" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "1rem", backgroundColor: "#ff0000", color: "#fff", textAlign: "center", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "bold" }}>
              ▶ Watch on YouTube
            </a>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div className="feature-card" style={{ height: "100%", padding: "2rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Create Scripts with Claude</h3>
              <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem", color: "var(--text-primary)" }}>
                The Tapir community is heavily utilizing AI models like Claude to generate complex scripts on the fly. Many users with zero prior coding experience are building tailored tools for their offices every single day.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Simply explain what you want to achieve in Archicad, share the Tapir command list, and let Claude write the Python code for you. If an error occurs, just paste the traceback back into Claude, and it will fix it immediately.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer" style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--accent)", color: "var(--accent)", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "500" }}>Command List ↗</a>
                <a href="https://pypi.org/project/tapir-archicad-mcp/" target="_blank" rel="noreferrer" style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "500" }}>Tapir MCP ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section id="marketplace" className="section">
        <div className="section-header">
          <h2>Tapir Marketplace</h2>
          <p>A place to find and share Tapir scripts and Archicad add-ons, built for the community and free to use.</p>
        </div>
        
        <div className="grid-2">
          <div className="feature-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(145deg, rgba(30,30,40,1) 0%, rgba(20,20,30,1) 100%)", borderColor: "var(--accent)" }}>
            <div>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Discover & Download</h3>
              <ul style={{ color: "var(--text-primary)", marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: "1.8" }}>
                <li><strong>No account needed:</strong> Search, filter by category or Archicad version, and download instantly.</li>
                <li><strong>Community Voting:</strong> Vote for what you find useful to help the best scripts surface.</li>
                <li><strong>Safe Downloads:</strong> Every download is fingerprinted and re-checked every hour for changes.</li>
              </ul>
            </div>
            <a href="https://tapir-marketplace.vercel.app/" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "1rem", backgroundColor: "var(--accent)", color: "#000", textAlign: "center", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>
              Explore the Marketplace ↗
            </a>
          </div>

          <div className="feature-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Publish Your Own Scripts</h3>
            <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              Publishing needs a free GitHub account. Fill in one form: name, description, category, and a download link. Automated checks run and your listing goes live, usually within a couple of minutes.
            </p>
            <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              <strong>Your listing stays yours.</strong> It is filed under your own GitHub name. You can edit or remove it whenever you like.
            </p>
            <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              <strong>Support the Creators.</strong> Scripts can be free, free with a contribution link, or paid. In every case, you pay the author directly through their own link. The site never handles a payment or takes a cut.
            </p>
          </div>
        </div>
      </section>

      <section id="roadmap" className="section">
        <div className="section-header">
          <h2>What's Cooking?</h2>
          <p>The 12 most anticipated features and ideas driving the next versions of Tapir.</p>
        </div>
        <div className="grid-4">
          {roadmap.map((item, idx) => (
            <div className="feature-card" key={idx} style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.85rem" }}>{item.desc || item.expanded}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stats" className="section">
        <div className="section-header">
          <h2>Community & Momentum</h2>
          <p>Tapir is powered by an accelerating open-source community across GitHub and Discord.</p>
        </div>
        
        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div className="stat-value">1,096</div>
            <div className="stat-label">GitHub Commits</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">2,553</div>
            <div className="stat-label">Discord Messages</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">109</div>
            <div className="stat-label">Active Participants</div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div style={{ gridColumn: "span 3" }}>
            <div className="feature-card" style={{ height: "400px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Growth Over Time</h3>
              <div style={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDiscord" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5865F2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#5865F2" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGitHub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="name" stroke="#a3a3a3" tick={{ fill: '#a3a3a3', fontSize: 12 }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#a3a3a3" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="Discord" stackId="1" stroke="#5865F2" fillOpacity={1} fill="url(#colorDiscord)" />
                    <Area type="monotone" dataKey="GitHub" stackId="1" stroke="#a3a3a3" fillOpacity={1} fill="url(#colorGitHub)" />
                    <Area type="monotone" dataKey="Commits" stackId="1" stroke="#ffffff" fillOpacity={1} fill="url(#colorCommits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div style={{ gridColumn: "span 2" }}>
            <div className="feature-card" style={{ height: "100%" }}>
              <h3>Project Momentum</h3>
              <p style={{ marginBottom: "1rem" }}>
                Development speed has accelerated massively over the past year. 
                With <strong>314 active Issues, Pull Requests, and Discussions</strong> currently tracked, 
                and <strong>29 unique code contributors</strong> submitting patches, the ecosystem is growing faster than ever. 
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
      </section>

      <footer className="footer">
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer">📖 Documentation & Command List</a>
          <a href="https://github.com/enzyme-apd/tapir-archicad-automation" target="_blank" rel="noreferrer">💻 GitHub Project</a>
          <a href="https://discord.gg/FZAM7Fbg7C" target="_blank" rel="noreferrer">💬 Discord Community</a>
        </div>
        <p>Built for the Tapir Community.</p>
      </footer>
    </div>
  );
}

export default App;
