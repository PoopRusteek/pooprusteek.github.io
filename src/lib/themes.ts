// The agent's own theme presets, lifted verbatim from
// pooprusteek/src/tui/theme.rs (PRESETS + the Theme::* builders).
// Keys are the TUI role names; `applyTheme` maps them onto the CSS tokens
// declared in index.css. Re-sync with a parse of theme.rs, never by hand.

export interface ThemeColors {
  bg: string
  panel: string
  fg: string
  accent: string
  accent_dim: string
  accent_soft: string
  border: string
  border_focus: string
  text_dim: string
  text_soft: string
  error: string
  success: string
  warning: string
  user_bg: string
  tool_bg: string
  input_bg: string
  selection: string
}

export interface ThemePreset {
  /** `/themes <name>` in the TUI */
  name: string
  label: string
  description: string
  colors: ThemeColors
}

export const THEMES: ThemePreset[] = [
  {
    name: 'default',
    label: 'Midnight',
    description: 'the original deep-navy look with electric blue accents',
    colors: {
      bg: '#0b0e19', panel: '#111727', fg: '#e2e8f0',
      accent: '#60a5fa', accent_dim: '#3b82f6', accent_soft: '#7dd3fc',
      border: '#2a3854', border_focus: '#60a5fa',
      text_dim: '#7888a4', text_soft: '#94a3b8',
      error: '#f38ba8', success: '#a6e3a1', warning: '#f9e2af',
      user_bg: '#1c2740', tool_bg: '#26203a', input_bg: '#0f1524',
      selection: '#222d48',
    },
  },
  {
    name: 'catppuccin',
    label: 'Catppuccin Mocha',
    description: 'soothing pastels on a warm dark base, mauve accents',
    colors: {
      bg: '#1e1e2e', panel: '#181825', fg: '#cdd6f4',
      accent: '#cba6f7', accent_dim: '#6c5a99', accent_soft: '#b4befe',
      border: '#313244', border_focus: '#cba6f7',
      text_dim: '#6c7086', text_soft: '#a6adc8',
      error: '#f38ba8', success: '#a6e3a1', warning: '#f9e2af',
      user_bg: '#313244', tool_bg: '#2a2438', input_bg: '#181825',
      selection: '#45475a',
    },
  },
  {
    name: 'dracula',
    label: 'Dracula',
    description: 'the classic purple-and-pink vampire palette',
    colors: {
      bg: '#282a36', panel: '#21222c', fg: '#f8f8f2',
      accent: '#bd93f9', accent_dim: '#62479c', accent_soft: '#ff79c6',
      border: '#44475a', border_focus: '#bd93f9',
      text_dim: '#6272a4', text_soft: '#9ea8c7',
      error: '#ff5555', success: '#50fa7b', warning: '#f1fa8c',
      user_bg: '#3a3d4d', tool_bg: '#35304a', input_bg: '#21222c',
      selection: '#44475a',
    },
  },
  {
    name: 'gruvbox',
    label: 'Gruvbox Dark',
    description: 'retro warm earth tones with punchy orange',
    colors: {
      bg: '#282828', panel: '#1d2021', fg: '#ebdbb2',
      accent: '#fe8019', accent_dim: '#9d5300', accent_soft: '#fabd2f',
      border: '#3c3836', border_focus: '#fe8019',
      text_dim: '#7c6f64', text_soft: '#a89984',
      error: '#fb4934', success: '#b8bb26', warning: '#fabd2f',
      user_bg: '#3c3836', tool_bg: '#32302f', input_bg: '#1d2021',
      selection: '#504945',
    },
  },
  {
    name: 'nord',
    label: 'Nord',
    description: 'arctic blues and frosted polar-night calm',
    colors: {
      bg: '#2e3440', panel: '#292e39', fg: '#eceff4',
      accent: '#88c0d0', accent_dim: '#5e81ac', accent_soft: '#8fbcbb',
      border: '#3b4252', border_focus: '#88c0d0',
      text_dim: '#616e88', text_soft: '#d8dee9',
      error: '#bf616a', success: '#a3be8c', warning: '#ebcb8b',
      user_bg: '#3b4252', tool_bg: '#434c5e', input_bg: '#292e39',
      selection: '#434c5e',
    },
  },
  {
    name: 'tokyo-night',
    label: 'Tokyo Night',
    description: 'neon-lit indigo inspired by downtown Tokyo at night',
    colors: {
      bg: '#1a1b26', panel: '#16161e', fg: '#c0caf5',
      accent: '#7aa2f7', accent_dim: '#3d59a1', accent_soft: '#7dcfff',
      border: '#292e42', border_focus: '#7aa2f7',
      text_dim: '#565f89', text_soft: '#9aa5ce',
      error: '#f7768e', success: '#9ece6a', warning: '#e0af68',
      user_bg: '#283457', tool_bg: '#2d2545', input_bg: '#16161e',
      selection: '#33467c',
    },
  },
  {
    name: 'rose-pine',
    label: 'Rosé Pine',
    description: 'muted florals — iris, rose and gold on soot',
    colors: {
      bg: '#191724', panel: '#1f1d2e', fg: '#e0def4',
      accent: '#c4a7e7', accent_dim: '#56526e', accent_soft: '#ebbcba',
      border: '#26233a', border_focus: '#c4a7e7',
      text_dim: '#6e6a86', text_soft: '#908caa',
      error: '#eb6f92', success: '#9ccfd8', warning: '#f6c177',
      user_bg: '#2a273f', tool_bg: '#26233a', input_bg: '#1f1d2e',
      selection: '#403d52',
    },
  },
  {
    name: 'synthwave',
    label: "Synthwave '84",
    description: 'hot pink and cyan straight off a retro-future VHS',
    colors: {
      bg: '#2a2139', panel: '#241b2f', fg: '#f4f0fa',
      accent: '#ff7edb', accent_dim: '#8f2d80', accent_soft: '#36f9f6',
      border: '#463465', border_focus: '#ff7edb',
      text_dim: '#7a6f9b', text_soft: '#a99bc9',
      error: '#fe4450', success: '#72f1b8', warning: '#fede5d',
      user_bg: '#34294f', tool_bg: '#3b2b52', input_bg: '#241b2f',
      selection: '#463465',
    },
  },
  {
    name: 'matrix',
    label: 'Matrix',
    description: 'phosphor green rain on pitch black',
    colors: {
      bg: '#050805', panel: '#0a120a', fg: '#b0ffb0',
      accent: '#00ff41', accent_dim: '#007828', accent_soft: '#80ffaa',
      border: '#143c14', border_focus: '#00ff41',
      text_dim: '#3c823c', text_soft: '#64b464',
      error: '#ff5050', success: '#00ff41', warning: '#c8ff64',
      user_bg: '#0a280f', tool_bg: '#082014', input_bg: '#050f08',
      selection: '#10401c',
    },
  },
  {
    name: 'paper',
    label: 'Paper Light',
    description: 'a light theme — warm paper white with indigo ink',
    colors: {
      bg: '#faf9f5', panel: '#f0eee7', fg: '#2d2b26',
      accent: '#6366f1', accent_dim: '#c7d2fe', accent_soft: '#4f46e5',
      border: '#d6d3c8', border_focus: '#6366f1',
      text_dim: '#928e82', text_soft: '#6e6b61',
      error: '#dc2626', success: '#16a34a', warning: '#ca8a04',
      user_bg: '#e8e9f5', tool_bg: '#eee8f5', input_bg: '#f3f2ec',
      selection: '#dbdef3',
    },
  },
]

