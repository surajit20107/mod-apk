# 🚀 Premium APK Store

A powerful, modern admin dashboard for managing an APK/App store.  
Built with **Next.js**, **TypeScript**, **MongoDB**, and an intuitive UI, it lets you securely manage Android app listings through a feature-rich, beautiful interface.

---

## ✨ Features

- **Secure Admin Authentication**
  - Sign-in / Sign-up flows with role-based access control
  - JWT-based sessions, stored in HTTP-only cookies
- **App Management Dashboard**
  - List, create, edit, and delete APK/App entries
  - Search and paginate through apps with ease
- **Robust API**
  - Clean RESTful endpoints for all core functions
  - Middleware protected admin routes
- **Image Hosting**
  - Cloudinary integration for app icon and screenshot uploads
- **Modern UX**
  - Responsive, intuitive design built with Tailwind CSS and React components

---

## 📂 Project Structure

```
├── app/          # Next.js application pages (App Router)
├── components/   # Reusable UI components
├── models/       # Mongoose data models (User, Apk, etc)
├── lib/          # Utilities and helper functions
├── public/       # Static files (images, assets)
├── proxy.ts      # Backend proxy/API logic
├── env.sample    # Example environment variables
├── ...           # Configuration and setup files
```

---

## 🛣️ Core Routes

### Frontend
- `/admin/signin` — Admin login
- `/admin/signup` — Admin registration
- `/admin/dashboard` — Manage and browse apps
- `/admin/create-app` — Add new apps
- `/admin/edit-app/[id]` — Edit existing apps

### API
- `POST /api/admin/signin` — Authenticate admin
- `POST /api/admin/register` — Register new admin
- `POST /api/admin/logout` — Logout admin
- `GET  /api/v1/admin` — List all apps (pagination & search)
- `POST /api/v1/admin` — Add a new app
- `GET  /api/v1/admin/apps/[id]` — Single app details
- `PUT  /api/v1/admin/apps/[id]` — Update app
- `DELETE /api/v1/admin/apps/[id]` — Remove app

---

## 🔒 Authentication Flow

1. Admin signs in with credentials
2. Credentials (and admin role) verified server-side
3. JWT issued and stored in HTTP-only cookie
4. Route middleware ensures admin is authenticated
5. API routes verify session against database entry

---

## 🛠️ Tech Stack

- **Next.js 16 (App Router)**
- **React 19 & TypeScript**
- **TailwindCSS** for styling
- **MongoDB + Mongoose** (fast, scalable database)
- **Cloudinary** for image/file hosting
- **bcrypt** for password security
- **jsonwebtoken** for auth/session handling

---

## ⚡ Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/surajit20107/mod-apk.git
   cd mod-apk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup your environment:**
   - Copy `.env.sample` to `.env`
   - Fill in required variables:
     - `JWT_SECRET`
     - `MONGODB_URI`
     - Cloudinary credentials

4. **Run the app:**
   ```bash
   npm run dev
   # Open http://localhost:5000
   ```

---

## 📝 License

MIT.  
Feel free to fork, improve, and use for your APK store admin needs.

---

## 🙏 Credits

Built by [surajit](https://github.com/surajit20107).

---

> _For full details on endpoints, usage, or contributing, see the source and code comments._
