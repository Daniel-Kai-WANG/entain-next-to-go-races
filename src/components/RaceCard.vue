<script setup lang="ts">
import {
  ChevronDown,
  ChevronUp,
  PanelRightClose,
  PanelRightOpen,
  PawPrint,
  Route,
  Sparkles,
  Zap,
} from '@lucide/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import { getRaceCategoryMeta } from '@/constants/raceCategories'
import { classifyCountdownState, formatDistance, formatRaceStartTime } from '@/utils/time'
import type { RaceSummary } from '@/types/race'

const props = withDefaults(
  defineProps<{
    isDesktop?: boolean
    isExpanded?: boolean
    isSelected?: boolean
    nowSeconds: number
    race: RaceSummary
    useScrollReveal?: boolean
  }>(),
  {
    isDesktop: false,
    isExpanded: false,
    isSelected: false,
    useScrollReveal: false,
  },
)

const emit = defineEmits<{
  select: []
  'toggle-expand': []
}>()

const rootElement = ref<HTMLElement | null>(null)
const hasEnteredViewport = ref(!props.useScrollReveal)
let observer: IntersectionObserver | undefined

const category = getRaceCategoryMeta(props.race.category_id)
const countdownState = computed(() =>
  classifyCountdownState(props.race.advertised_start.seconds, props.nowSeconds),
)
const distanceLabel = computed(() => formatDistance(props.race.distance, props.race.distance_unit))
const summaryLabel = computed(() => {
  const details = [`Race ${props.race.race_number}`]

  if (distanceLabel.value) {
    details.push(distanceLabel.value)
  }

  return details.join(' • ')
})

const statusBadge = computed(() => {
  switch (countdownState.value) {
    case 'critical-live':
    case 'urgent':
      return 'Closing Soon'
    case 'warning':
      return 'Approaching'
    default:
      return null
  }
})

const iconClassName = computed(() => {
  switch (props.race.category_id) {
    case '9daef0d7-bf3c-4f50-921d-8e818c60fe61':
      return 'bg-red-50 text-app-light-danger dark:bg-red-400/10 dark:text-red-200'
    case '161d9be2-e909-4326-8c2c-35ed71fb460b':
      return 'bg-blue-50 text-blue-500 dark:bg-blue-400/10 dark:text-blue-200'
    default:
      return 'bg-app-light-soft/65 text-app-light-primaryStrong dark:bg-app-dark-surfaceSoft dark:text-app-dark-accent'
  }
})

const cardClassName = computed(() => {
  if (props.isSelected) {
    return 'border-app-light-primary shadow-glass-strong dark:border-app-dark-accent dark:bg-app-dark-accentSoft'
  }

  return 'border-app-light-bodyBorder hover:border-app-light-borderHover hover:shadow-panel-hover dark:border-app-dark-border dark:hover:border-app-dark-accent/35'
})

function getCategoryIcon() {
  switch (props.race.category_id) {
    case '9daef0d7-bf3c-4f50-921d-8e818c60fe61':
      return PawPrint
    case '161d9be2-e909-4326-8c2c-35ed71fb460b':
      return Route
    case '4a2788f8-e825-4d36-9894-efd4baf1cfae':
      return Zap
    default:
      return Sparkles
  }
}

function handleClick() {
  if (props.isDesktop) {
    emit('select')
    return
  }

  emit('toggle-expand')
}

onMounted(() => {
  if (!props.useScrollReveal || !rootElement.value) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        hasEnteredViewport.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.2 },
  )

  observer.observe(rootElement.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <button
    ref="rootElement"
    type="button"
    class="glass-panel light-flat-panel theme-transition w-full rounded-[30px] p-5 text-left shadow-glass-deep"
    :class="[
      cardClassName,
      useScrollReveal && !hasEnteredViewport
        ? 'translate-y-4 opacity-0'
        : 'translate-y-0 opacity-100',
    ]"
    :aria-expanded="isDesktop ? isSelected : isExpanded"
    @click="handleClick"
  >
    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      <div class="flex items-start gap-4">
        <div
          class="theme-transition flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px]"
          :class="iconClassName"
        >
          <component :is="getCategoryIcon()" class="h-7 w-7" />
        </div>

        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-if="statusBadge"
              class="rounded-full bg-app-light-danger px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white dark:bg-red-400 dark:text-app-dark-bg"
            >
              {{ statusBadge }}
            </span>
            <span class="text-sm text-app-light-body dark:text-app-dark-muted">
              {{ category.shortLabel }}
            </span>
          </div>

          <h3 class="mt-2 text-3xl font-semibold text-app-light-text dark:text-app-dark-text">
            {{ race.meeting_name }}
          </h3>
          <p class="mt-1 text-lg text-app-light-body dark:text-app-dark-muted">
            {{ summaryLabel }}
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 sm:gap-4 xl:justify-end">
        <CountdownTimer :now-seconds="nowSeconds" :start-seconds="race.advertised_start.seconds" />
        <span
          class="icon-action-button"
        >
          <PanelRightClose v-if="isDesktop && isSelected" class="h-5 w-5" />
          <PanelRightOpen v-else-if="isDesktop" class="h-5 w-5" />
          <ChevronUp v-else-if="isExpanded" class="h-5 w-5" />
          <ChevronDown v-else class="h-5 w-5" />
        </span>
      </div>
    </div>

    <div
      v-if="!isDesktop || isExpanded"
      class="theme-transition grid"
      :class="isDesktop ? 'mt-0 grid-rows-[0fr] opacity-0' : isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100 translate-y-0' : 'mt-0 grid-rows-[0fr] opacity-0 -translate-y-1'"
    >
      <div class="overflow-hidden">
        <div
          class="rounded-[24px] border border-app-light-bodyBorder bg-[#FFFBFA] p-4 dark:border-app-dark-border dark:bg-white/5"
        >
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <p class="text-xs uppercase tracking-[0.16em] text-app-light-muted dark:text-app-dark-muted">
              Advertised Start
            </p>
            <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
              {{ formatRaceStartTime(race.advertised_start.seconds) }}
            </p>
          </div>
          <div v-if="race.venue_name">
            <p class="text-xs uppercase tracking-[0.16em] text-app-light-muted dark:text-app-dark-muted">
              Venue
            </p>
            <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
              {{ race.venue_name }}
            </p>
          </div>
          <div v-if="distanceLabel">
            <p class="text-xs uppercase tracking-[0.16em] text-app-light-muted dark:text-app-dark-muted">
              Distance
            </p>
            <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
              {{ distanceLabel }}
            </p>
          </div>
          <div v-if="race.weather || race.track_condition">
            <p class="text-xs uppercase tracking-[0.16em] text-app-light-muted dark:text-app-dark-muted">
              Conditions
            </p>
            <p class="mt-1 text-sm font-semibold text-app-light-text dark:text-app-dark-text">
              {{ race.weather ?? 'Pending' }}
              <span v-if="race.track_condition"> · {{ race.track_condition }}</span>
            </p>
          </div>
        </div>

        <p
          v-if="race.race_comment"
          class="mt-4 text-sm leading-6 text-app-light-body dark:text-app-dark-muted"
        >
          {{ race.race_comment }}
        </p>
        </div>
      </div>
    </div>
  </button>
</template>
