# Jarvis — Setup Guide (Vercel only)

Everything runs on **Vercel**. You do not need Cloudflare. It takes about 15–20 minutes and costs nothing (a domain name is optional).

## What is in this folder
| File | Part | What it does |
|------|------|--------------|
| `index.html` | Front end | The website people see and use |
| `logo.svg` | Front end | The Jarvis logo |
| `api/chat.js` | Back end | Keeps your secret key safe and talks to the AI |
| `package.json` | Project | Tells Vercel this is a project |
| `README.md`, `SETUP.md` | Docs | Descriptions |

How it works: **Browser (`index.html`) → `/api/chat` on Vercel → Gemini AI (Google)**

---

## Step 1 — Get a free Gemini API key
1. Go to **aistudio.google.com** and sign in with Google.
2. Click **Get API key → Create API key**.
3. Copy it and keep it private. **Never put it in a file or on GitHub.**

## Step 2 — Put the files on GitHub
1. Create a free account at **github.com** and make a **New repository** (for example `jarvis-ai`).
2. Upload the files so that `index.html` is at the **top level** of the repository, and `chat.js` is inside a folder named `api`:
   ```
   index.html
   logo.svg
   package.json
   README.md
   SETUP.md
   api/chat.js
   ```
3. Easiest way to add the `api` folder: on GitHub click **Add file → Create new file**, type `api/chat.js` as the file name (typing the `/` makes the folder), paste the contents of `chat.js`, and click **Commit changes**.

## Step 3 — Deploy on Vercel
1. Go to **vercel.com** and sign up with your GitHub account.
2. Click **Add New → Project**, choose your repository, and click **Import**.
3. Framework Preset: **Other**. Leave the build settings empty.
4. Open **Environment Variables** and add:
   - Name: `GEMINI_API_KEY`
   - Value: your key from Step 1
5. Click **Deploy**. You get a link like `jarvis-ai.vercel.app`.

## Step 4 — Test it
Open your link and click a suggestion card such as "Explain simply". If an answer appears, you are done.

## If you added the key after deploying
Vercel only reads a new Environment Variable on a **new deployment**. Go to **Deployments**, click the three dots on the latest one, and choose **Redeploy**.

## Step 5 — Your own domain (optional)
Buy a name (for example `jarvisyourname.com`) from GoDaddy, Namecheap or Cloudflare. It costs a yearly fee. In Vercel go to **Project → Settings → Domains** and add it.

---

## Settings you can change
- In `api/chat.js`: `DAILY_LIMIT` (messages per person per day, default 60).
- Model name: set an Environment Variable `GEMINI_MODEL` in Vercel (default `gemini-2.5-flash`). Use this if you get a "model not found" error. Check the current names in AI Studio.

## Troubleshooting
| Problem | Fix |
|---------|-----|
| "Server key is not set up yet." | `GEMINI_API_KEY` is missing or misspelled. Add it, then **Redeploy** |
| 404 when chatting | `chat.js` is not inside a folder named `api` at the top of the repository |
| Error about the model | Set `GEMINI_MODEL` to a current model name, then Redeploy |
| "Daily limit reached." | That person used their messages for today. Raise `DAILY_LIMIT` if you want |
| Very long answers cut off or time out | Vercel's free plan has a time limit per request. Ask for shorter answers |
| Mic does not work | Use Chrome or Edge, allow the microphone, and open the site from its link |
| Replies stop working suddenly | Your free Gemini quota may be used up for today. Try later |

## Good to know
- Chats and memory are saved only in each person's own browser. There is no sign-in.
- The daily limit is a soft limit (it is kept in the server's memory and can reset).
- Be honest on GitHub: this project is built with the Gemini API. You built the app (website, backend, voice, memory), not the AI model itself.
