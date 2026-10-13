<div align="center">
  <img src="./public/logo-black.png" alt="Relinxr Logo" width="120"/>
  <h1>Relinxr</h1>
  <p><strong>Modern open-source link shortener built with Next.js & MongoDB.</strong></p>
  <p>Custom domains, analytics, and blazing-fast redirects — all in one place.</p>

  <a href="https://relinxr.com">🌐 relinxr.com</a>
</div>

---

## 🚀 About the Project

**Relinxr** is an open-source platform for working with links — shortening, tracking, and managing them with simplicity and speed.

It’s built to deliver everything you expect from a modern link shortener like Bitly or TinyURL, but with an open codebase, full transparency, and beautiful UX.

---

## 🧠 Core Features

- 🔗 **Shorten links instantly** — create clean short URLs in a single click  
- 📊 **Track visits** — each redirect is logged in MongoDB with IP and user-agent  
- ⚙️ **Open API** — built with RESTful endpoints for flexibility and integration  
- 🌐 **Custom domain ready** — deploy under your own brand  
- 🧩 **Full-stack Next.js 15 app** — server actions, App Router, TypeScript, Mongoose  
- 🪶 **Beautiful UI** — built with TailwindCSS + smooth interactive components  

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Framework** | [Next.js 15 (App Router, Server Actions)](https://nextjs.org) |
| **Frontend** | React 18, TypeScript, TailwindCSS |
| **Backend** | Next.js API Routes, Node.js, Mongoose |
| **Database** | MongoDB Atlas |
| **ORM / ODM** | Mongoose |
| **Deployment** | [Vercel](https://vercel.com) |
| **Env Config** | `.env.local` + Vercel Environment Variables |

---

## ⚙️ Environment Variables

Before running locally, create `.env.local` from the template (`cp .env.example .env.local`) and fill it in:

```bash
MONGO_URI=mongodb+srv://...          # required
JWT_SECRET=a-long-random-string      # required
MONGODB_DB=relinxr                   # optional
IPINFO_API_TOKEN=...                 # optional, enables country analytics
NEXT_PUBLIC_SHORT_DOMAIN=rld.bio     # optional, host shown for short links
NEXT_PUBLIC_SITE_URL=https://rld.bio # optional, used for OG metadata
```

---

## 💻 Local Development

# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your app
http://localhost:3000

# Run tests (downloads a MongoDB binary on first run)
npm test

---

## ☁️ Deployment

Relinxr is fully optimized for **Vercel**.

**Steps to deploy:**

1. 🪣 Push your code to **GitHub**  
2. 🔗 Connect the repository on [vercel.com](https://vercel.com)  
3. ⚙️ Add **MONGO_URI** and **JWT_SECRET** (plus any optional variables) in your Environment settings  
4. 🚀 Click **Deploy** — and you're live!

---

## 📜 License

This project is open-source under the **MIT License**.  
You are free to use, modify, and distribute it.

---