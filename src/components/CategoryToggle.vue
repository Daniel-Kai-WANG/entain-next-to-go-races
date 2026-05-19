<script setup lang="ts">
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
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2
          class="text-sm font-semibold uppercase tracking-[0.2em] text-app-light-muted dark:text-app-dark-muted"
        >
          Categories
        </h2>
        <p class="mt-1 text-sm text-app-light-body dark:text-app-dark-muted">
          Toggle race types without losing the five-upcoming-races rule.
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="option in FILTER_OPTIONS"
        :key="option.id"
        type="button"
        class="inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:focus-visible:outline-app-dark-accent"
        :class="
          isActive(option.id)
            ? 'border-app-light-primary/30 bg-app-light-soft text-app-light-text shadow-panel dark:border-app-dark-accent/40 dark:bg-app-dark-surface/85 dark:text-app-dark-text'
            : 'border-app-light-border/70 bg-white/55 text-app-light-body hover:border-app-light-primary/25 hover:bg-white/70 dark:border-app-dark-border dark:bg-app-dark-card/65 dark:text-app-dark-muted dark:hover:border-app-dark-accent/35 dark:hover:bg-app-dark-elevated/70'
        "
        :aria-pressed="isActive(option.id)"
        @click="emit('toggle', option.id)"
      >
        {{ option.shortLabel }}
      </button>
    </div>
  </div>
</template>