export const DEFAULT_THEME = THEMES[0]

export function themeByName(name: string | null | undefined): ThemePreset {
  return THEMES.find((t) => t.name === name) ?? DEFAULT_THEME
}

/** TUI role → the CSS token declared in index.css `@theme`. */
const TOKEN: Array<[keyof ThemeColors, string]> = [
  ['bg', '--color-ink'],
  ['panel', '--color-panel'],
  ['input_bg', '--color-panel-deep'],
  ['fg', '--color-fg'],
  ['accent', '--color-accent'],
  ['accent_dim', '--color-accent-dim'],
  ['accent_soft', '--color-accent-soft'],
  ['border', '--color-line'],
  ['border_focus', '--color-focus'],
  ['text_dim', '--color-dim'],
  ['text_soft', '--color-soft'],
  ['error', '--color-err'],
  ['success', '--color-ok'],
  ['warning', '--color-warn'],
  ['selection', '--color-sel'],
  ['user_bg', '--color-user-msg'],
  ['tool_bg', '--color-tool-msg'],
]

function channels(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Perceived brightness 0..1 — light themes need a gentler CRT overlay. */
export function luminance(hex: string): number {
  const [r, g, b] = channels(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

/**
 * Writes the preset onto `:root` as inline custom properties. Inline styles
 * beat the stylesheet's `@theme` block, so every Tailwind token utility on
 * the page follows along — including `bg-accent/10`, which compiles to a
 * color-mix over the same variable.
 */
export function applyTheme(preset: ThemePreset): void {
  const root = document.documentElement
  for (const [role, token] of TOKEN) {
    root.style.setProperty(token, preset.colors[role])
  }

  // CRT scanlines and vignette are ink-tinted, so they have to be derived
  // per theme: on Paper Light the dark bands of the default overlay read as
  // dirt rather than phosphor.
  const light = luminance(preset.colors.bg) > 0.5
  const [r, g, b] = channels(preset.colors.bg)
  const scan = light
    ? `rgba(${Math.round(r * 0.55)}, ${Math.round(g * 0.55)}, ${Math.round(b * 0.5)}, 0.07)`
    : `rgba(${Math.round(r * 0.7)}, ${Math.round(g * 0.7)}, ${Math.round(b * 0.7)}, 0.22)`
  const vignette = light
    ? `rgba(${Math.round(r * 0.6)}, ${Math.round(g * 0.6)}, ${Math.round(b * 0.55)}, 0.14)`
    : `rgba(${Math.round(r * 0.35)}, ${Math.round(g * 0.4)}, ${Math.round(b * 0.5)}, 0.55)`
  root.style.setProperty('--crt-scan', scan)
  root.style.setProperty('--crt-vignette', vignette)
  root.style.setProperty('color-scheme', light ? 'light' : 'dark')
  root.dataset.theme = preset.name

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', preset.colors.bg)
}
