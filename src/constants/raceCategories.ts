import type { FilterOptionId, RaceCategoryId } from '@/types/race'

export const ALL_FILTER_ID = 'all' as const
export const CATEGORY_COUNT = 3

export const RACE_CATEGORY_OPTIONS: Array<{
  id: RaceCategoryId
  label: string
  shortLabel: string
  badgeClass: string
}> = [
  {
    id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
    label: 'Greyhound racing',
    shortLabel: 'Greyhound',
    badgeClass:
      'bg-app-light-soft text-app-light-primary dark:bg-app-dark-surface/90 dark:text-app-dark-accent',
  },
  {
    id: '161d9be2-e909-4326-8c2c-35ed71fb460b',
    label: 'Harness racing',
    shortLabel: 'Harness',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
  },
  {
    id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
    label: 'Horse racing',
    shortLabel: 'Horse',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
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
