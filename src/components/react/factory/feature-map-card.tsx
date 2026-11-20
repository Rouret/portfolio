import { useState } from 'react'
import { cn } from '@/lib/utils'

const sections = [
  {
    id: 'header',
    lines: [
      'id: detail-sections',
      'from: [city-detail]',
      'paths: [detail/**, settings/sections/**]',
      'verified: on commit 4f2a91c',
    ],
    why: 'A stable id reused in test titles and tickets. "from" traces how users get here. "paths" tells which tests to run after a diff. The verified marker is set by script, never typed.',
  },
  {
    id: 'criteria',
    title: 'Criteria',
    lines: ['AC-1 A hidden section disappears from the detail screen', 'AC-2 The order survives a relaunch'],
    why: 'Short and observable. The detail lives in the ticket; the card keeps only what must stay true.',
  },
  {
    id: 'steering',
    title: 'Steering',
    lines: ['1. Open detail settings   (verified)', '2. Toggle a section       (verified)', 'Proof: section absent, order kept after relaunch'],
    why: 'How an agent drives the app to this feature. Each step is marked verified, or unverified with a reason, so nobody trusts a path that was never walked.',
  },
  {
    id: 'integration',
    title: 'Integration',
    lines: ['Recipe: "Add a section to the detail screen"'],
    why: 'Only a pointer to the module recipe. The code stays the technical truth; the card never duplicates it.',
  },
  {
    id: 'pitfalls',
    title: 'Pitfalls',
    lines: ['Static preview, never an API hook'],
    why: 'What already bit someone here. Cheaper than rediscovering it.',
  },
]

export default function FeatureMapCard() {
  const [active, setActive] = useState('header')
  const current = sections.find((section) => section.id === active)!

  return (
    <div className="not-prose my-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="bg-card overflow-hidden rounded-xl border font-mono text-xs leading-relaxed">
        <div className="text-muted-foreground border-b px-4 py-2">detail-sections.md · 20 to 60 lines</div>
        <div className="flex flex-col p-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActive(section.id)}
              onMouseEnter={() => setActive(section.id)}
              onFocus={() => setActive(section.id)}
              aria-pressed={active === section.id}
              className={cn(
                'rounded-md px-2 py-1.5 text-left transition-colors',
                active === section.id ? 'bg-secondary/60' : 'hover:bg-muted',
              )}
            >
              {section.title && <span className="text-primary block font-semibold">## {section.title}</span>}
              {section.lines.map((line) => (
                <span key={line} className="text-foreground/85 block whitespace-pre-wrap">
                  {line}
                </span>
              ))}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-muted/50 self-start rounded-xl p-4 md:sticky md:top-24">
        <p className="text-muted-foreground m-0 mb-1 text-xs font-medium tracking-wide uppercase">
          Why it's there
        </p>
        <p className="text-foreground m-0 text-sm leading-relaxed">{current.why}</p>
      </div>
    </div>
  )
}
