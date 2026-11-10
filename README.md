# Jarvis — AI Chat Assistant

<img src="logo.svg" width="96" alt="Jarvis logo">

A ChatGPT / Gemini-style AI chat website. Open the link and start chatting — **no sign-up and no API key for users.**

> Built with the **Gemini API**. The AI model is Google's; Jarvis is the full app around it (UI, chat history, memory, voice, secure backend).

## Features
- Clean chat interface with a sidebar of past chats and a "New chat" button
- Light and dark theme, works on phone and laptop
- Typing-style replies, Markdown formatting and copy buttons for code
- Voice input (microphone) and spoken replies
- Memory: Jarvis remembers things you tell it (saved only in your browser)
- Replies in the language you write (English, Tamil, Tanglish…)
- No sign-up needed

## How it works
```
Browser (index.html)  →  Vercel serverless function (/api/chat, holds the secret key)  →  Gemini API
```
The API key lives only in a Vercel Environment Variable. It is **never** in this repository or in the web page.

## Files
| File | What it is |
|------|-----------|
| `index.html` | The whole website (front end) |
| `logo.svg` | Jarvis logo |
| `api/chat.js` | Back end: talks to Gemini and limits usage per person |
| `package.json` | Project info for Vercel |
| `SETUP.md` | Step-by-step setup guide |

## Set it up yourself
See [SETUP.md](SETUP.md). In short: get a free Gemini key → upload these files to GitHub → import the repo in Vercel → add `GEMINI_API_KEY` as an Environment Variable → redeploy.

## Safety notes
- Never commit an API key to GitHub.
- The back end only accepts requests from your own website and limits each user per day (`DAILY_LIMIT` in `api/chat.js`).
- Jarvis can make mistakes — double-check important information.

## Ideas for later
- Streaming replies, image upload, installable app (PWA), optional sign-in to sync chats across devices.
