import type { Variants } from 'motion/react'

export { GITHUB_URL, RELEASES_URL, REPO } from './release'

export const DOCS_URL = 'https://github.com/Aver005/pooprusteek#-installation'

export const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/** Tighter stagger for long lists (asset tables, command grids). */
export const staggerTight: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

export const viewportOnce = { once: true, margin: '-80px' } as const
