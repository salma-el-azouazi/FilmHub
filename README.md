# FilmHub - 3D Movie Blog & Community Platform

FilmHub is a full-stack university E-Business project for cinematic movie blogging and community discussion. It includes a React + TypeScript + Vite frontend, Node.js + Express backend, MySQL schema, JWT authentication, bcrypt password hashing, Multer uploads, role-based authorization, Tailwind CSS, Three.js, Framer Motion, Lucide icons, and Chart.js admin analytics.

## Features

- Public pages: home, blog listing, blog details, categories, search, author profile, about, contact.
- User pages: dashboard, create/edit posts, drafts/publishing, my posts, bookmarks, notifications, settings.
- Admin pages: dashboard, manage users, manage posts, manage categories, manage comments, analytics.
- Community actions: follow/unfollow users, comments/replies data model, likes, bookmarks, notifications.
- Blog features: SEO slugs, categories, tags, ratings, featured images, trailer URLs/files, drafts, moderation statuses.
- Security: JWT auth, bcrypt hashing, parameterized MySQL queries, role checks, Helmet, rate limiting, upload type/size checks, basic HTML sanitization before rendering.

## Project Structure

```text
filmhub/
  client/                 React + TypeScript + Vite app
    src/components/       Shared UI, 3D hero, cards, admin shell
    src/context/          Auth context
    src/lib/              API helpers and types
    src/pages/            Public, user, and admin pages
  server/                 Express API
    src/config/           MySQL pool
    src/controllers/      API controller logic
    src/middleware/       Auth, uploads, error handling
    src/routes/           Auth, users, posts, categories, admin routes
    src/utils/            JWT and slug helpers
    uploads/              Uploaded images, posters, GIFs, and trailers
  database/
    schema.sql            MySQL database and tables
    init.sql              Schema + seed data
```

## Installation

1. Install dependencies from the project root:

```bash
npm install
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

3. Create and seed the MySQL database from the project root:

```bash
mysql -u root -p < database/init.sql
```

For an existing FilmHub database, run the feature expansion migration instead of reseeding:

```bash
mysql -u root -p filmhub < database/migrations/001_requested_feature_expansion.sql
```

Password reset and contact email use Gmail SMTP when `SMTP_USER` and `SMTP_PASSWORD` are configured in `server/.env`. Use a Gmail App Password for `SMTP_PASSWORD`; without it, emails are written to `server/dev-mails/` for local development and will not arrive in Gmail.

4. Start the full stack:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`

## Optional Real Movie API

FilmHub includes real trailer embeds and static movie details for the demo. To enhance movie pages with live TMDb metadata, add a TMDb API key to `client/.env`:

```bash
VITE_TMDB_API_KEY=your_tmdb_key
```

## Demo Login

- Admin: `admin@filmhub.test`
- Password: `FilmHub123!`

The seed users use the same demo password.

## Useful Scripts

```bash
npm run dev      # start Express and Vite together
npm run build    # build the React app
npm run start    # start the Express server
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/remember`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/contact`
- `GET /api/movies/:movieKey/stats`
- `POST /api/movies/:movieKey/view`
- `POST /api/movies/:movieKey/reaction`
- `GET /api/posts`
- `GET /api/posts/trending`
- `GET /api/posts/:slug`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/bookmark`
- `POST /api/posts/:id/comments`
- `POST /api/posts/:id/comments/:commentId/replies`
- `PATCH /api/posts/comments/:commentId`
- `DELETE /api/posts/comments/:commentId`
- `POST /api/posts/comments/:commentId/like`
- `GET /api/categories`
- `GET /api/users/:id`
- `POST /api/users/:id/follow`
- `DELETE /api/users/:id/follow`
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/posts`
- `GET /api/admin/comments`
- `POST /api/admin/categories/:id/merge`

Admin routes require an admin JWT.
