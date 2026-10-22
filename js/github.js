// ===========================================================
// Pulls public repos from the GitHub
// ===========================================================

const GitHubProjects = (() => {
  const CACHE_KEY = "gh_repo_cache_v2:";
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  function scoreRepo(repo) {
    const daysSincePush = (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000;
    const recencyBonus = Math.max(0, 60 - daysSincePush) * 0.5;
    return (repo.stargazers_count * 3) + (repo.forks_count * 2) + recencyBonus;
  }

  async function fetchRepos(username) {
    return fetchCached(`users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`);
  }

  async function fetchCached(path) {
    const cached = readCache(path);
    if (cached) return cached;

    const res = await fetch(`https://api.github.com/${path}`);
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = await res.json();
    writeCache(path, repos);
    return repos;
  }

  function readCache(path) {
    try {
      const raw = localStorage.getItem(CACHE_KEY + path);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch { return null; }
  }

  function writeCache(path, data) {
    try { localStorage.setItem(CACHE_KEY + path, JSON.stringify({ ts: Date.now(), data })); } catch {}
  }

  function rank(repos, ignoreList, pinnedOverride) {
    const matches = (repo, name) => [repo.name, repo.full_name].some(value => value?.toLowerCase() === name.toLowerCase());
    const visible = repos.filter(r => !r.fork && !r.private && !ignoreList.some(name => matches(r, name)));
    const pinned = [];
    pinnedOverride.forEach(name => {
      const match = visible.find(r => matches(r, name));
      if (match && !pinned.includes(match)) pinned.push(match);
    });
    const rest = visible
      .filter(r => !pinned.includes(r))
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
          <h4>${escapeHTML(repo.full_name || repo.name)}</h4>
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

  async function renderInto(containerEl, { username, ignoreList = [], pinnedOverride = [], selectedRepos = [] }) {
    if (!containerEl) return;
    containerEl.innerHTML = `<p class="gh-loading">Fetching live repos from GitHub…</p>`;
    try {
      const results = await Promise.allSettled([
        fetchRepos(username),
        ...selectedRepos.map(name => fetchCached(`repos/${name}`))
      ]);
      const repos = [...new Map(results.filter(result => result.status === "fulfilled")
        .flatMap(result => result.value).map(repo => [repo.full_name, repo])).values()];
      if (!repos.length && results.some(result => result.status === "rejected")) throw new Error("GitHub unavailable");
      const { pinned, rest } = rank(repos, ignoreList, pinnedOverride);

      if (pinned.length === 0 && rest.length === 0) {
        containerEl.innerHTML = `<p class="gh-loading">No public repos found yet.</p>`;
        return;
      }

      let html = results.some(result => result.status === "rejected")
        ? '<p class="gh-error">Some GitHub updates are unavailable. Showing the repositories we could load.</p>' : "";
      pinned.forEach(r => html += cardHTML(r, true));
      rest.slice(0, 12).forEach(r => html += cardHTML(r, false));
      containerEl.innerHTML = html;
    } catch (err) {
      containerEl.innerHTML = `<p class="gh-error">Couldn't reach the GitHub API right now (rate limit or offline). <a href="https://github.com/${username}?tab=repositories" target="_blank" rel="noopener noreferrer">View repos directly on GitHub →</a></p>`;
    }
  }

  return { renderInto };
})();
