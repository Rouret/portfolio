import { SITE } from '@/consts'
import { renderSocialCard } from '@/lib/social-card'

export async function GET() {
  const pngData = await renderSocialCard({
    eyebrow: SITE.location,
    title: SITE.title,
    description: SITE.description,
    tags: [],
  })

  return new Response(pngData as any, {
    headers: { 'Content-Type': 'image/png' },
  })
}
