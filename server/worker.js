// ===========================================================
// Portfolio OS — community backend (Cloudflare Worker)
// ===========================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(env);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    try {
      if (url.pathname === "/api/visit" && request.method === "POST") {
        const count = await incrementVisits(env);
        return json({ count }, cors);
      }

      if (url.pathname === "/api/feedback" && request.method === "GET") {
        const feedback = await getFeedback(env);
        return json({ feedback }, cors);
      }

      if (url.pathname === "/api/feedback" && request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const name = String(body.name || "Anonymous").trim().slice(0, 60) || "Anonymous";
        const message = String(body.message || "").trim().slice(0, 800);
        if (!message) return json({ error: "Message required" }, cors, 400);
        const entry = await addFeedback(env, { name, message });
        return json({ entry }, cors);
      }

      return json({ error: "Not found" }, cors, 404);
    } catch (err) {
      return json({ error: err.message || "Server error" }, cors, 500);
    }
  }
};

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(data, cors, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors }
  });
}

// ---------------------------------------------------------
// Visit counter — Workers KV
// ---------------------------------------------------------
async function incrementVisits(env) {
  const current = parseInt((await env.VISITS_KV.get("count")) || "0", 10);
  const next = current + 1;
  await env.VISITS_KV.put("count", String(next));
  return next;
}

// ---------------------------------------------------------
// Feedback — GitHub Contents API (data/feedback.json)
// ---------------------------------------------------------
const GH_API = "https://api.github.com";
const FEEDBACK_PATH = "data/feedback.json";

function ghHeaders(env) {
  return {
    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github+json",
    "User-Agent": "portfolio-os-feedback-worker"
  };
}

async function ghGetFile(env, path) {
  const branch = env.GITHUB_BRANCH || "main";
  const res = await fetch(
    `${GH_API}/repos/${env.GITHUB_REPO}/contents/${path}?ref=${branch}`,
    { headers: ghHeaders(env) }
  );
  if (res.status === 404) return { data: [], sha: null };
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const file = await res.json();
  const content = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ""))));
  let data = [];
  try { data = JSON.parse(content || "[]"); } catch { data = []; }
  return { data, sha: file.sha };
}

async function ghPutFile(env, path, data, sha, message) {
  const branch = env.GITHUB_BRANCH || "main";
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  const body = { message, content: encoded, branch };
  if (sha) body.sha = sha;

  const res = await fetch(`${GH_API}/repos/${env.GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    headers: { ...ghHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`);
  return res.json();
}

async function getFeedback(env) {
  const { data } = await ghGetFile(env, FEEDBACK_PATH);
  return data;
}

async function addFeedback(env, { name, message }) {
  const { data, sha } = await ghGetFile(env, FEEDBACK_PATH);
  const entry = { name, message, date: new Date().toISOString() };
  data.unshift(entry);
  await ghPutFile(env, FEEDBACK_PATH, data, sha, `feedback: ${name}`);
  return entry;
}
