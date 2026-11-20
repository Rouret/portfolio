import type { ImageMetadata } from 'astro'
import almanachNaval from '@/assets/library/almanach-naval.jpg'
import atomicHabits from '@/assets/library/atomic-habits.jpg'
import buildToSell from '@/assets/library/build-to-sell.jpg'
import cultiverOptimisme from '@/assets/library/cultiver-optimisme.jpg'
import leanStartup from '@/assets/library/lean-startup.jpg'
import leanTechManifesto from '@/assets/library/lean-tech-manifesto.jpg'
import learningToScale from '@/assets/library/learning-to-scale.jpg'

export type BookTheme = 'entrepreneurship' | 'management' | 'mindset'

export interface Book {
  id: string
  title: string
  subtitle?: string
  author: string
  spineAuthor: string
  lang?: 'fr'
  theme: BookTheme
  whatItIs: string
  whyILoveIt: string
  article?: { label: string; href: string }
  spineColor: string
  cover: ImageMetadata
  isbn10: string
}

export const THEME_LABELS: Record<BookTheme, string> = {
  entrepreneurship: 'Entrepreneurship',
  management: 'Management',
  mindset: 'Mindset',
}

export const amazonUrl = (book: Book) => `https://www.amazon.fr/dp/${book.isbn10}`

export const BOOKS: Book[] = [
  {
    id: 'build-to-sell',
    title: 'Build to Sell',
    subtitle: 'The Lean Secret to Crafting Irresistible Products',
    author: 'Sandrine Olivencia, Flavian Hautbois, Caroline Besnard',
    spineAuthor: 'Olivencia',
    theme: 'entrepreneurship',
    whatItIs:
      'Lean principles applied to product creation: simplicity, customer value and building to cost, with the role of the Chief Product Engineer at the centre.',
    whyILoveIt:
      "Full of real success stories about products that sold. It keeps me honest: get feedback early, talk to users fast, and stop chasing the next feature nobody asked for.",
    spineColor: '#f2df1f',
    cover: buildToSell,
    isbn10: '295945040X',
  },
  {
    id: 'lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    spineAuthor: 'Ries',
    theme: 'entrepreneurship',
    whatItIs:
      'Build, measure, learn: ship a minimum viable product, test your ideas with real users, and decide to persevere or pivot based on evidence.',
    whyILoveIt:
      "It gave me a structure to see whether a project is really working, and how to pivot when it isn't. We used it at Theodo, and with Swelly we run the build, measure, learn loop every month to decide what to keep, change or drop.",
    spineColor: '#1c8fd6',
    cover: leanStartup,
    isbn10: '0307887898',
  },
  {
    id: 'lean-tech-manifesto',
    title: 'The Lean Tech Manifesto',
    subtitle: 'Learn the Secrets of Tech Leaders to Grasp the Full Benefits of Agile at Scale',
    author: 'Fabrice Bernhard, Benoît Charles-Lavauzelle',
    spineAuthor: 'Bernhard',
    theme: 'management',
    whatItIs:
      "How lean thinking helps tech organisations keep the speed of a small agile team as they grow, drawn from the authors' experience at Theodo.",
    whyILoveIt:
      "The clearest explanation I know of why lean is so powerful, and how to bring it into a big company without losing what makes small teams fast. Written by Theodo's founders, so I read it with my own projects in mind.",
    spineColor: '#f2f0ea',
    cover: leanTechManifesto,
    isbn10: '1260459020',
  },
  {
    id: 'learning-to-scale',
    title: 'Learning to Scale',
    subtitle: 'The Secret to Growing a Fast and Resilient Company',
    author: 'Régis Medina',
    spineAuthor: 'Medina',
    theme: 'management',
    whatItIs:
      'How Theodo used lean as a learning system to grow fast without breaking, told as a practical field guide.',
    whyILoveIt:
      "The book Theodo grew from. It shows lean as a way to learn rather than a set of rules, and how that learning lets a company grow fast without breaking. A great pair with The Lean Tech Manifesto: same roots, seen from the inside.",
    spineColor: '#2aa7c9',
    cover: learningToScale,
    isbn10: '2957107406',
  },
  {
    id: 'cultiver-optimisme',
    title: "Cultiver l'optimisme",
    subtitle: "Les bienfaits de l'intelligence émotionnelle dans la vie professionnelle",
    author: 'Harvard Business Review',
    spineAuthor: 'HBR',
    lang: 'fr',
    theme: 'mindset',
    whatItIs:
      'A short Harvard Business Review collection on staying confident at work: handling stress and negativity, compassion and gratitude.',
    whyILoveIt:
      "It helped me understand where negativity and doubt come from, whether it's mine weighing on others or theirs weighing on me, and how to get past it. Staying positive is a skill: it stops me from moving backward out of fear, or because I took on someone else's mood.",
    spineColor: '#f39a80',
    cover: cultiverOptimisme,
    isbn10: '2810441073',
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    spineAuthor: 'Clear',
    theme: 'mindset',
    whatItIs:
      'Small changes, repeated daily, compound into big results. A method to build good habits and drop bad ones.',
    whyILoveIt:
      "The classic on discipline: progress comes from small steps repeated every day, not from one big leap. What stayed with me most is the link between habits and identity: you become who you practise being.",
    article: { label: 'Why I almost gave up', href: '/articles/why-i-almost-gave-up' },
    spineColor: '#efe7da',
    cover: atomicHabits,
    isbn10: '0735211299',
  },
  {
    id: 'almanach-naval',
    title: "L'Almanach de Naval Ravikant",
    subtitle: "Un guide pour s'enrichir et être heureux",
    author: 'Eric Jorgenson',
    spineAuthor: 'Jorgenson',
    lang: 'fr',
    theme: 'mindset',
    whatItIs:
      "Ten years of Naval Ravikant's ideas on wealth and happiness, collected from his tweets, podcasts and interviews.",
    whyILoveIt:
      "Naval's simple ideas on building wealth without needing luck: own what you build, and use leverage like code, media or a company. A short read I come back to whenever I think about what to make next.",
    spineColor: '#f5f3ef',
    cover: almanachNaval,
    isbn10: '236117071X',
  },
]
