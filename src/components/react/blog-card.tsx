import { Badge } from '@/components/ui/badge'
import type { PersonalPostWithSlug } from '@/lib/data-utils'
import { formatDate } from '@/lib/utils'
import type { CollectionEntry } from 'astro:content'
import { Calendar, Hash } from 'lucide-react'

const BlogCardJSX = ({
  entry,
  isLatest,
}: {
  /*  */ entry: CollectionEntry<'tech'> | PersonalPostWithSlug
  isLatest: boolean
}) => {
  console.log(isLatest)
  const getPostUrl = () => {
    if (entry.collection === 'personal') {
      return `/blog/${entry.collection}/${(entry as PersonalPostWithSlug).slug}`
    }
    return `/blog/${entry.collection}/${entry.id}`
  }

  return (
    <div
      className={`hover:bg-secondary/50 relative rounded-xl border p-4 transition-colors duration-300 ease-in-out`}
    >
      {isLatest && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge
            variant="default"
            className="bg-green-500 px-2 py-1 text-xs text-white shadow-md"
          >
            Latest
          </Badge>
        </div>
      )}
      <a href={getPostUrl()} className="flex flex-col gap-4 sm:flex-row">
        <div className="grow">
          <h3 className="mb-1 text-lg font-medium">{entry.data.title}</h3>
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
