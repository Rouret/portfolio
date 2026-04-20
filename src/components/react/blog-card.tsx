import { Badge } from '@/components/ui/badge'
import type { PersonalPostWithSlug } from '@/lib/data-utils'
import { formatDate } from '@/lib/utils'
import type { CollectionEntry } from 'astro:content'
import { BookOpen, Calendar, Code2, Hash } from 'lucide-react'

const BlogCardJSX = ({
  entry,
  isLatest,
}: {
  /*  */ entry: CollectionEntry<'tech'> | PersonalPostWithSlug
  isLatest: boolean
}) => {
  const getPostUrl = () => {
    if (entry.collection === 'personal') {
      return `/blog/${entry.collection}/${(entry as PersonalPostWithSlug).slug}`
    }
    return `/blog/${entry.collection}/${entry.id}`
  }

  const isTech = entry.collection === 'tech'

  return (
    <div
      className={`hover:bg-secondary/50 relative rounded-xl border p-4 transition-colors duration-300 ease-in-out`}
    >
      {isLatest && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge
            variant="default"
            className="bg-green-700 px-2 py-1 text-xs text-white shadow-md"
          >
            Latest
          </Badge>
        </div>
      )}
      <a href={getPostUrl()} className="flex flex-col gap-4 sm:flex-row">
        <div className="grow">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-lg font-medium leading-snug">{entry.data.title}</h3>
            <span
              className={`mt-0.5 shrink-0 rounded-md p-1 ${
                isTech
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400'
              }`}
              title={isTech ? 'Tech' : 'Personal'}
            >
              {isTech ? <Code2 size={13} /> : <BookOpen size={13} />}
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground text-xs">
              {formatDate(entry.data.date)}
            </span>
          </div>
          <p className="text-muted-foreground mb-2 line-clamp-1 text-sm">
            {entry.data.description}
          </p>

          {entry.data.tags && (
            <div className="flex flex-wrap gap-2">
              {entry.data.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-x-1"
                >
                  <Hash size={12} />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  )
}

export default BlogCardJSX
