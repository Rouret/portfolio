import { Badge } from '@/components/ui/badge'
import type { ArticleWithSlug } from '@/lib/data-utils'
import { formatDate } from '@/lib/utils'
import { Calendar, Hash } from 'lucide-react'

const BlogCardJSX = ({
  entry,
  isLatest,
}: {
  entry: ArticleWithSlug
  isLatest: boolean
}) => {
  const getPostUrl = () => `/articles/${entry.slug}`

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
