import type { FilterOptionId, RaceCategoryId } from '@/types/race'

export const ALL_FILTER_ID = 'all' as const
export const CATEGORY_COUNT = 3
export const GREYHOUND_CATEGORY_ID = '9daef0d7-bf3c-4f50-921d-8e818c60fe61' as const
export const HARNESS_CATEGORY_ID = '161d9be2-e909-4326-8c2c-35ed71fb460b' as const
export const HORSE_CATEGORY_ID = '4a2788f8-e825-4d36-9894-efd4baf1cfae' as const

export const RACE_CATEGORY_OPTIONS: Array<{
  id: RaceCategoryId
  accentClass: string
  label: string
  shortLabel: string
  badgeClass: string
}> = [
  {
    id: GREYHOUND_CATEGORY_ID,
    accentClass: 'text-app-light-paletteOldRose dark:text-app-light-paletteOldRose',
    label: 'Greyhound racing',
    shortLabel: 'Greyhound',
    badgeClass:
      'bg-app-light-paletteOldRose/[0.54] text-app-light-paletteOldRose dark:bg-app-light-paletteOldRose/[0.24] dark:text-app-light-paletteOldRose',
  },
  {
    id: HARNESS_CATEGORY_ID,
    accentClass: 'text-app-light-palettePeriwinkle dark:text-app-light-palettePeriwinkle',
    label: 'Harness racing',
    shortLabel: 'Harness',
    badgeClass:
      'bg-app-light-palettePeriwinkle/[0.38] text-app-light-primaryStrong dark:bg-app-light-palettePeriwinkle/[0.24] dark:text-app-light-palettePeriwinkle',
  },
  {
    id: HORSE_CATEGORY_ID,
    accentClass: 'text-app-light-palettePinkOrchid dark:text-app-light-palettePinkOrchid',
    label: 'Horse racing',
    shortLabel: 'Horse',
    badgeClass:
      'bg-app-light-palettePinkOrchid/[0.34] text-app-light-palettePinkOrchid dark:bg-app-light-palettePinkOrchid/[0.22] dark:text-app-light-palettePinkOrchid',
  },
]

export const ALL_CATEGORY_IDS = RACE_CATEGORY_OPTIONS.map(({ id }) => id)
export const FILTER_OPTIONS: Array<{
  id: FilterOptionId
  label: string
  shortLabel: string
}> = [{ id: ALL_FILTER_ID, label: 'All races', shortLabel: 'All Races' }, ...RACE_CATEGORY_OPTIONS]

export function isRaceCategoryId(value: string | undefined): value is RaceCategoryId {
  return ALL_CATEGORY_IDS.includes(value as RaceCategoryId)
}

export function getRaceCategoryMeta(categoryId: RaceCategoryId) {
  return RACE_CATEGORY_OPTIONS.find(({ id }) => id === categoryId) ?? RACE_CATEGORY_OPTIONS[0]
}
