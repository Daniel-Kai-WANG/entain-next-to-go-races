<script setup lang="ts">
import { CircleDot, Infinity, ListFilter, PawPrint, Route, Zap } from '@lucide/vue'
import { ALL_FILTER_ID, FILTER_OPTIONS } from '@/constants/raceCategories'
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
      return Infinity
    case '9daef0d7-bf3c-4f50-921d-8e818c60fe61':
      return PawPrint
    case '161d9be2-e909-4326-8c2c-35ed71fb460b':
      return Route
    case '4a2788f8-e825-4d36-9894-efd4baf1cfae':
      return Zap
    default:
      return CircleDot
  }
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold uppercase tracking-[0.2em] text-app-light-muted dark:text-app-dark-muted">
          Category Filters
        </h2>
        <p class="mt-1 text-sm text-app-light-body dark:text-app-dark-muted">
          All stays active unless you explicitly focus one or more race categories.
        </p>
      </div>

      <div class="hidden items-center gap-2 text-sm text-app-light-primaryStrong lg:flex dark:text-app-dark-accent">
        <ListFilter class="h-4 w-4" />
        <span>Sorted by time</span>
      </div>
    </div>

    <div class="flex snap-x gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      <button
        v-for="option in FILTER_OPTIONS"
        :key="option.id"
        type="button"
        class="theme-transition glass-surface inline-flex min-h-12 shrink-0 snap-start items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:focus-visible:outline-app-dark-accent"
        :class="
          isActive(option.id)
            ? 'border-app-light-primary bg-app-light-primary text-white shadow-glass dark:border-app-dark-accent dark:bg-app-dark-accent dark:text-app-dark-bg'
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
