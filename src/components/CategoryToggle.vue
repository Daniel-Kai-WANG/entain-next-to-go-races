<script setup lang="ts">
import { ChessKnight, CircleDot, ListFilter, PawPrint, Route } from '@lucide/vue'
import {
  ALL_FILTER_ID,
  FILTER_OPTIONS,
  GREYHOUND_CATEGORY_ID,
  HARNESS_CATEGORY_ID,
  HORSE_CATEGORY_ID,
} from '@/constants/raceCategories'
import type { CategoryFilterState, FilterOptionId, RaceCategoryId } from '@/types/race'

const props = defineProps<{
  filterState: CategoryFilterState
}>()

const emit = defineEmits<{
  toggle: [optionId: FilterOptionId]
}>()

function isActive(optionId: FilterOptionId) {
  if (optionId === ALL_FILTER_ID) {
    return props.filterState.mode === 'all'
  }

  return props.filterState.selectedCategoryIds.includes(optionId as RaceCategoryId)
}

function getIcon(optionId: FilterOptionId) {
  switch (optionId) {
    case ALL_FILTER_ID:
      return ListFilter
    case GREYHOUND_CATEGORY_ID:
      return PawPrint
    case HARNESS_CATEGORY_ID:
      return Route
    case HORSE_CATEGORY_ID:
      return ChessKnight
    default:
      return CircleDot
  }
}
</script>

<template>
  <section class="space-y-4">
    <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:overflow-visible">
      <button
        v-for="option in FILTER_OPTIONS"
        :key="option.id"
        type="button"
        class="theme-transition glass-surface inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary sm:w-auto sm:shrink-0 sm:justify-start sm:px-5 dark:focus-visible:outline-app-dark-accent"
        :class="
          isActive(option.id)
            ? 'border-app-light-primary bg-app-light-primary [background-image:none] text-white shadow-glass dark:border-app-dark-accent dark:bg-app-dark-accent dark:text-app-dark-bg'
            : 'text-app-light-primaryStrong hover:border-app-light-borderHover hover:bg-app-light-cardSelected dark:text-app-dark-text dark:hover:border-app-dark-accent/40 dark:hover:bg-app-dark-accentSoft'
        "
        :aria-pressed="isActive(option.id)"
        @click="emit('toggle', option.id)"
      >
        <component :is="getIcon(option.id)" class="h-4 w-4" />
        <span>{{ option.shortLabel }}</span>
      </button>
    </div>
  </section>
</template>
