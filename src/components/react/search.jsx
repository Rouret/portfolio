import Fuse from 'fuse.js'
import { useState, useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import BlogCardJSX from './blog-card'
import debounce from 'lodash.debounce'
import { cn } from '@/lib/utils'

const fuseOptions = {
  keys: ['data.title', 'data.description', 'data.tags'],
  includeMatches: true,
  minMatchCharLength: 3,
  threshold: 0.3,
  distance: 100,
  sortFn: (a, b) => a.score - b.score,
}

function Search({ searchList, initialPosts }) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState(initialPosts)
  const [tagFilter, setTagFilter] = useState(null) // null | string

  const processedSearchList = useMemo(
    () =>
      searchList.map((item) => ({
        ...item,
        data: {
          ...item.data,
          title: String(item.data.title || '').toLowerCase(),
          description: String(item.data.description || '').toLowerCase(),
          tags: Array.isArray(item.data.tags)
            ? item.data.tags.map((tag) => String(tag).toLowerCase())
            : [],
        },
      })),
    [searchList],
  )

  const fuse = useMemo(
    () => new Fuse(processedSearchList, fuseOptions),
    [processedSearchList],
  )

  const handleOnSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.length > 2) {
        const results = fuse
          .search(searchQuery.toLowerCase())
          .map((result) => result.item)
        setSearchResults(results)
      } else {
        setSearchResults(initialPosts)
      }
    }, 100),
    [fuse, initialPosts],
  )

  const handleInputChange = (event) => {
    const searchQuery = event.target.value
    setQuery(searchQuery)
    handleOnSearch(searchQuery)
  }

  // Final posts = search results → tag filter → date sort
  const displayPosts = useMemo(() => {
    let posts = searchResults
    if (tagFilter) {
      posts = posts.filter((p) =>
        p.data.tags?.some(
          (t) => String(t).toLowerCase() === tagFilter.toLowerCase(),
        ),
      )
    }
    // When not searching, always sort most recent first
    if (!query) {
      posts = [...posts].sort(
        (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
      )
    }
    return posts
  }, [searchResults, tagFilter, query])

  // Tags available across ALL posts (not filtered) to keep the list stable
  const availableTags = useMemo(() => {
    const tagSet = new Set()
    searchList.forEach((post) => {
      post.data.tags?.forEach((tag) => tagSet.add(String(tag)))
    })
    return [...tagSet].sort((a, b) => a.localeCompare(b))
  }, [searchList])

  const toggleTag = (tag) =>
    setTagFilter((prev) => (prev === tag ? null : tag))

  const hasActiveFilter = Boolean(tagFilter)

  return (
    <div>
      {/* Search input */}
      <div>
        <label
          htmlFor="search"
          className="text-foreground mb-2 block text-sm font-medium dark:text-white"
        >
          Search
        </label>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          name="search"
          id="search"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Search posts"
          className="w-full outline-none focus:ring-0 dark:bg-neutral-900 dark:text-white"
        />
      </div>

      {/* Tag filter */}
      {availableTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="cursor-pointer"
            >
              <Badge
                variant={tagFilter === tag ? 'default' : 'secondary'}
                className={cn(
                  'transition-colors',
                  tagFilter === tag && 'bg-foreground text-background',
                )}
              >
                #{tag}
              </Badge>
            </button>
          ))}
        </div>
      )}

      <hr className="my-6 border-neutral-200 dark:border-neutral-700" />

      {/* Results count when search/filter active */}
      <div
        className={cn(
          'flex items-center justify-between',
          'mb-4',
          !query && !hasActiveFilter && 'invisible',
        )}
      >
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {displayPosts.length} post{displayPosts.length !== 1 ? 's' : ''} found
        </h2>
        {query && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Search results for: <strong>{query}</strong>
          </p>
        )}
      </div>

      <div className="mt-6 min-h-screen">
        <ul className="flex flex-col gap-4">
          {displayPosts.slice(0, 50).map((post, index) => (
            <li key={post.id || post.slug || index}>
              <BlogCardJSX entry={post} isLatest={index === 0 && !hasActiveFilter && !query} />
            </li>
          ))}
        </ul>

        {displayPosts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              No posts found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
