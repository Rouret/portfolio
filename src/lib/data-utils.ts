import { getCollection, type CollectionEntry } from 'astro:content'

const filterPersonalPosts = (
  posts: CollectionEntry<'personal'>[],
): CollectionEntry<'personal'>[] => {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

const filterRecentPersonalPosts = (
  posts: CollectionEntry<'personal'>[],
  count: number,
): CollectionEntry<'personal'>[] => {
  const postsByDay = posts.reduce<
    Record<string, CollectionEntry<'personal'>[]>
  >((acc, post) => {
    const key = getDayKey(post.data.date)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(post)
    return acc
  }, {})

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
  CollectionEntry<'personal'>[]
> => {
  const posts = await getCollection('personal')
  return filterPersonalPosts(posts)
}

// ------------------------------ Recent posts ------------------------------

export async function getRecentPersonalPosts(
  count: number,
): Promise<CollectionEntry<'personal'>[]> {
  const posts = await getAllPersonalPosts()
  return filterRecentPersonalPosts(posts, count)
}

// ------------------------------ Adjacent posts ------------------------------

export async function getAdjacentPersonalPosts(currentId: string): Promise<{
  prev: CollectionEntry<'personal'> | null
  next: CollectionEntry<'personal'> | null
}> {
  const posts = await getAllPersonalPosts()
  const currentIndex = posts.findIndex((post) => post.id === currentId)

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
  posts: CollectionEntry<'personal'>[],
): Record<string, CollectionEntry<'personal'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'personal'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export async function getPersonalPostsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'personal'>[]> {
  const posts = await getAllPersonalPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export async function getPersonalPostsByTag(
  tag: string,
): Promise<CollectionEntry<'personal'>[]> {
  const posts = await getAllPersonalPosts()
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
