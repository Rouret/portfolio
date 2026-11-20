import { AnimatePresence, motion } from 'framer-motion'
import { Check, Compass, Eye, FileText, GitMerge, PenLine, RotateCcw, SquareTerminal, Stamp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Stage = {
  icon: typeof Check
  title: string
  who: string
  does: string
  posture: string[]
  never: string[]
  output: string
  artifact: string
  highRiskOnly?: boolean
  sendBack?: { artifact: string }
}

const stages: Stage[] = [
  {
    icon: FileText,
    title: 'Ticket',
    who: 'You + the ticket skill',
    does: 'Turns a request into a contract the dev can execute without guessing.',
    posture: [
      'Asks one question at a time.',
      'Refuses "it feels smoother" and asks for the visible end state.',
      'Splits a ticket that covers two features.',
    ],
    never: ['Writes code', 'Accepts an unobservable criterion'],
    output: 'The ticket',
    artifact: `Feature, risk: high, touches the map

AC-1  Given a section is hidden in settings,
      when I open the detail screen,
      then that section is not displayed.
AC-2  Given I reordered the sections,
      when I relaunch the app,
      then the new order is kept.

Out of scope: syncing across devices.`,
  },
  {
    icon: Compass,
    title: 'Dev lead',
    who: 'Agent: designs, delegates, verifies',
    does: 'Owns the design and the proof. Writes the feature card and the end-to-end tests before any code exists.',
    posture: [
      'Briefed as a senior engineer: a posture, not a procedure.',
      'Reproduces a bug and proves the cause before changing anything.',
      'Stops and asks when a decision changes the architecture or the scope.',
    ],
    never: ['Types the production code', 'Says green without evidence'],
    output: 'Card + frozen tests',
    artifact: `card   detail-sections  (AC-1, AC-2)
e2e    [detail-sections/AC-1] hidden section is absent
e2e    [detail-sections/AC-2] order survives a relaunch
design order stored as a list of section ids`,
  },
  {
    icon: PenLine,
    title: 'Writer',
    who: 'Sub-agent',
    does: 'Writes the code and the unit tests inside the scope the lead defined. Mandatory even for a tiny ticket: writing and verifying stay separate.',
    posture: ['Receives a narrow brief and nothing else.', 'Its summary is never trusted: the lead reads the diff.'],
    never: ['Touches the end-to-end tests', 'Leaves its allowed files'],
    output: 'Code + unit tests',
    artifact: `brief
  scope       settings toggle + detail rendering
  allowed     settings/, detail/, storage/sections
  data shape  { hidden: SectionId[], order: SectionId[] }
  success     unit tests green, e2e untouched`,
  },
  {
    icon: SquareTerminal,
    title: 'Runners',
    who: 'Disposable sub-agents',
    does: 'Each runs one command, returns the result and the path to its evidence, then disappears. The lead keeps a clean context for judgment.',
    posture: ['Fixed data only: seeded storage, mocked API.', 'One retry for a flaky test, traced.'],
    never: ['Interprets results', 'Counts an inconclusive run as a pass'],
    output: 'Evidence files',
    artifact: `lint    exit 0
types   exit 0
unit    exit 0   14 passed
e2e     exit 0    2 passed   retries: 0
evidence → report, 4 screenshots, manifest`,
  },
  {
    icon: Eye,
    title: 'Second opinion',
    who: 'A different model',
    does: 'For changes where a blind spot is expensive: persisted storage, migrations, auth, global navigation.',
    posture: ['Different model, different blind spots.'],
    never: ['Replaces the stamp'],
    output: 'Concerns to answer',
    highRiskOnly: true,
    artifact: `concern  existing users have no stored order:
         the first launch after the update must
         fall back to the default order.
lead     added a migration test from the old format.`,
  },
  {
    icon: Stamp,
    title: 'Stamp',
    who: 'Reviewer with a fresh context',
    does: 'Checks the need is met and the evidence holds. Re-runs nothing. Says yes, or no with every reason at once.',
    posture: [
      'Writes the expected end state of each criterion from the ticket alone, before reading any test.',
      'A summary written by an agent is not evidence.',
    ],
    never: ['Fixes code', 'Re-runs tests'],
    output: 'Yes or no',
    artifact: `expected AC-2: order visible after a real relaunch

verdict  NO
  AC-2  the assertion checks the order before
        the relaunch, not after. It proves nothing.`,
    sendBack: {
      artifact: `fresh dev session reads the verdict
e2e      [detail-sections/AC-2] relaunch, then assert
runners  exit 0, 2 passed

verdict  YES
  AC-1  section absent, screenshot 2
  AC-2  order kept after relaunch, screenshot 4`,
    },
  },
  {
    icon: GitMerge,
    title: 'Merge',
    who: 'You',
    does: 'A short look at the screenshots, then merge. High risk: you read the diff too. A script marks the card verified on the merged commit.',
    posture: ['After two send-backs, the ticket comes back to you.'],
    never: ['Delegated to an agent'],
    output: 'Proven change',
    artifact: `merged
card detail-sections → verified on the merged commit`,
  },
]

function Artifact({ stage }: { stage: Stage }) {
  const [sentBack, setSentBack] = useState(false)
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="bg-background overflow-hidden rounded-lg border">
        <div className="text-muted-foreground flex items-center justify-between border-b px-3 py-1.5 text-[11px] tracking-wide uppercase">
          <span>Hands over: {stage.output}</span>
          {stage.sendBack && <span>{sentBack ? 'Round 2' : 'Round 1'}</span>}
        </div>
        <pre className="text-foreground/90 m-0 overflow-x-auto p-3 font-mono text-xs leading-relaxed whitespace-pre">
          {sentBack && stage.sendBack ? stage.sendBack.artifact : stage.artifact}
        </pre>
      </div>
      {stage.sendBack && !sentBack && (
        <button
          type="button"
          onClick={() => setSentBack(true)}
          className="border-destructive/40 text-foreground hover:bg-destructive/10 flex items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm transition-colors"
        >
          <RotateCcw className="size-4" />
          Send it back to the lead
        </button>
      )}
    </div>
  )
}

