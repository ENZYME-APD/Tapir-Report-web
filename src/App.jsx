import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import githubData from './data/github_data.json';
import discordData from './data/discord_data.json';
import commitsData from './data/commits_data.json';
import { changeLanguage, SUPPORTED_LANGUAGES } from './i18n.js';
import './index.css';

function App() {
  const { t, i18n } = useTranslation();

  const useCases = t('usecases.items', { returnObjects: true });
  const roadmap = t('roadmap.items', { returnObjects: true });
  const archPhases = t('architecture.phases', { returnObjects: true });
  const aboutCards = t('about.cards', { returnObjects: true });

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
      const monthName = date.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' });
      return {
        ...item,
        name: `${monthName} '${year.slice(2)}`
      };
    });

    setChartData(formattedData);
  }, [i18n.language]);

  return (
    <div className="container">
      <nav className="navbar">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <img src="/tapir-logo.svg" alt="Tapir Logo" className="logo-icon-img" />
          Tapir
        </a>
        <div className="nav-links">
          <a href="#about">{t('nav.about')}</a>
          <a href="#architecture">{t('nav.architecture')}</a>
          <a href="#usecases">{t('nav.usecases')}</a>
          <a href="#learning">{t('nav.learning')}</a>
          <a href="#marketplace">{t('nav.marketplace')}</a>
          <a href="#roadmap">{t('nav.roadmap')}</a>
          <a href="#stats">{t('nav.stats')}</a>
          <div className="lang-switcher" role="group" aria-label={t('langSwitcher.label')}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`lang-switcher-btn${i18n.language === lang ? ' active' : ''}`}
                onClick={() => changeLanguage(lang)}
                aria-current={i18n.language === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div style={{ display: "inline-block", padding: "0.5rem 1.25rem", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "2rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "500", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {t('hero.badge')}
        </div>
        <h1 className="text-gradient">{t('hero.title')}</h1>
        <p>
          <Trans i18nKey="hero.description" components={[<strong key="0" />]} />
        </p>
        <div className="hero-buttons">
          <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer" className="btn btn-primary">{t('hero.docsButton')}</a>
          <a href="https://pypi.org/project/tapir-archicad-mcp/" target="_blank" rel="noreferrer" className="btn btn-secondary">{t('hero.mcpButton')}</a>
        </div>
      </section>

      <section id="architecture" className="section">
        <div className="section-header">
          <h2>{t('architecture.title')}</h2>
          <p>{t('architecture.subtitle')}</p>
        </div>

        <div className="grid-2">
          <div className="feature-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{t('architecture.systemTitle')}</h3>
            <p style={{ color: "var(--text-primary)", marginBottom: "2rem" }}>
              {t('architecture.systemDesc')}
            </p>

            <div className="architecture-diagram">
              <div className="arch-layer core">
                <h4>{t('architecture.archicad')}</h4>
                <small>{t('architecture.archicadSub')}</small>
              </div>
              <div className="arch-arrow">↓</div>
              <div className="arch-layer addon">
                <h4>{t('architecture.addon')}</h4>
                <small>{t('architecture.addonSub')}</small>
              </div>
              <div className="arch-arrow">↓</div>
              <div className="arch-consumers">
                <div className="arch-node">
                  <h4>{t('architecture.grasshopper')}</h4>
                  <small>{t('architecture.grasshopperSub')}</small>
                </div>
                <div className="arch-node">
                  <h4>{t('architecture.python')}</h4>
                  <small>{t('architecture.pythonSub')}</small>
                </div>
                <div className="arch-node">
                  <h4>{t('architecture.mcp')}</h4>
                  <small>{t('architecture.mcpSub')}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{t('architecture.historyTitle')}</h3>
            <div className="timeline">
              {archPhases.map((phase, idx) => (
                <div className="timeline-item" key={idx}>
                  <div className="timeline-date">{phase.date}</div>
                  <div className="timeline-content">
                    <h4>{phase.title}</h4>
                    <p>{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="section-header">
          <h2>{t('about.title')}</h2>
          <p>{t('about.subtitle')}</p>
        </div>
        <div className="grid-3">
          {aboutCards.map((card, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="usecases" className="section">
        <div className="section-header">
          <h2>{t('usecases.title')}</h2>
          <p>{t('usecases.subtitle')}</p>
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
          <h2>{t('learning.title')}</h2>
          <p>{t('learning.subtitle')}</p>
        </div>

        <div className="grid-3">
          <div className="feature-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t('learning.videoTitle')}</h3>
              <p style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                {t('learning.videoDesc')}
              </p>
            </div>
            <a href="https://youtube.com/playlist?list=PLGc943dgyfjjqzeFglpYLIPrcn_HFicDn&si=60f57YfregEnND9A" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "1rem", backgroundColor: "#ff0000", color: "#fff", textAlign: "center", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "bold" }}>
              {t('learning.videoButton')}
            </a>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div className="feature-card" style={{ height: "100%", padding: "2rem" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t('learning.claudeTitle')}</h3>
              <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {t('learning.claudeDesc1')}
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                {t('learning.claudeDesc2')}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer" style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--accent)", color: "var(--accent)", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "500" }}>{t('learning.commandListButton')}</a>
                <a href="https://pypi.org/project/tapir-archicad-mcp/" target="_blank" rel="noreferrer" style={{ padding: "0.75rem 1.5rem", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "500" }}>{t('learning.mcpButton')}</a>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section id="marketplace" className="section">
        <div className="section-header">
          <h2>{t('marketplace.title')}</h2>
          <p>{t('marketplace.subtitle')}</p>
        </div>

        <div className="grid-2">
          <div className="feature-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(145deg, rgba(30,30,40,1) 0%, rgba(20,20,30,1) 100%)", borderColor: "var(--accent)" }}>
            <div>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "var(--text-primary)" }}>{t('marketplace.discoverTitle')}</h3>
              <ul style={{ color: "var(--text-primary)", marginBottom: "1.5rem", paddingLeft: "1.5rem", lineHeight: "1.8" }}>
                <li><Trans i18nKey="marketplace.bullet1" components={[<strong key="0" />]} /></li>
                <li><Trans i18nKey="marketplace.bullet2" components={[<strong key="0" />]} /></li>
                <li><Trans i18nKey="marketplace.bullet3" components={[<strong key="0" />]} /></li>
              </ul>
            </div>
            <a href="https://tapir-marketplace.vercel.app/" target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "1rem", backgroundColor: "var(--accent)", color: "#000", textAlign: "center", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>
              {t('marketplace.exploreButton')}
            </a>
          </div>

          <div className="feature-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t('marketplace.publishTitle')}</h3>
            <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              {t('marketplace.publishDesc1')}
            </p>
            <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              <Trans i18nKey="marketplace.publishDesc2" components={[<strong key="0" />]} />
            </p>
            <p style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
              <Trans i18nKey="marketplace.publishDesc3" components={[<strong key="0" />]} />
            </p>
          </div>
        </div>
      </section>

      <section id="roadmap" className="section">
        <div className="section-header">
          <h2>{t('roadmap.title')}</h2>
          <p>{t('roadmap.subtitle')}</p>
        </div>
        <div className="grid-4">
          {roadmap.map((item, idx) => (
            <div className="feature-card" key={idx} style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.85rem" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stats" className="section">
        <div className="section-header">
          <h2>{t('stats.title')}</h2>
          <p>{t('stats.subtitle')}</p>
        </div>

        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <div className="stat-value">1,096</div>
            <div className="stat-label">{t('stats.githubCommits')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">2,553</div>
            <div className="stat-label">{t('stats.discordMessages')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">109</div>
            <div className="stat-label">{t('stats.activeParticipants')}</div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div style={{ gridColumn: "span 3" }}>
            <div className="feature-card" style={{ height: "400px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>{t('stats.growthTitle')}</h3>
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
                    <Area type="monotone" dataKey="Discord" name={t('stats.chart.discord')} stackId="1" stroke="#5865F2" fillOpacity={1} fill="url(#colorDiscord)" />
                    <Area type="monotone" dataKey="GitHub" name={t('stats.chart.github')} stackId="1" stroke="#a3a3a3" fillOpacity={1} fill="url(#colorGitHub)" />
                    <Area type="monotone" dataKey="Commits" name={t('stats.chart.commits')} stackId="1" stroke="#ffffff" fillOpacity={1} fill="url(#colorCommits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div style={{ gridColumn: "span 2" }}>
            <div className="feature-card" style={{ height: "100%" }}>
              <h3>{t('stats.momentumTitle')}</h3>
              <p style={{ marginBottom: "1rem" }}>
                <Trans i18nKey="stats.momentumDesc1" components={[<strong key="0" />, <strong key="1" />]} />
              </p>
              <p>
                <Trans i18nKey="stats.momentumDesc2" components={[<strong key="0" />]} />
              </p>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: "1rem" }}>{t('stats.contributorsTitle')}</h3>
            <div className="leaderboard">
              {leaderboard.map((user, idx) => (
                <div className="leaderboard-item" key={idx}>
                  <div className="leaderboard-name">{user.name}</div>
                  <div className="leaderboard-score">{user.commits} {t('stats.commitsUnit')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="https://enzyme-apd.github.io/tapir-archicad-automation/archicad-addon/" target="_blank" rel="noreferrer">{t('footer.docs')}</a>
          <a href="https://github.com/enzyme-apd/tapir-archicad-automation" target="_blank" rel="noreferrer">{t('footer.github')}</a>
          <a href="https://discord.gg/FZAM7Fbg7C" target="_blank" rel="noreferrer">{t('footer.discord')}</a>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.6" }}>
          <p><Trans i18nKey="footer.license" components={[<strong key="0" />]} /></p>
          <p>{t('footer.maintained')} <a href="mailto:contact@enzyme-apd.com" style={{color: "var(--accent)"}}>{t('footer.contact')}</a></p>
          <p style={{ marginTop: "1rem", opacity: 0.7 }}>{t('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
