import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
  title: 'Lucas Rouret',
  description:
    'Full-stack and mobile software engineer in France. React, React Native, Node.js, Python, AI agent workflows, Lean. I build my own apps too.',
  href: 'https://www.lucas-rouret.fr',
  author: 'Lucas Rouret',
  locale: 'en-US',
  location: 'France',
}

export const BLOG_DESCRIPTION =
  'Articles on React, React Native and Expo, AI agents, Lean and agile, and building products as a solopreneur.'

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'home',
  },
  {
    href: '/projects',
    label: 'projects',
  },
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/library',
    label: 'library',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/rouret?ref=personal-website',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/rouret-lucas/',
    label: 'Linkedin',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  GitHub: 'lucide:github',
  Linkedin: 'lucide:linkedin',
  RSS: 'lucide:rss',
}
