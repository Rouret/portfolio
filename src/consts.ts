import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Lucas Rouret',
  description:
    "Junior Full Stack Developer passionate developer and entrepreneur based in France. I build modrn web & mobile applications. I love 'clean' code, great user experiences, and solving real-world problems through tech.",
  href: 'https://www.lucas-rouret.fr',
  author: 'Lucas Rouret',
  locale: 'en-US',
  location: 'France',
  email: 'contact@lucas-rouret.fr',
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
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  Linkedin: 'lucide:linkedin',
  RSS: 'lucide:rss',
}

export interface Category {
  text: string
  logo: string
}

export type Technologies = {
  'Web Development': Category[]
  'Development Tools': Category[]
  'Hosting and Cloud Services': Category[]
  'Operating Systems': Category[]
  'Other Programming Languages and Technologies': Category[]
  Databases: Category[]
}

export const technologies: Technologies = {
  'Web Development': [
    { text: 'HTML', logo: 'mdi:language-html5' },
    { text: 'JavaScript', logo: 'mdi:language-javascript' },
    { text: 'CSS', logo: 'mdi:language-css3' },
    { text: 'Astro', logo: 'simple-icons:astro' },
    { text: 'Tailwind CSS', logo: 'mdi:tailwind' },
    { text: 'React', logo: 'mdi:react' },
    { text: 'Next.js', logo: 'cib:nextjs' },
    { text: 'React Native', logo: 'cib:react' },
    { text: 'Expo', logo: 'cib:expo' },
  ],
  'Development Tools': [
    { text: 'Visual Studio Code', logo: 'mdi:visual-studio-code' },
    { text: 'Git', logo: 'mdi:git' },
    { text: 'Docker', logo: 'mdi:docker' },
  ],
  'Hosting and Cloud Services': [{ text: 'Vercel', logo: 'cib:vercel' }],
  'Operating Systems': [
    { text: 'Windows', logo: 'mdi:windows' },
    { text: 'Ubuntu', logo: 'mdi:ubuntu' },
    { text: 'Mac OS', logo: 'mdi:apple' },
  ],
  'Other Programming Languages and Technologies': [
    { text: 'Node.js', logo: 'mdi:nodejs' },
    { text: 'TypeScript', logo: 'mdi:language-typescript' },
  ],
  Databases: [
    { text: 'PostgreSQL', logo: 'cib:postgresql' },
    { text: 'MySQL', logo: 'cib:mysql' },
  ],
}
