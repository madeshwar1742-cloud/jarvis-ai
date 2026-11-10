// Jarvis API — Vercel Serverless Function (runs at /api/chat)
// Holds your Gemini key secretly (as a Vercel Environment Variable) so users never need a key.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"; // if Google renames it, set GEMINI_MODEL in Vercel or edit here
const DAILY_LIMIT = 60;          // messages per person per day (protects your free quota)
const MAX_MESSAGES = 20;         // chat history sent per request
const MAX_CHARS = 4000;          // max characters per message
const MAX_SYSTEM_CHARS = 8000;   // max characters of memory/instructions

const counts = new Map();        // simple per-instance counter (best effort)

function overLimit(req) {
  const ip = String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown").split(",")[0].trim();
  const key = new Date().toISOString().slice(0, 10) + ":" + ip;
  const n = counts.get(key) || 0;
  if (n >= DAILY_LIMIT) return true;
  counts.set(key, n + 1);
  if (counts.size > 5000) counts.clear();
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  // Only your own website may use this endpoint from a browser.
  const origin = req.headers.origin;
  if (origin) {
    let ok = false;
    try { ok = new URL(origin).host === req.headers.host; } catch (e) {}
    if (!ok) return res.status(403).json({ error: "Not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server key is not set up yet." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Bad request" });

  const system = String(body.system || "").slice(0, MAX_SYSTEM_CHARS);
  const msgs = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const contents = msgs.map(m => ({
    role: m && m.role === "assistant" ? "model" : "user",
    parts: [{ text: String((m && m.content) || "").slice(0, MAX_CHARS) }],
  }));
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    return res.status(400).json({ error: "No question received." });
  }

  if (overLimit(req)) {
    return res.status(429).json({ error: "Daily limit reached. Please try again tomorrow." });
  }

  const payload = { contents, generationConfig: { maxOutputTokens: 1536 } };
  if (system) payload.systemInstruction = { parts: [{ text: system }] };

  let upstream, data;
  try {
    upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(payload),
      }
    );
    data = await upstream.json().catch(() => ({}));
  } catch (e) {
    return res.status(502).json({ error: "Could not reach the AI. Try again." });
  }

  if (!upstream.ok) {
    return res.status(502).json({ error: (data && data.error && data.error.message) || ("AI error " + upstream.status) });
  }

  const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
  let reply = parts.map(p => p.text || "").join("").trim();
  if (!reply) reply = "Sorry, I couldn't answer that. Try asking it a different way.";
  return res.status(200).json({ reply });
};
