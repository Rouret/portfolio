import { useEffect } from 'react'
import { FaReact } from 'react-icons/fa'
import { SiExpo, SiTypescript } from 'react-icons/si'
type Technology = {
  name: string
  icon: React.ReactNode
}

const technologies: Technology[] = [
  {
    name: 'React',
    icon: <FaReact />,
  },
  {
    name: 'React Native',
    icon: <FaReact />,
  },
  {
    name: 'Expo',
    icon: <SiExpo />,
  },
  {
    name: 'TypeScript',
    icon: <SiTypescript />,
  },
]

const Skills: React.FC = () => {
  useEffect(() => {
    document.querySelectorAll('.tech-badge').forEach((badge) => {
      badge.classList.add('tech-badge-visible')
    })
  }, [])

  return (
    <div className="z-30 mx-auto mt-12 flex w-full max-w-[calc(100vw-5rem)] flex-col lg:max-w-full">
      <div className="flex flex-row justify-center space-y-2">
        {technologies.map((technology) => (
          <div
            key={technology.name}
            className="tech-badge repo-card border-border bg-card text-muted-foreground mr-5 flex h-16 items-center gap-3 rounded-full border p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
          >
            <span className="bg-muted flex h-10 w-10 items-center justify-center rounded-full p-2 text-lg shadow-inner">
              {technology.icon}
            </span>
            <span className="text-foreground font-medium">
              {technology.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
