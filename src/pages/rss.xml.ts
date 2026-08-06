import { SITE } from '@/consts'
import { getAllArticles } from '@/lib/data-utils'
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site }) => {
  try {
    const posts = await getAllArticles()

    const now = new Date()
    const lastBuildDate = posts.length > 0 ? posts[0].data.date : now

    return rss({
      title: `${SITE.title} - Blog`,
      description: SITE.description,
      site: site ?? SITE.href.replace(/\/$/, ''),
      trailingSlash: false,
      customData: `
        <language>${SITE.locale || 'en-us'}</language>
        <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
        <ttl>60</ttl>
        <managingEditor>${SITE.author}</managingEditor>
        <webMaster>${SITE.author}</webMaster>
        <image>
          <url>${new URL('/ogImage.png', site ?? SITE.href).href}</url>
          <title>${SITE.title}</title>
          <link>${site ?? SITE.href}</link>
        </image>
        <atom:link href="${new URL('/rss.xml', site ?? SITE.href).href}" rel="self" type="application/rss+xml" />
      `.trim(),
      xmlns: {
        atom: 'http://www.w3.org/2005/Atom',
      },
      items: posts.map((post) => ({
        title: post.data.title,
        description: post.data.description || '',
        pubDate: post.data.date,
        link: `/articles/${post.slug}/`,
        categories: post.data.tags || [],
        author: post.data.authors ? post.data.authors.join(', ') : SITE.author,
      })),
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
