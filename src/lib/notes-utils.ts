import type { Note } from './notes'

export function noteArticleSlugs(note: Note): string[] {
  return [...note.articleSlugs, ...(note.children ?? []).flatMap(noteArticleSlugs)]
}
