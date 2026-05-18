import { formatCountdown, nextThemeMode } from '@/utils/time'

describe('time utilities', () => {
  it('formats countdowns under one minute as seconds', () => {
    expect(formatCountdown(90, 60)).toBe('30s')
  })

  it('formats countdowns over one minute as minutes and seconds', () => {
    expect(formatCountdown(190, 60)).toBe('2m 10s')
  })

  it('formats live races after the advertised start', () => {
    expect(formatCountdown(60, 75)).toBe('Started 15s ago')
  })

  it('toggles between light and dark theme names', () => {
    expect(nextThemeMode('light')).toBe('dark')
  })
})
