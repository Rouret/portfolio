import { getCollection, type CollectionEntry } from 'astro:content'

export type ArticleWithSlug = CollectionEntry<'articles'> & {
  slug: string
}

const filterArticles = (
  posts: CollectionEntry<'articles'>[],
): ArticleWithSlug[] => {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      ...post,
      slug: post.data.slug || post.id,
    }))
}

const filterRecentArticles = (
  posts: ArticleWithSlug[],
  count: number,
): ArticleWithSlug[] => {
  const postsByDay = posts.reduce<Record<string, ArticleWithSlug[]>>(
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

// ------------------------------ All articles ------------------------------

export const getAllArticles = async (): Promise<ArticleWithSlug[]> => {
  const posts = await getCollection('articles')
  return filterArticles(posts)
}

// ------------------------------ Recent articles ------------------------------

export async function getRecentArticles(
  count: number,
): Promise<ArticleWithSlug[]> {
  const posts = await getAllArticles()
  return filterRecentArticles(posts, count)
}

// ------------------------------ Adjacent articles ------------------------------

export async function getAdjacentArticles(currentSlug: string): Promise<{
  prev: ArticleWithSlug | null
  next: ArticleWithSlug | null
}> {
  const posts = await getAllArticles()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

// ------------------------------ Tags ------------------------------

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllArticles()

  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag: string) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()

  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export async function getArticlesByTag(tag: string): Promise<ArticleWithSlug[]> {
  const posts = await getAllArticles()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

// ------------------------------ Authors / grouping ------------------------------

export function groupArticlesByYear(
  posts: ArticleWithSlug[],
): Record<string, ArticleWithSlug[]> {
  return posts.reduce((acc: Record<string, ArticleWithSlug[]>, post) => {
    const year = post.data.date.getFullYear().toString()
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})
}

export async function getArticlesByAuthor(
  authorId: string,
): Promise<ArticleWithSlug[]> {
  const posts = await getAllArticles()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

// ------------------------------ Projects ------------------------------

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
