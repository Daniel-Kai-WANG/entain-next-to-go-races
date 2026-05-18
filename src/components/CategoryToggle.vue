<script setup lang="ts">
import { RACE_CATEGORY_OPTIONS } from '@/constants/raceCategories'
import type { RaceCategoryId } from '@/types/race'

defineProps<{
  selectedCategories: RaceCategoryId[]
}>()

const emit = defineEmits<{
  toggle: [categoryId: RaceCategoryId]
}>()
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
        v-for="category in RACE_CATEGORY_OPTIONS"
        :key="category.id"
        type="button"
        class="inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-light-primary dark:focus-visible:outline-app-dark-accent"
        :class="
          selectedCategories.includes(category.id)
            ? 'border-app-light-primary/30 bg-app-light-soft text-app-light-text shadow-panel dark:border-app-dark-accent/40 dark:bg-app-dark-surface/85 dark:text-app-dark-text'
            : 'border-app-light-border/70 bg-white/55 text-app-light-body hover:border-app-light-primary/25 hover:bg-white/70 dark:border-app-dark-border dark:bg-app-dark-card/65 dark:text-app-dark-muted dark:hover:border-app-dark-accent/35 dark:hover:bg-app-dark-elevated/70'
        "
        :aria-pressed="selectedCategories.includes(category.id)"
        @click="emit('toggle', category.id)"
      >
        {{ category.shortLabel }}
      </button>
    </div>
  </div>
</template>
