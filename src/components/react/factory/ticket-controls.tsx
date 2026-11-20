import { useState } from 'react'
import { cn } from '@/lib/utils'

const types = [
  { id: 'feature', label: 'Feature', hint: 'New visible behavior', proof: 'End-to-end tests for every criterion, written before the code.', map: 'Card updated before the code.' },
  { id: 'bug', label: 'Bug', hint: 'Wrong behavior', proof: 'A test that reproduces the bug: red before the fix, green after.', map: 'Card updated only if visible behavior changes.' },
  { id: 'refactor', label: 'Refactor', hint: 'Same behavior, better code', proof: 'Existing tests unchanged, still green.', map: 'Untouched.' },
  { id: 'internal', label: 'Internal', hint: 'Tooling, nothing visible', proof: 'Unit tests, lint and types.', map: 'Untouched.' },
] as const

const risks = [
  { id: 'low', label: 'Low', hint: 'Copy, style, an isolated component', control: 'Stamp only, fast merge.' },
  { id: 'normal', label: 'Normal', hint: 'A regular feature or bug', control: 'The full flow.' },
  { id: 'high', label: 'High', hint: 'Storage, migration, auth, navigation', control: 'A second model reviews before delivery, and you read the diff before merging.' },
] as const

function Options<T extends { id: string; label: string; hint: string }>({
  question,
  options,
  value,
  onChange,
  columns,
}: {
  question: string
  options: readonly T[]
  value: string
  onChange: (id: T['id']) => void
  columns: string
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="text-foreground mb-2 p-0 text-sm font-medium">{question}</legend>
      <div role="radiogroup" aria-label={question} className={cn('grid gap-2', columns)}>
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                'bg-background flex flex-col items-start rounded-lg border-2 px-3 py-2.5 text-left transition-colors',
                selected ? 'border-primary' : 'border-border hover:border-primary/40',
              )}
            >
              <span className="text-foreground text-sm font-medium">{option.label}</span>
              <span className="text-muted-foreground text-xs leading-snug">{option.hint}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function TicketControls() {
  const [typeId, setTypeId] = useState<string>('feature')
  const [riskId, setRiskId] = useState<string>('normal')
  const type = types.find((t) => t.id === typeId)!
  const risk = risks.find((r) => r.id === riskId)!

  const rows = [
    { label: 'Proof required', value: type.proof },
    { label: 'Feature map', value: type.map },
    { label: 'Extra control', value: risk.control },
  ]

  return (
    <div className="not-prose bg-card my-8 grid gap-5 rounded-xl border p-4 sm:p-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <Options question="What kind of ticket?" options={types} value={typeId} onChange={setTypeId} columns="grid-cols-2" />
        <Options question="How risky is it?" options={risks} value={riskId} onChange={setRiskId} columns="grid-cols-1 sm:grid-cols-3" />
      </div>
      <div aria-live="polite" className="bg-muted/50 flex flex-col gap-4 self-start rounded-lg p-4">
        <p className="text-muted-foreground m-0 text-[11px] tracking-wide uppercase">
          {type.label} · {risk.label.toLowerCase()} risk
        </p>
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-muted-foreground m-0 text-xs">{row.label}</p>
            <p className="text-foreground m-0 text-base leading-snug">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
