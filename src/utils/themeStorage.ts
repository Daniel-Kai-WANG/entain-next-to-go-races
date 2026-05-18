import type { ThemeMode } from '@/types/race'

const THEME_STORAGE_KEY = 'entain-theme-preference'

export function getStoredThemePreference() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedValue === 'light' || storedValue === 'dark' ? storedValue : null
}

export function setStoredThemePreference(theme: ThemeMode) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function resolveThemeMode(
  storedPreference: ThemeMode | null,
  prefersDark: boolean,
): ThemeMode {
  if (storedPreference) {
    return storedPreference
  }

  return prefersDark ? 'dark' : 'light'
}

export function applyThemeMode(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