export default function FactoryFlow() {
  const [active, setActive] = useState(0)
  const next = stages[active + 1]

  return (
    <div className="not-prose bg-card my-8 overflow-hidden rounded-xl border">
      <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-muted-foreground m-0 text-[11px] tracking-wide uppercase">Following one ticket</p>
          <p className="text-foreground m-0 text-sm font-medium">Users can hide and reorder sections of the detail screen</p>
        </div>
        <span className="text-muted-foreground font-mono text-xs">
          {active + 1} / {stages.length}
        </span>
      </div>

      <ol className="m-0 flex list-none flex-col p-0 px-4 py-4 sm:px-5">
        {stages.map((s, index) => {
          const Icon = s.icon
          const done = index < active
          const isActive = index === active
          const isLast = index === stages.length - 1
          return (
            <li key={s.title} className="relative m-0 flex gap-3 p-0 sm:gap-4">
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-9 bottom-0 left-[15px] w-0.5',
                    done ? 'bg-primary' : 'bg-muted-foreground/30',
                    s.highRiskOnly && !done && 'border-muted-foreground/40 border-l-2 border-dashed bg-transparent',
                  )}
                />
              )}
              <span
                className={cn(
                  'relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  isActive && 'border-primary bg-background text-primary ring-primary/20 ring-4',
                  !done && !isActive && 'bg-background text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              </span>

              <div className={cn('min-w-0 grow', isLast ? 'pb-0' : 'pb-5')}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-expanded={isActive}
                  className="group flex w-full flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1 text-left"
                >
                  <span
                    className={cn(
                      'font-medium transition-colors',
                      isActive ? 'text-foreground text-lg' : 'text-foreground/80 group-hover:text-foreground',
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="text-muted-foreground text-xs">{s.who}</span>
                  {s.highRiskOnly && (
                    <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[11px]">
                      high risk only
                    </span>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-4 pt-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                        <div className="flex flex-col gap-3 text-sm">
                          <p className="text-foreground/85 m-0 leading-relaxed">{s.does}</p>
                          <div className="flex flex-col gap-1.5">
                            {s.posture.map((line) => (
                              <p key={line} className="text-foreground/75 border-primary/40 m-0 border-l-2 pl-3 leading-snug">
                                {line}
                              </p>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-muted-foreground text-[11px] tracking-wide uppercase">Never</span>
                            {s.never.map((item) => (
                              <span
                                key={item}
                                className="border-destructive/40 text-foreground/80 rounded-md border border-dashed px-2 py-0.5 text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Artifact stage={s} />
                      </div>
                      {next && (
                        <button
                          type="button"
                          onClick={() => setActive(active + 1)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                        >
                          Next: {next.title} →
                        </button>
                      )}
                      {!next && (
                        <button
                          type="button"
                          onClick={() => setActive(0)}
                          className="text-foreground hover:bg-muted mt-4 rounded-lg border px-4 py-2 text-sm transition-colors"
                        >
                          Start again
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
