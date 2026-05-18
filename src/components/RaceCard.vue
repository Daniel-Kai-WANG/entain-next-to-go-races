<script setup lang="ts">
import CountdownTimer from '@/components/CountdownTimer.vue'
import { getRaceCategoryMeta } from '@/constants/raceCategories'
import type { RaceSummary } from '@/types/race'

const props = defineProps<{
  nowSeconds: number
  race: RaceSummary
}>()

const category = getRaceCategoryMeta(props.race.category_id)
</script>

<template>
  <article
    class="rounded-[28px] border border-app-light-border/70 bg-app-light-card/75 p-5 shadow-glass backdrop-blur-glass transition hover:-translate-y-0.5 hover:border-app-light-primary/30 sm:p-6 dark:border-app-dark-border dark:bg-app-dark-card/72 dark:shadow-glass-dark dark:hover:border-app-dark-accent/35"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-3">
        <span
          class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
          :class="category.badgeClass"
        >
          {{ category.shortLabel }}
        </span>
        <div class="space-y-2">
          <p
            class="text-sm font-medium uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted"
          >
            {{ race.meeting_name }}
          </p>
          <div class="flex items-end gap-3">
            <h3 class="text-2xl font-semibold text-app-light-text dark:text-app-dark-text">
              Race {{ race.race_number }}
            </h3>
          </div>
        </div>
      </div>

      <CountdownTimer :now-seconds="nowSeconds" :start-seconds="race.advertised_start.seconds" />
    </div>
  </article>
</template>
