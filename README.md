<div align="center">
  <img src="./public/logo1.png" alt="Relinxr Logo" width="120"/>
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

Before running locally, create a `.env.local` file in the project root

---

## 💻 Local Development

# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your app
http://localhost:3000

---

## ☁️ Deployment

Relinxr is fully optimized for Vercel.
	1.	Push your code to GitHub
	2.	Connect the repo on vercel.com
	3.	Add MONGO_URI in Environment Variables
	4.	Deploy 🎉

---

## ☁️ License

This project is open-source under the MIT License.