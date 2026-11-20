import { motion, useReducedMotion } from 'framer-motion'

const stations = ['Ticket', 'Lead', 'Stamp', 'Merge']

export default function TrustStrip() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="not-prose bg-card my-8 rounded-xl border p-5 sm:p-6"
      aria-label="A ticket moves through lead, stamp and merge"
    >
      <div className="relative flex items-center justify-between">
        <div className="bg-muted-foreground/30 absolute inset-x-6 top-1/2 h-px -translate-y-1/2" />
        {!reduceMotion && (
          <motion.div
            className="bg-primary ring-primary/25 absolute top-1/2 left-6 z-20 size-2.5 -translate-y-1/2 rounded-full ring-4"
            animate={{ left: ['1.5rem', 'calc(100% - 1.5rem)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
          />
        )}
        {stations.map((station) => (
          <div
            key={station}
            className="bg-background text-foreground relative z-10 rounded-full border px-3 py-1.5 font-mono text-xs sm:text-sm"
          >
            {station}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground m-0 mt-4 text-center text-sm">
        Every change leaves with evidence a human can check in 30 seconds.
      </p>
    </div>
  )
}
