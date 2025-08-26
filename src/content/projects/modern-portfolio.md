---
name: 'Modern Portfolio'
description: 'Modern Portfolio is a personal website that showcases my work and projects. It is built with Astro.js and styled with Tailwind CSS, providing a fast and responsive user experience. The website features a clean design, easy navigation, and a focus on showcasing my skills and projects.'
tags: ['astro', 'tailwindcss', 'typescript']
image: '../../../public/static/modern-portfolio.webp'
link: 'https://lucas-rouret.fr'
startDate: '2025-03-30'
---
# Developer Portfolio & Blog

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
