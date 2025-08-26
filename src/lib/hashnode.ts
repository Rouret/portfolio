import { gql, GraphQLClient } from 'graphql-request'

import { z } from 'astro/zod'
import type { CollectionEntry } from 'astro:content'
import { getDayKey } from '@/lib/data-utils'

export const PostSchema = z.object({
  id: z.string(),
  author: z.object({
    name: z.string(),
    profilePicture: z.string(),
  }),
  publishedAt: z.string(),
  title: z.string(),
  subtitle: z.string(),
  brief: z.string(),
  slug: z.string(),
  readTimeInMinutes: z.number(),
  content: z.object({
    html: z.string(),
  }),
  tags: z.array(
    z.object({
      name: z.string(),
      slug: z.string(),
    }),
  ),
  coverImage: z.object({
    url: z.string(),
  }),
})

export const AllPostsDataSchema = z.object({
  id: z.string(),
  publication: z.object({
    title: z.string(),
    posts: z.object({
      pageInfo: z.object({
        hasNextPage: z.boolean(),
        endCursor: z.string(),
      }),
      edges: z.array(
        z.object({
          node: PostSchema,
        }),
      ),
    }),
  }),
})

export const PostDataSchema = z.object({
  id: z.string(),
  publication: z.object({
    title: z.string(),
    post: PostSchema,
  }),
})

export type Post = z.infer<typeof PostSchema>
export type AllPostsData = z.infer<typeof AllPostsDataSchema>
export type PostData = z.infer<typeof PostDataSchema>

export const getHashNodeClient = () => {
  return new GraphQLClient('https://gql.hashnode.com')
}

const myHashnodeURL = 'rouret.hashnode.dev'

export async function getTechPostsByTag(
  tag: string,
): Promise<CollectionEntry<'tech'>[]> {
  const posts = await getAllTechPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
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

export async function getTechPostsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'tech'>[]> {
  const posts = await getAllTechPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export function groupTechPostsByYear(
  posts: CollectionEntry<'tech'>[],
): Record<string, CollectionEntry<'tech'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'tech'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
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

export async function getAdjacentTechPosts(currentId: string): Promise<{
  prev: CollectionEntry<'tech'> | null
  next: CollectionEntry<'tech'> | null
}> {
  const posts = await getAllTechPosts()
  const currentIndex = posts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

export async function getRecentTechPosts(
  count: number,
): Promise<CollectionEntry<'tech'>[]> {
  const posts = await getAllTechPosts()
  return filterRecentTechPosts(posts, count)
}

export const getAllTechPosts = async () => {
  const client = getHashNodeClient()

  const allPosts = await client.request<AllPostsData>(
    gql`
      query allPosts {
        publication(host: "${myHashnodeURL}") {
          id
          title
          posts(first: 20) {
            pageInfo{
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                author{
                  name
                  profilePicture
                }
                title
                subtitle
                brief
                slug
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
                publishedAt
                readTimeInMinutes
              }
            }
          }
        }
      }
    `,
  )

  return filterTechPosts(
    allPosts.publication.posts.edges.map((p) => transformHashnodePost(p.node)),
  )
}

export const getTechPost = async (slug: string) => {
  const client = getHashNodeClient()

  const data = await client.request<PostData>(
    gql`
      query postDetails($slug: String!) {
        publication(host: "${myHashnodeURL}") {
          id
          post(slug: $slug) {
            id
            author{
              name
              profilePicture
            }
            publishedAt
            title
            subtitle
            readTimeInMinutes
            content{
              html
            }
            tags {
              name
              slug
            }
            coverImage {
              url
            }
          }
        }
      }
    `,
    { slug: slug },
  )

  return transformHashnodePost(data.publication.post)
}

const filterRecentTechPosts = (
  posts: CollectionEntry<'tech'>[],
  count: number,
): CollectionEntry<'tech'>[] => {
  const postsByDay = posts.reduce<Record<string, CollectionEntry<'tech'>[]>>(
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

const filterTechPosts = (
  posts: CollectionEntry<'tech'>[],
): CollectionEntry<'tech'>[] => {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

const transformHashnodePost = (post: Post): CollectionEntry<'tech'> => {
  return {
    id: post.slug,
    collection: 'tech',
    body: post.content ? post.content.html : '',
    data: {
      title: post.title,
      description: post.subtitle,
      date: new Date(post.publishedAt),
      image: {
        src: post.coverImage.url,
        width: 100,
        height: 100,
        format: 'png',
      },
      tags: post.tags.map((tag) => tag.name),
    },
  }
}
