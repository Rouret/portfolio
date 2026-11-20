import { useState } from 'react'
import { cn } from '@/lib/utils'

const stages = [
  { label: 'An agent fails', detail: 'A send-back, a revert, a band-aid caught in review.' },
  { label: 'Find the hole', detail: 'Which missing check, tool or rule let it through? The agent is not the culprit.' },
  { label: 'Encode it', detail: 'A test, a lint rule, a tool or a skill rule. Something that runs, not a sentence in a prompt.' },
  { label: 'Measure', detail: 'Send-back rate, revert rate, cost per pull request, cycle time. One variable changed at a time.' },
]

export default function ImprovementLoop() {
  const [active, setActive] = useState(0)

  return (
    <div className="not-prose bg-card my-8 rounded-xl border p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stages.map((stage, index) => (
          <button
            key={stage.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={cn(
              'relative rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
              active === index ? 'border-primary bg-background' : 'hover:border-primary/40',
            )}
          >
            <span className="text-primary block font-mono text-xs">{index + 1}</span>
            <span className="text-foreground">{stage.label}</span>
          </button>
        ))}
      </div>
      <p className="text-muted-foreground m-0 mt-2 text-right text-xs">
        <span aria-hidden>↺ </span>back to 1, with one less way to fail
      </p>
      <p className="text-foreground/85 m-0 mt-3 text-sm leading-relaxed">{stages[active].detail}</p>
    </div>
  )
}
