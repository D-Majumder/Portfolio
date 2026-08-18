// ===========================================================
// Pulls public repos from the GitHub
// ===========================================================

const GitHubProjects = (() => {
  const CACHE_KEY = "gh_repo_cache_v1";
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  function scoreRepo(repo) {
    const daysSincePush = (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000;
    const recencyBonus = Math.max(0, 60 - daysSincePush) * 0.5;
    return (repo.stargazers_count * 3) + (repo.forks_count * 2) + recencyBonus;
  }

  async function fetchRepos(username) {
    const cached = readCache();
    if (cached) return cached;

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`);
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = await res.json();
    writeCache(repos);
    return repos;
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch { return null; }
  }

  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
  }

  function rank(repos, ignoreList, pinnedOverride) {
    const visible = repos.filter(r => !r.fork && !ignoreList.includes(r.name));
    const pinned = [];
    pinnedOverride.forEach(name => {
      const match = visible.find(r => r.name === name);
      if (match) pinned.push(match);
    });
    const rest = visible
      .filter(r => !pinnedOverride.includes(r.name))
      .sort((a, b) => scoreRepo(b) - scoreRepo(a));
    return { pinned, rest };
  }

  function timeAgo(dateStr) {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days < 1) return "today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }

  function cardHTML(repo, isPinned) {
    const desc = repo.description ? escapeHTML(repo.description) : "No description yet.";
    return `
      <a class="project-card" href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="display:block; text-decoration:none; color:inherit;">
        <div class="project-card-head">
          <h4>${escapeHTML(repo.name)}</h4>
          ${isPinned ? '<span class="pin-badge">★ Featured</span>' : ''}
        </div>
        <p>${desc}</p>
        <div class="project-meta">
          ${repo.language ? `<span>● ${escapeHTML(repo.language)}</span>` : ''}
          <span>✦ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
          <span>Updated ${timeAgo(repo.pushed_at)}</span>
        </div>
      </a>`;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function renderInto(containerEl, { username, ignoreList = [], pinnedOverride = [] }) {
    containerEl.innerHTML = `<p class="gh-loading">Fetching live repos from GitHub…</p>`;
    try {
      const repos = await fetchRepos(username);
      const { pinned, rest } = rank(repos, ignoreList, pinnedOverride);

      if (pinned.length === 0 && rest.length === 0) {
        containerEl.innerHTML = `<p class="gh-loading">No public repos found yet.</p>`;
        return;
      }

      let html = "";
      pinned.forEach(r => html += cardHTML(r, true));
      rest.slice(0, 12).forEach(r => html += cardHTML(r, false));
      containerEl.innerHTML = html;
    } catch (err) {
      containerEl.innerHTML = `<p class="gh-error">Couldn't reach the GitHub API right now (rate limit or offline). <a href="https://github.com/${username}?tab=repositories" target="_blank" rel="noopener noreferrer">View repos directly on GitHub →</a></p>`;
    }
  }

  return { renderInto };
})();
