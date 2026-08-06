import type { ImageMetadata } from 'astro'

export type NoteIcon = 'expo' | 'react'

export interface Note {
  slug: string
  title: string
  description?: string
  emoji?: string
  image?: ImageMetadata
  icon?: NoteIcon
  articleSlugs: string[]
  children?: Note[]
}

export const notesTree: Note[] = [
  {
    slug: 'expo',
    title: 'Expo',
    description: "What I'm learning building with Expo and Expo Router.",
    icon: 'expo',
    articleSlugs: [],
    children: [
      {
        slug: 'expo-router',
        title: 'Expo Router',
        description:
          'Routing, navigation state, and authentication patterns with Expo Router.',
        articleSlugs: [
          'stop-treating-tabbarbadge-as-a-navigation-problem-keeping-it-in-sync-with-zustand',
          'stop-using-manual-redirects-for-expo-router-authentication-use-protected-stack-instead',
        ],
      },
    ],
  },
  {
    slug: 'engineering-mindset',
    title: 'Engineering Mindset',
    description:
      'How I think about teamwork, process, and continuous improvement.',
    emoji: '🛠️',
    articleSlugs: [
      'we-cut-our-daily-standup-from-45-to-15-minutes-with-one-simple-change',
      'effective-team-strategy-for-code-integration',
    ],
  },
  {
    slug: 'react',
    title: 'React',
    description: "Patterns and pitfalls I've run into building with React.",
    icon: 'react',
    articleSlugs: [
      'react-error-handling-for-beginners-using-error-boundaries',
      'stop-using-usequery-from-react-query',
    ],
  },
  {
    slug: 'entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Lessons from building a startup from scratch.',
    emoji: '🚀',
    articleSlugs: ['we-are-creating-a-startup', 'work-the-material'],
  },
  {
    slug: 'personal-growth',
    title: 'Personal Growth',
    description: 'Reflections on ambition, burnout, and moving forward.',
    emoji: '🌱',
    articleSlugs: ['how-to-be-better', 'i-almost-gave-up', 'work-the-material'],
  },
]
