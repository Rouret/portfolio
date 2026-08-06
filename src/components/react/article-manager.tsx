import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ArticleWithSlug } from '@/lib/data-utils'
import type { Note } from '@/lib/notes'
import { LayoutGrid, List } from 'lucide-react'
import NotesExplorer from './notes-explorer'
import Search from './search'

function ArticleManager({
  articles,
  notes,
}: {
  articles: ArticleWithSlug[]
  notes: Note[]
}) {
  const [view, setView] = useState<'notes' | 'table'>('notes')

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={() => setView('notes')}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors',
            view === 'notes'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          <LayoutGrid size={14} />
          Par thème
        </button>
        <button
          onClick={() => setView('table')}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors',
            view === 'table'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          <List size={14} />
          Liste
        </button>
      </div>

      {view === 'notes' ? (
        <NotesExplorer notes={notes} articles={articles} />
      ) : (
        <Search searchList={articles} initialPosts={articles} />
      )}
    </div>
  )
}

export default ArticleManager
