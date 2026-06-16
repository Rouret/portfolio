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
    <div className="z-30 mx-auto mt-12 flex w-full flex-col">
      <div className="flex flex-row flex-wrap justify-center gap-3">
        {technologies.map((technology) => (
          <div
            key={technology.name}
            className="tech-badge repo-card border-border bg-card text-muted-foreground flex h-12 items-center gap-2 rounded-full border pr-4 pl-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md sm:h-16 sm:gap-3 sm:pr-5 sm:pl-3"
          >
            <span className="bg-muted flex h-8 w-8 items-center justify-center rounded-full p-1.5 text-base shadow-inner sm:h-10 sm:w-10 sm:p-2 sm:text-lg">
              {technology.icon}
            </span>
            <span className="text-foreground text-sm font-medium sm:text-base">
              {technology.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
