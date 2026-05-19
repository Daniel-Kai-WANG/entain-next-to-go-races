import type { CountdownState, ThemeMode } from '@/types/race'

export function getNowInSeconds() {
  return Math.floor(Date.now() / 1000)
}

export function formatCountdown(targetSeconds: number, nowSeconds: number) {
  const difference = targetSeconds - nowSeconds
  const absoluteDifference = Math.abs(difference)
  const hours = Math.floor(absoluteDifference / 3600)
  const minutes = Math.floor((absoluteDifference % 3600) / 60)
  const seconds = absoluteDifference % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
  }

  return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
}

export function classifyCountdownState(targetSeconds: number, nowSeconds: number): CountdownState {
  const difference = targetSeconds - nowSeconds

  if (difference < 0) {
    return 'critical-live'
  }

  if (difference < 60) {
    return 'urgent'
  }

  if (difference <= 600) {
    return 'warning'
  }

  return 'normal'
}

export function formatRaceStartTime(targetSeconds: number) {
  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(targetSeconds * 1000)
}

export function formatDistance(distance: number | null, distanceUnit: string | null) {
  if (!distance) {
    return null
  }

  return distanceUnit ? `${distance}${distanceUnit}` : `${distance}`
}

export function formatLastUpdated(timestamp: number | null, currentTimestamp = Date.now()) {
  if (!timestamp) {
    return 'Waiting'
  }

  const differenceInSeconds = Math.max(0, Math.floor((currentTimestamp - timestamp) / 1000))

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s ago`
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60)

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m ago`
  }

  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)
}

export function nextThemeMode(currentTheme: ThemeMode): ThemeMode {
  return currentTheme === 'dark' ? 'light' : 'dark'
}
