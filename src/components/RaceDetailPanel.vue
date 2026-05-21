<script setup lang="ts">
import {
  CalendarClock,
  CloudSun,
  MapPin,
  MessageSquareText,
  Ruler,
  X,
} from '@lucide/vue'
import { computed } from 'vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import { getRaceCategoryMeta } from '@/constants/raceCategories'
import { formatDistance, formatRaceStartTime } from '@/utils/time'
import type { RaceSummary } from '@/types/race'

const props = defineProps<{
  nowSeconds: number
  race: RaceSummary
}>()

const emit = defineEmits<{
  close: []
}>()

const category = computed(() => getRaceCategoryMeta(props.race.category_id))
</script>

<template>
  <aside class="glass-card-strong light-flat-panel theme-transition overflow-hidden rounded-4xl border-app-light-bodyBorder shadow-glass-strong-deep p-6 lg:sticky lg:top-8">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-3">
        <span
          class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-caps-wide"
          :class="category.badgeClass"
        >
          {{ category.shortLabel }}
        </span>
        <div>
          <p class="text-sm font-medium uppercase tracking-caps-wide text-app-light-muted dark:text-app-dark-muted">
            {{ race.meeting_name }} · Race {{ race.race_number }}
          </p>
          <h2 class="mt-2 text-3xl font-semibold text-app-light-text dark:text-app-dark-text">
            {{ race.race_name }}
          </h2>
        </div>
      </div>

      <button
        type="button"
        class="icon-action-button icon-action-button--raised hidden lg:inline-flex"
        aria-label="Close detail panel"
        @click="emit('close')"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <div class="mt-6 flex justify-start px-0 py-0">
      <CountdownTimer align="left" :now-seconds="nowSeconds" :start-seconds="race.advertised_start.seconds" />
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <div
        class="panel-info-card"
      >
        <CalendarClock class="h-5 w-5 text-app-light-primaryStrong dark:text-app-dark-accent" />
        <div>
          <p class="text-xs uppercase tracking-caps text-app-light-muted dark:text-app-dark-muted">
            Starts at
          </p>
          <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
            {{ formatRaceStartTime(race.advertised_start.seconds) }}
          </p>
        </div>
      </div>

      <div
        class="panel-info-card"
      >
        <MapPin class="h-5 w-5 text-app-light-primaryStrong dark:text-app-dark-accent" />
        <div>
          <p class="text-xs uppercase tracking-caps text-app-light-muted dark:text-app-dark-muted">
            Venue
          </p>
          <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
            {{ race.venue_name ?? 'Venue unknown' }}
            <span v-if="race.venue_country" class="font-normal text-app-light-body dark:text-app-dark-muted">
              · {{ race.venue_country }}
            </span>
          </p>
        </div>
      </div>

      <div
        v-if="formatDistance(race.distance, race.distance_unit)"
        class="panel-info-card"
      >
        <Ruler class="h-5 w-5 text-app-light-primaryStrong dark:text-app-dark-accent" />
        <div>
          <p class="text-xs uppercase tracking-caps text-app-light-muted dark:text-app-dark-muted">
            Distance
          </p>
          <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
            {{ formatDistance(race.distance, race.distance_unit) }}
          </p>
        </div>
      </div>

      <div
        v-if="race.weather || race.track_condition"
        class="panel-info-card"
      >
        <CloudSun class="h-5 w-5 text-app-light-primaryStrong dark:text-app-dark-accent" />
        <div>
          <p class="text-xs uppercase tracking-caps text-app-light-muted dark:text-app-dark-muted">
            Conditions
          </p>
          <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
            {{ race.weather ?? 'Weather unknown' }}
            <span v-if="race.track_condition" class="font-normal text-app-light-body dark:text-app-dark-muted">
              · {{ race.track_condition }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="race.race_comment"
      class="theme-transition mt-6 rounded-3xl border border-app-light-bodyBorder bg-app-light-flatPanel p-5 dark:border-app-dark-border dark:bg-white/5"
    >
      <div class="flex items-center gap-2 text-app-light-primaryStrong dark:text-app-dark-accent">
        <MessageSquareText class="h-5 w-5" />
        <h3 class="text-sm font-semibold uppercase tracking-caps">Race Comment</h3>
      </div>
      <p class="mt-3 text-sm leading-7 text-app-light-body dark:text-app-dark-muted">
        {{ race.race_comment }}
      </p>
    </div>
  </aside>
</template>
