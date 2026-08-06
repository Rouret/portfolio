import type { ArticleWithSlug } from './data-utils'
import type { Note } from './notes'

export function resolveNoteArticles(
  note: Note,
  articlesBySlug: Map<string, ArticleWithSlug>,
): ArticleWithSlug[] {
  return note.articleSlugs
    .map((slug) => {
      const article = articlesBySlug.get(slug)
      if (!article && import.meta.env.DEV) {
        console.warn(
          `[notes] "${note.slug}" references unknown article slug "${slug}"`,
        )
      }
      return article
    })
    .filter((article): article is ArticleWithSlug => Boolean(article))
}

export function countNoteArticles(note: Note): number {
  const ownCount = note.articleSlugs.length
  const childrenCount =
    note.children?.reduce((sum, child) => sum + countNoteArticles(child), 0) ?? 0
  return ownCount + childrenCount
}
