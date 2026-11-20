import type { APIContext } from 'astro'
import { getAllArticles } from '@/lib/data-utils'
import { renderSocialCard } from '@/lib/social-card'

interface Props {
  title: string
  date: Date
  description: string
  tags: string[]
}

export async function GET(context: APIContext) {
  const { title, date, description, tags } = context.props as Props

  const formattedDate = date.toLocaleDateString('en-US', { dateStyle: 'full' })

  const pngData = await renderSocialCard({
    eyebrow: formattedDate,
    title,
    description,
    tags,
  })

  return new Response(pngData as any, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="social-card.png"',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': pngData.length.toString(),
      'Surrogate-Key': tags.join(' '),
      'Query-String-Hash': title.toLowerCase().replace(/\s+/g, '-'),
      'Cache-Tag': 'social-image',
      'X-Content-Type-Options': 'nosniff',
      'Last-Modified': new Date().toUTCString(),
      Expires: new Date(Date.now() + 31536000000).toUTCString(),
      ETag: `"${pngData.length}-${Date.now()}"`,
      'Access-Control-Allow-Origin': '*',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  })
}

export async function getStaticPaths() {
  const posts = await getAllArticles()

  return posts.map((post) => ({
    params: {
      id: post.slug,
    },
    props: {
      title: post.data.title,
      date: post.data.date,
      description: post.data.description,
      tags: post.data.tags || [],
    },
  }))
}
