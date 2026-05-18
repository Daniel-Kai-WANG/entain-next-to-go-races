import type { ThemeMode } from '@/types/race'

export function getNowInSeconds() {
  return Math.floor(Date.now() / 1000)
}

export function formatCountdown(targetSeconds: number, nowSeconds: number) {
  const difference = targetSeconds - nowSeconds

  if (difference >= 3600) {
    const hours = Math.floor(difference / 3600)
    const minutes = Math.floor((difference % 3600) / 60)
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }

  if (difference >= 60) {
    const minutes = Math.floor(difference / 60)
    const seconds = difference % 60
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`
  }

  if (difference >= 0) {
    return `${difference}s`
  }

  const startedSecondsAgo = Math.abs(difference)
  return `Started ${startedSecondsAgo}s ago`
}

export function formatLastUpdated(timestamp: number | null) {
  if (!timestamp) {
    return 'Waiting for data'
  }

  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp)
}

export function nextThemeMode(currentTheme: ThemeMode): ThemeMode {
  return currentTheme === 'dark' ? 'light' : 'dark'
}
