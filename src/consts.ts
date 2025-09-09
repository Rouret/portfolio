import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
  title: 'Lucas Rouret',
  description:
    'Passionate about software development, I adapt quickly to any environment and learn fast. I prioritize methodology and continuous improvement over overproduction, convinced that every mistake or delay is a learning opportunity. Curious and versatile, a true Swiss Army knife, I am seeking an exciting professional experience where I can tackle diverse challenges and deliver real value.',
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
