import { Badge } from '@/components/ui/badge'
import type { ArticleWithSlug } from '@/lib/data-utils'
import type { Note, NoteIcon } from '@/lib/notes'
import { countNoteArticles, resolveNoteArticles } from '@/lib/notes-utils'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FaReact } from 'react-icons/fa'
import { SiExpo } from 'react-icons/si'
import BlogCardJSX from './blog-card'

const NOTE_ICONS: Record<NoteIcon, React.ReactNode> = {
  expo: <SiExpo />,
  react: <FaReact />,
}

function NoteGroup({
  note,
  articlesBySlug,
  depth,
}: {
  note: Note
  articlesBySlug: Map<string, ArticleWithSlug>
  depth: number
}) {
  const [isOpen, setIsOpen] = useState(depth === 0 ? false : true)
  const articles = resolveNoteArticles(note, articlesBySlug)
  const totalCount = countNoteArticles(note)

  return (
    <div className={cn(depth > 0 && 'border-border/60 border-l pl-4')}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:bg-secondary/50 flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors duration-300 ease-in-out"
        aria-expanded={isOpen}
      >
        {note.icon ? (
          <span className="shrink-0 text-2xl">{NOTE_ICONS[note.icon]}</span>
        ) : note.image ? (
          <img
            src={note.image.src}
            alt=""
            width={note.image.width}
            height={note.image.height}
            className="size-8 shrink-0 rounded-md object-cover"
          />
        ) : (
          note.emoji && <span className="text-2xl">{note.emoji}</span>
        )}
        <div className="grow">
          <div className="flex items-center gap-2">
            <h3 className="text-lg leading-snug font-medium">{note.title}</h3>
            <Badge variant="secondary">{totalCount}</Badge>
          </div>
          {note.description && (
            <p className="text-muted-foreground mt-1 text-sm">
              {note.description}
            </p>
          )}
        </div>
        {isOpen ? (
          <ChevronDown size={18} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight size={18} className="text-muted-foreground shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 flex flex-col gap-3 pl-2">
          {articles.map((article) => (
            <BlogCardJSX key={article.id} entry={article} isLatest={false} />
          ))}
          {note.children?.map((child) => (
            <NoteGroup
              key={child.slug}
              note={child}
              articlesBySlug={articlesBySlug}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function NotesExplorer({
  notes,
  articles,
}: {
  notes: Note[]
  articles: ArticleWithSlug[]
}) {
  const articlesBySlug = useMemo(() => {
    const map = new Map<string, ArticleWithSlug>()
    articles.forEach((article) => map.set(article.slug, article))
    return map
  }, [articles])

  if (notes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No notes yet group articles by topic in <code>src/lib/notes.ts</code>.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <NoteGroup
          key={note.slug}
          note={note}
          articlesBySlug={articlesBySlug}
          depth={0}
        />
      ))}
    </div>
  )
}

export default NotesExplorer
