# Developer Portfolio & Blog

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![thubnail](https://i.imgur.com/zPgHtcu.png "Preview")

A modern, high-performance personal portfolio and blog built with Astro.js. Designed to showcase your projects and technical writing with blazing-fast performance and exceptional SEO.

## ✨ Features

- 🚀 **Blazing fast performance** - Built with Astro.js for optimal loading speeds
- 📝 **Full-featured blog** - Support for technical articles with code highlighting
- 🎨 **Beautiful UI** - Modern, responsive design powered by Tailwind CSS
- 🌙 **Dark mode support** - Seamless light/dark theme switching
- 📱 **Fully responsive** - Looks great on all devices from mobile to desktop
- 🔍 **SEO optimized** - Structured data, meta tags, and optimized for search engines
- 🏷️ **Tag system** - Categorize blog posts and projects with tags
- 📊 **Content collection** - Organized content management with Astro's content collections
- 🖼️ **Project showcase** - Display your work with images, descriptions, and technology tags

## 🛠️ Tech Stack

- **[Astro.js](https://astro.build/)** - Static site generator with excellent performance
- **[React.js](https://reactjs.org/)** - For interactive components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and improved developer experience
- **[MDX](https://mdxjs.com/)** - Markdown with JSX for rich content creation
- **[Preact](https://preactjs.com/)** - Lightweight alternative to React for UI components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cojocaru-david/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321` to see the site running locally.

## 📁 Project Structure

```
portfolio/
├── public/                 # Static assets
├── src/
│   ├── components/         # UI components
│   ├── content/            # Content collections
│   │   ├── blog/           # Blog posts in MD/MDX format
│   │   └── projects/       # Project data
│   ├── layouts/            # Page layouts
│   ├── lib/                # Utility functions
│   ├── pages/              # Page routes
│   └── styles/             # Global styles
├── astro.config.mjs        # Astro configuration
├── tailwind.config.cjs     # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🚀 Usage

### Creating a Blog Post

1. Create a new `.mdx` or `.md` file in `src/content/blog`
2. Add frontmatter with title, description, date, tags, and authors
3. Write your content using Markdown and MDX components

```mdx
---
title: "Your Post Title"
description: "A brief description of your post"
date: 2025-04-20
tags: ["tag1", "tag2", "tag3"]
authors: ["Your Name", "Co-author (optional)"]
---

# Your Post Title

Write your content here using Markdown.

## Subheading

More content...

```

### Adding a Project

1. Create a new `.md` file in projects
2. Add project details including name, description, tags, and image path

## 🌙 Dark Mode

The project includes dark mode support using Tailwind CSS and Preact. It detects user preferences and applies the appropriate theme, with an option to toggle between light and dark modes.

## 📊 Data Utilities

The project includes several utility functions in data-utils.ts:

- `getAllPosts()` - Retrieve all blog posts
- `getRecentPosts(count)` - Get the most recent posts
- `getAdjacentPosts(currentId)` - Get next and previous posts
- `getAllTags()` - Get all tags used in posts
- `getSortedTags()` - Get tags sorted by usage count
- `getPostsByAuthor(authorId)` - Get all posts by a specific author

## 📊 Database Setup (Likes/Dislikes Feature)

The portfolio includes a post feedback system allowing visitors to like or dislike blog posts. This feature requires a PostgreSQL database to store vote data. This guide explains how to set it up using [Neon.tech](https://neon.tech).

### Setting Up Neon.tech Database

1. **Create a Neon.tech Account**
   - Go to [Neon.tech](https://neon.tech) and sign up for an account
   - Neon offers a generous free tier suitable for personal portfolio sites

2. **Create a New Project**
   - From the Neon dashboard, click "New Project"
   - Choose a name for your project (e.g., "portfolio-feedback")
   - Select the closest region to your target audience
   - Click "Create Project"

3. **Get Connection Details**
   - In your project dashboard, find the connection string under "Connection Details"
   - Save this connection string as you'll need it for your environment variables

4. **Set Environment Variables**
   - Create a `.env` file in your project root (if not already present)
   - Add your database connection string:
     ```
     DATABASE_URL=your_neon_connection_string_here
     ```

### Database Schema Setup

Run the following SQL queries in the Neon SQL Editor to create the necessary tables for the feedback system:

```sql
CREATE TABLE post_feedback (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  CONSTRAINT unique_post_id UNIQUE (post_id)
);

CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL,
  fingerprint_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_like UNIQUE (post_id, fingerprint_id)
);

CREATE TABLE post_dislikes (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL,
  fingerprint_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_dislike UNIQUE (post_id, fingerprint_id)
);

CREATE INDEX idx_post_feedback_post_id ON post_feedback (post_id);
CREATE INDEX idx_post_likes_post_id_fingerprint ON post_likes (post_id, fingerprint_id);
CREATE INDEX idx_post_dislikes_post_id_fingerprint ON post_dislikes (post_id, fingerprint_id);
```

### How the Feedback System Works

The feedback system consists of three tables:
- `post_feedback`: Stores aggregate counts of likes and dislikes for each post
- `post_likes`: Records individual like actions with fingerprint IDs to prevent duplicate votes
- `post_dislikes`: Records individual dislike actions with fingerprint IDs

### API Implementation

The portfolio includes API endpoints for handling likes and dislikes:

1. **Fetching Post Feedback**
   - GET request to `/api/like/{postId}` returns current like/dislike counts

2. **Submitting Likes**
   - POST request to `/api/like/{postId}` with fingerprint ID in the request body
   - The system checks if the user has already liked/disliked the post
   - If not, a like is recorded and the count is updated

3. **Submitting Dislikes**
   - POST request to `/api/dislike/{postId}` works similarly to the like endpoint
   - Prevents duplicate votes from the same visitor

### Working with the Database

When a new blog post is created:
- No manual database entry is needed
- The first like/dislike action will automatically create the entry in `post_feedback`

To reset likes for a post:
```sql
DELETE FROM post_likes WHERE post_id = 'your-post-id';
DELETE FROM post_dislikes WHERE post_id = 'your-post-id';
UPDATE post_feedback SET likes = 0, dislikes = 0 WHERE post_id = 'your-post-id';
```

To view post statistics:
```sql
SELECT * FROM post_feedback ORDER BY likes DESC;
```

To find which posts a specific user has interacted with:
```sql
SELECT post_id FROM post_likes WHERE fingerprint_id = 'specific-fingerprint-id';
```

### Troubleshooting

If you encounter issues with the feedback system:

1. **Check Environment Variables**
   - Ensure your `.env` file contains the correct `DATABASE_URL`

2. **Verify Database Connection**
   - Add logging to your database connection code to check for errors
   - Make sure your Neon.tech project is active and not in suspended state

3. **Check for Errors in Console**
   - The feedback component logs errors that can help diagnose issues

4. **Reset User Vote State**
   - Users can clear their localStorage to reset their voting state:
     ```javascript
     // In browser console
     localStorage.clear()
     ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
