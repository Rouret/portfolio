import { getCollection, type CollectionEntry } from 'astro:content'
import { generateSlug } from './utils'

export type PersonalPostWithSlug = CollectionEntry<'personal'> & {
  slug: string
}

const filterPersonalPosts = (
  posts: CollectionEntry<'personal'>[],
): PersonalPostWithSlug[] => {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      ...post,
      slug: post.data.slug || generateSlug(post.data.title),
    }))
}

const filterRecentPersonalPosts = (
  posts: PersonalPostWithSlug[],
  count: number,
): PersonalPostWithSlug[] => {
  const postsByDay = posts.reduce<Record<string, PersonalPostWithSlug[]>>(
    (acc, post) => {
      const key = getDayKey(post.data.date)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(post)
      return acc
    },
    {},
  )

  const randomPostsPerDay = Object.values(postsByDay).map((postsForDay) => {
    const randomIndex = Math.floor(Math.random() * postsForDay.length)
    return postsForDay[randomIndex]
  })

  const shuffled = randomPostsPerDay.sort(() => Math.random() - 0.5)

  return shuffled.slice(0, count)
}

export function getDayKey(date: string | Date): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// ------------------------------ All posts ------------------------------

export const getAllPersonalPosts = async (): Promise<
  PersonalPostWithSlug[]
> => {
  const posts = await getCollection('personal')
  return filterPersonalPosts(posts)
}

// ------------------------------ Recent posts ------------------------------

export async function getRecentPersonalPosts(
  count: number,
): Promise<PersonalPostWithSlug[]> {
  const posts = await getAllPersonalPosts()
  return filterRecentPersonalPosts(posts, count)
}

// ------------------------------ Adjacent posts ------------------------------

export async function getAdjacentPersonalPosts(currentSlug: string): Promise<{
  prev: PersonalPostWithSlug | null
  next: PersonalPostWithSlug | null
}> {
  const posts = await getAllPersonalPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

export async function getAllPersonalTags(): Promise<Map<string, number>> {
  const posts = await getAllPersonalPosts()

  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag: string) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getSortedPersonalTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllPersonalTags()

  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function groupPersonalPostsByYear(
  posts: PersonalPostWithSlug[],
): Record<string, PersonalPostWithSlug[]> {
  return posts.reduce((acc: Record<string, PersonalPostWithSlug[]>, post) => {
    const year = post.data.date.getFullYear().toString()
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})
}

export async function getPersonalPostsByAuthor(
  authorId: string,
): Promise<PersonalPostWithSlug[]> {
  const posts = await getAllPersonalPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export async function getPersonalPostsByTag(
  tag: string,
): Promise<PersonalPostWithSlug[]> {
  const posts = await getAllPersonalPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export type TechPostWithSlug = CollectionEntry<'tech'> & {
  slug: string
}

const filterTechPosts = (
  posts: CollectionEntry<'tech'>[],
): TechPostWithSlug[] => {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      ...post,
      slug: post.data.slug || generateSlug(post.data.title),
    }))
}

const filterRecentTechPosts = (
  posts: TechPostWithSlug[],
  count: number,
): TechPostWithSlug[] => {
  const postsByDay = posts.reduce<Record<string, TechPostWithSlug[]>>(
    (acc, post) => {
      const key = getDayKey(post.data.date)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(post)
      return acc
    },
    {},
  )

  const randomPostsPerDay = Object.values(postsByDay).map((postsForDay) => {
    const randomIndex = Math.floor(Math.random() * postsForDay.length)
    return postsForDay[randomIndex]
  })

  const shuffled = randomPostsPerDay.sort(() => Math.random() - 0.5)

  return shuffled.slice(0, count)
}

export const getAllTechPosts = async (): Promise<TechPostWithSlug[]> => {
  const posts = await getCollection('tech')
  return filterTechPosts(posts)
}

export async function getRecentTechPosts(
  count: number,
): Promise<TechPostWithSlug[]> {
  const posts = await getAllTechPosts()
  return filterRecentTechPosts(posts, count)
}

export async function getAdjacentTechPosts(currentSlug: string): Promise<{
  prev: TechPostWithSlug | null
  next: TechPostWithSlug | null
}> {
  const posts = await getAllTechPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

export async function getAllTechTags(): Promise<Map<string, number>> {
  const posts = await getAllTechPosts()

  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag: string) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getSortedTechTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTechTags()

  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export async function getTechPostsByTag(tag: string): Promise<TechPostWithSlug[]> {
  const posts = await getAllTechPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort(
    (a, b) =>
      (b.data.startDate?.valueOf() ?? 0) - (a.data.startDate?.valueOf() ?? 0),
  )
}

export async function getProjectsFeaturedTags(
  maxCount: number,
): Promise<string[]> {
  const projects = await getAllProjects()
  const tags = new Set<string>()

  for (const project of projects) {
    if (project.data.tags) {
      for (const tag of project.data.tags) {
        tags.add(tag)
      }
    }
    if (tags.size >= maxCount) {
      break
    }
  }

  return Array.from(tags).slice(0, maxCount)
}
