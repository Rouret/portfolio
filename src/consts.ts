import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
  title: 'Lucas Rouret',
  description:
    "Software engineer passionate developer and entrepreneur based in France. I build modrn web & mobile applications. I love 'clean' code, great user experiences, and solving real-world problems through tech.",
  href: 'https://www.lucas-rouret.fr',
  author: 'Lucas Rouret',
  locale: 'en-US',
  location: 'France',
}

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
