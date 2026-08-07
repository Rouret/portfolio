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
          'expo-router-tabbar-badge-sync-zustand',
          'expo-router-authentication-protected-stack',
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
      'ship-show-ask-pull-request-strategy',
    ],
  },
  {
    slug: 'react',
    title: 'React',
    description: "Patterns and pitfalls I've run into building with React.",
    icon: 'react',
    articleSlugs: [
      'react-error-handling-with-error-boundaries',
      'stop-using-usequery-from-react-query',
    ],
  },
  {
    slug: 'entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Lessons from building a startup from scratch.',
    emoji: '🚀',
    articleSlugs: ['building-our-startup-from-scratch', 'why-ideas-need-time-before-you-build'],
  },
  {
    slug: 'personal-growth',
    title: 'Personal Growth',
    description: 'Reflections on ambition, burnout, and moving forward.',
    emoji: '🌱',
    articleSlugs: [
      'three-rules-to-grow-without-burnout',
      'why-i-almost-gave-up',
      'why-ideas-need-time-before-you-build',
    ],
  },
]
