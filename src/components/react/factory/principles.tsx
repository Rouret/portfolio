import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const principles = [
  {
    rule: 'The builder never judges its own work.',
    practice:
      'The lead verifies, but a reviewer with a fresh context decides whether the need is met. The reviewer never fixes anything: the moment it edits code, it becomes a builder too.',
  },
  {
    rule: 'A vague ticket does not start.',
    practice:
      '"Make the list feel smoother" goes back. "Given 500 items, when I scroll to the end, then no frame takes longer than 16 ms in the trace" goes through.',
  },
  {
    rule: 'Iterate before handing off.',
    practice:
      'A loop inside the dev step costs seconds. A bounce between agents costs a whole new context. The lead keeps going until it is confident, then hands off once.',
  },
  {
    rule: 'Minimal context.',
    practice:
      'Each agent reads an index first, then only the cards and recipes its ticket touches. A smaller context is cheaper and makes fewer confident mistakes.',
  },
  {
    rule: 'Every correction becomes a check.',
    practice:
      '"Never skip a test" is a sentence an agent can ignore. A lint that fails the build when a skip appears is not.',
  },
  {
    rule: 'If it can be computed, it is not written.',
    practice:
      'No agent ever types "verified". Statuses, links between criteria and tests, and evidence manifests are derived by script from what actually ran.',
  },
  {
    rule: 'Start small.',
    practice:
      'A full harness can cost 20 times a single agent. Each mechanism earns its place by being missed first.',
  },
]

export default function Principles() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
      {principles.map((principle, index) => {
        const isOpen = open === index
        return (
          <button
            key={principle.rule}
            type="button"
            onClick={() => setOpen(isOpen ? null : index)}
            aria-expanded={isOpen}
            className={cn(
              'bg-card hover:border-primary/40 flex flex-col rounded-xl border p-4 text-left transition-colors',
              isOpen && 'border-primary/50 sm:col-span-2',
            )}
          >
            <span className="flex items-start gap-3">
              <span className="text-primary font-mono text-xs leading-6">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-foreground grow font-medium leading-6">
                {principle.rule}
              </span>
              <span
                aria-hidden
                className={cn(
                  'text-muted-foreground leading-6 transition-transform',
                  isOpen && 'rotate-45',
                )}
              >
                +
              </span>
            </span>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.span
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="block overflow-hidden"
                >
                  <span className="text-muted-foreground block pt-3 pl-8 text-sm leading-relaxed">
                    {principle.practice}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}
