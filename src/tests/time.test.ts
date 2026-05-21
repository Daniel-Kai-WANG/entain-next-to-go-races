import { classifyCountdownState, formatCountdown, nextThemeMode } from '@/utils/time'

describe('time utilities', () => {
  it('formats countdowns under one minute as minutes and seconds', () => {
    expect(formatCountdown(90, 60)).toBe('00m 30s')
  })

  it('formats countdowns over one minute as minutes and seconds', () => {
    expect(formatCountdown(190, 60)).toBe('02m 10s')
  })

  it('formats countdowns with hours as hours, minutes and seconds', () => {
    expect(formatCountdown(3723, 0)).toBe('01h 02m 03s')
  })

  it('formats live races after the advertised start', () => {
    expect(formatCountdown(60, 75)).toBe('00m 15s')
  })

  it('classifies countdowns that are over ten minutes away as normal', () => {
    expect(classifyCountdownState(1000, 0)).toBe('normal')
  })

  it('classifies countdowns between one and ten minutes as warning', () => {
    expect(classifyCountdownState(300, 0)).toBe('warning')
  })

  it('classifies countdowns under one minute as urgent', () => {
    expect(classifyCountdownState(45, 0)).toBe('urgent')
  })

  it('classifies already-started races as critical live', () => {
    expect(classifyCountdownState(45, 50)).toBe('critical-live')
  })

  it('toggles between light and dark theme names', () => {
    expect(nextThemeMode('light')).toBe('dark')
  })
})
