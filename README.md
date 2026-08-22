# 🎬 FilmHub — 3D Movie Blog & Community Platform

FilmHub is a full-stack cinematic blogging and community platform developed as a university E-Business project.

The platform combines movie discovery, cinematic blogging, community interaction, user accounts, content management, administration, analytics, authentication, and a modern interactive 3D-inspired interface.

FilmHub was designed and developed as a complete full-stack application using React, TypeScript, Vite, Node.js, Express, MySQL, JWT authentication, and modern frontend technologies.

---

## 🌐 Live Demo

### Frontend

[https://film-hub-iota.vercel.app/](https://film-hub-iota.vercel.app/)

### Backend API

[https://filmhub-api-h1m7.onrender.com](https://filmhub-api-h1m7.onrender.com)

### API Health Check

[https://filmhub-api-h1m7.onrender.com/api/health](https://filmhub-api-h1m7.onrender.com/api/health)

> The frontend is deployed on Vercel.
> The Express backend is deployed on Render.
> The production MySQL database is hosted through Aiven.

---

# ✨ Features

## 🎥 Public Experience

* Cinematic homepage
* Featured movie content
* Blog listing
* Blog details
* Movie details
* Categories
* Search
* Trending content
* Author profiles
* About page
* Contact page
* Responsive interface
* Cinematic visual effects
* 3D-inspired hero experience
* Smooth animations
* Interactive movie content
* Movie statistics
* Trailer embeds

---

# 👤 User Features

Registered users can:

* Create an account
* Log in and log out
* Remember their session
* View their profile
* Edit their profile
* Change their password
* Request a password reset
* Reset their password
* Create blog posts
* Edit their posts
* Save drafts
* Publish posts
* View their own posts
* Delete their posts
* Bookmark posts
* Like posts
* Comment on posts
* Reply to comments
* Like comments
* Follow other users
* Unfollow users
* View notifications
* Access their dashboard

---

# 📝 Blogging System

FilmHub includes a complete blogging system with:

* SEO-friendly slugs
* Categories
* Tags
* Ratings
* Featured posts
* Featured images
* Trailer URLs
* Trailer file uploads
* Draft posts
* Published posts
* Moderation states
* Post editing
* Post deletion
* Likes
* Bookmarks
* Comments
* Comment replies
* Comment likes
* View tracking
* Trending content

### Supported Post Statuses

```text
draft
published
blocked
rejected
```

---

# 🎬 Movie System

FilmHub includes movie-focused functionality such as:

* Movie details
* Movie statistics
* Movie views
* Movie likes
* Movie dislikes
* Trailer embeds
* Cast information
* Movie interaction tracking
* External movie metadata support
* TMDb integration support
* Dynamic movie information

### Optional TMDb Integration

The frontend can use a TMDb API key for enhanced movie metadata.

Add the following to:

```text
client/.env
```

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

# 👥 Community Features

FilmHub provides a social blogging experience through:

* User profiles
* Following
* Followers
* Comments
* Comment replies
* Comment likes
* Post likes
* Bookmarks
* Notifications
* View tracking
* Community interaction

---

# 🛡️ Authentication & Security

FilmHub implements multiple security mechanisms:

* JWT authentication
* bcrypt password hashing
* Role-based authorization
* Protected API routes
* Admin authorization
* Parameterized MySQL queries
* Helmet security headers
* CORS configuration
* Express rate limiting
* Request validation
* Upload validation
* File size restrictions
* Basic HTML sanitization
* Password reset tokens
* Remember-me tokens
* Secure session handling

---

# 👑 Admin System

Administrators have access to a dedicated administration area.

Admin functionality includes:

* Admin dashboard
* User management
* Post management
* Comment management
* Category management
* Post moderation
* User status management
* Analytics
* Platform statistics
* Content management

Admin routes require administrator authorization.

---

# 📊 Analytics

The administration dashboard provides platform statistics and analytics using:

* Chart.js
* User statistics
* Post statistics
* Content statistics
* Engagement statistics
* Views
* Likes
* Trending information

---

# 📧 Email Features

FilmHub supports email functionality through Nodemailer.

Email features include:

* Password reset emails
* Contact form emails
* SMTP configuration
* Gmail SMTP support
* Development email fallback

For Gmail SMTP, use a **Gmail App Password** rather than a normal Gmail password.

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Three.js
* Framer Motion
* Lucide React
* Chart.js
* React Chart.js 2

## Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* MySQL2
* Nodemailer
* Multer
* Helmet
* CORS
* Express Rate Limit
* Express Validator
* Morgan
* Slugify
* dotenv

## Database

* MySQL
* MySQL Workbench
* Relational database architecture
* Foreign keys
* Indexes
* Full-text search
* Database migrations
* Seed data

## Deployment

* Vercel — Frontend
* Render — Backend
* Aiven — MySQL Database

---

# 📁 Project Structure

```text
filmhub/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── init.sql
│   └── migrations/
│       └── 001_requested_feature_expansion.sql
│
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

# ⚙️ Local Installation

## 1. Clone the Repository

```bash
git clone https://github.com/salma-el-azouazi/FilmHub.git
cd FilmHub
```

## 2. Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Configuration

Create the server environment file:

```text
server/.env
```

Based on:

```text
server/.env.example
```

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=filmhub
DB_PORT=3306

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

PASSWORD_RESET_MINUTES=60

PORT=5202
CLIENT_URL=http://127.0.0.1:5275

MAIL_FROM=FilmHub <your-email@example.com>
CONTACT_OWNER_EMAIL=your-email@example.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

Create the frontend environment file:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:5202/api
```

For TMDb:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

**Never commit real `.env` files, passwords, API keys, JWT secrets, SMTP credentials, or database credentials to GitHub.**

---

# 🗄️ Database Setup

FilmHub uses MySQL.

Create the database using:

```text
database/schema.sql
```

For a new installation, use:

```text
database/init.sql
```

The initialization script creates the database structure and inserts demonstration data.

For an existing FilmHub database, use:

```text
database/migrations/001_requested_feature_expansion.sql
```

---

# ▶️ Running FilmHub Locally

From the project root:

```bash
npm run dev
```

The development configuration runs:

```text
Frontend: http://127.0.0.1:5275
Backend:  http://127.0.0.1:5202
```

Backend health check:

```text
http://127.0.0.1:5202/api/health
```

---

# 🏗️ Production Build

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

---

# 🚀 Deployment

FilmHub is deployed using:

### Frontend

**Vercel**

```text
https://film-hub-iota.vercel.app/
```

### Backend

**Render**

```text
https://filmhub-api-h1m7.onrender.com
```

### Database

**Aiven MySQL**

The production backend uses environment variables for the database connection and authentication secrets.

Production environment variables must be configured directly in the deployment platform and must not be committed to the repository.

---

# 🔌 API Overview

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/remember
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Contact

```text
POST /api/contact
```

## Movies

```text
GET  /api/movies/:movieKey/stats
POST /api/movies/:movieKey/view
POST /api/movies/:movieKey/reaction
```

## Posts

```text
GET    /api/posts
GET    /api/posts/trending
GET    /api/posts/:slug
POST   /api/posts
PATCH  /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
POST   /api/posts/:id/bookmark
POST   /api/posts/:id/comments
POST   /api/posts/:id/comments/:commentId/replies
PATCH  /api/posts/comments/:commentId
DELETE /api/posts/comments/:commentId
POST   /api/posts/comments/:commentId/like
```

## Categories

```text
GET /api/categories
```

## Users

```text
GET    /api/users/:id
POST   /api/users/:id/follow
DELETE /api/users/:id/follow
```

## Administration

```text
GET  /api/admin/dashboard
GET  /api/admin/users
GET  /api/admin/posts
GET  /api/admin/comments
POST /api/admin/categories/:id/merge
```

Admin endpoints require administrator authorization.

---

# 🧪 Health Check

The backend provides:

```text
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "service": "FilmHub API"
}
```

---

# 🔑 Demo Account

The database seed contains demonstration accounts.

Example administrator:

```text
Email: admin@filmhub.test
Password: FilmHub123!
```

> Demo credentials are intended for local/testing purposes only. Change credentials before using the system in a real production environment.

---

# 📜 Available Scripts

From the project root:

```bash
npm run dev
```

Starts the frontend and backend development servers.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run start
```

Starts the production Express backend.

```bash
npm run lint
```

Runs frontend linting.

---

# 📚 Academic Project

FilmHub was developed as a university **E-Business** project.

The project demonstrates practical implementation of:

* Full-stack web development
* Frontend engineering
* Backend API development
* Database design
* Authentication
* Authorization
* CRUD operations
* Community systems
* Content management
* Security practices
* API integration
* Deployment
* Responsive UI development
* Data analytics

---

# 👩‍💻 Author

**Salma El Azouazi**

Computer Science Student
Full-Stack Developer

GitHub:

[https://github.com/salma-el-azouazi](https://github.com/salma-el-azouazi)

---

# © Copyright & Usage Restrictions

**Copyright © 2026 Salma El Azouazi. All Rights Reserved.**

FilmHub and its original source code, architecture, implementation, design, UI, written content, database structure, and project-specific materials are the intellectual property of **Salma El Azouazi**, except for third-party libraries, frameworks, services, APIs, images, fonts, or other materials that remain subject to their respective owners' terms and licenses.

### No Open-Source License

This project is **NOT open source** and is provided **without an open-source license**.

No permission is granted to:

* Copy the source code
* Reproduce the application
* Redistribute the source code
* Publish modified versions
* Create derivative works
* Reuse the implementation in another project
* Sell or commercially exploit the source code
* Present the source code or substantial portions of it as your own

Viewing this repository for **personal evaluation, academic review, or portfolio purposes** does not transfer ownership or grant a license to reuse the source code.

All rights not expressly granted are reserved by the copyright holder.

> **Important:** This repository is public for portfolio and demonstration purposes. Public visibility does not make the source code open source. GitHub's terms still allow users to view and fork public repositories, while copyright remains with the creator and no general reuse permission is granted. ([GitHub Docs][1])

---

# ⚠️ Third-Party Materials

FilmHub uses third-party technologies and services, including but not limited to:

* React
* TypeScript
* Vite
* Node.js
* Express
* MySQL
* Tailwind CSS
* Three.js
* Framer Motion
* Chart.js
* Lucide React
* Vercel
* Render
* Aiven
* TMDb
* Wikipedia
* Jikan
* YouTube
* Unsplash

These technologies and services are **not owned by the author** and remain subject to their respective licenses, terms of service, and copyrights.

The copyright restriction in this README applies specifically to the **original FilmHub code, design, implementation, and project-specific materials created by Salma El Azouazi**.

---

# 🔒 Security Notice

Do not commit sensitive credentials to this repository.

This includes:

```text
.env
database passwords
JWT secrets
SMTP passwords
Gmail App Passwords
API keys
private deployment credentials
```

Only environment variable templates such as `.env.example` should be committed.

---

# 🎬 FilmHub

**Discover. Write. Discuss. Experience Cinema.**

© 2026 Salma El Azouazi — All Rights Reserved.

[1]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository?utm_source=chatgpt.com "Licensing a repository - GitHub Docs"
