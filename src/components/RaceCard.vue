<script setup lang="ts">
import {
  ChessKnight,
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  PawPrint,
  Route,
  Sparkles,
} from '@lucide/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import {
  getRaceCategoryMeta,
  GREYHOUND_CATEGORY_ID,
  HARNESS_CATEGORY_ID,
  HORSE_CATEGORY_ID,
} from '@/constants/raceCategories'
import { formatConditionsLabel, formatDistance, formatRaceStartTime } from '@/utils/time'
import type { RaceCategoryId, RaceSummary } from '@/types/race'

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

const category = computed(() => getRaceCategoryMeta(props.race.category_id))
const distanceLabel = computed(() => formatDistance(props.race.distance, props.race.distance_unit))
const conditionsLabel = computed(() =>
  formatConditionsLabel(props.race.weather, props.race.track_condition),
)
const summaryLabel = computed(() => {
  const details = [`Race ${props.race.race_number}`]

  if (distanceLabel.value) {
    details.push(distanceLabel.value)
  }

  return details.join(' • ')
})

const cardClassName = computed(() => {
  if (props.isSelected) {
    return 'border-app-light-primary bg-app-light-cardSelected shadow-glass-strong dark:border-app-dark-accent dark:bg-app-dark-accentSoft'
  }

  return 'border-app-light-bodyBorder hover:border-app-light-borderHover hover:shadow-panel-hover dark:border-app-dark-border dark:hover:border-app-dark-accent/35'
})

const categoryIconMap: Record<RaceCategoryId, typeof PawPrint> = {
  [GREYHOUND_CATEGORY_ID]: PawPrint,
  [HARNESS_CATEGORY_ID]: Route,
  [HORSE_CATEGORY_ID]: ChessKnight,
}

const getCategoryIcon = () => {
  switch (props.race.category_id) {
    case GREYHOUND_CATEGORY_ID:
    case HARNESS_CATEGORY_ID:
    case HORSE_CATEGORY_ID:
      return categoryIconMap[props.race.category_id]
    default:
      return Sparkles
  }
}

const handleClick = () => {
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
    class="glass-panel light-flat-panel theme-transition w-full rounded-card p-5 text-left shadow-glass-deep"
    :class="[
      cardClassName,
      useScrollReveal && !hasEnteredViewport
        ? 'translate-y-4 opacity-0'
        : 'translate-y-0 opacity-100',
    ]"
    :aria-expanded="isDesktop ? isSelected : isExpanded"
    @click="handleClick"
  >
    <template v-if="isDesktop">
      <div class="grid gap-4 xl:grid-cols-race-card-desktop xl:items-center">
        <div class="flex items-start gap-4">
          <div
            class="theme-transition flex h-16 w-16 shrink-0 items-center justify-center rounded-tile"
            :class="category.iconClass"
          >
            <component :is="getCategoryIcon()" class="h-7 w-7" />
          </div>

          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
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
          <span class="icon-action-button theme-transition">
            <PanelRightClose v-if="isSelected" class="h-5 w-5" />
            <PanelRightOpen v-else class="h-5 w-5" />
          </span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="space-y-5">
        <div class="flex items-start justify-between gap-3">
          <span
            class="theme-transition inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            :class="category.iconClass"
          >
            <component :is="getCategoryIcon()" class="h-4 w-4" />
            {{ category.shortLabel }}
          </span>

          <CountdownTimer :now-seconds="nowSeconds" :start-seconds="race.advertised_start.seconds" />
        </div>

        <h3 class="text-3xl font-semibold text-app-light-text dark:text-app-dark-text">
          {{ race.meeting_name }}
        </h3>

        <div class="border-t border-app-light-bodyBorder/45 dark:border-app-dark-border" />

        <div class="flex items-center justify-between gap-4">
          <p class="min-w-0 text-lg text-app-light-body dark:text-app-dark-muted">
            {{ summaryLabel }}
          </p>

          <span
            class="icon-action-button theme-transition shrink-0"
            :class="isExpanded ? 'rotate-180' : 'rotate-0'"
          >
            <ChevronDown class="h-5 w-5" />
          </span>
        </div>
      </div>
    </template>

    <div
      v-if="!isDesktop || isExpanded"
      class="grid transition-panel-expand duration-700 ease-smooth"
      :class="isDesktop ? 'mt-0 grid-rows-collapsed opacity-0' : isExpanded ? 'mt-5 grid-rows-expanded opacity-100 translate-y-0' : 'mt-0 grid-rows-collapsed opacity-0 -translate-y-1'"
    >
      <div class="overflow-hidden">
        <div
          class="theme-transition rounded-3xl border border-app-light-bodyBorder bg-app-light-flatPanel p-4 duration-700 ease-smooth dark:border-app-dark-border dark:bg-white/5"
          :class="!isDesktop && isExpanded ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-card-collapsed opacity-0'"
        >
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <p class="text-mobile-label uppercase tracking-caps text-app-light-muted sm:text-xs dark:text-app-dark-muted">
              Advertised Start
            </p>
            <p class="mt-1 text-mobile-value font-semibold text-app-light-text sm:text-sm dark:text-app-dark-text">
              {{ formatRaceStartTime(race.advertised_start.seconds) }}
            </p>
          </div>
          <div v-if="race.venue_name">
            <p class="text-mobile-label uppercase tracking-caps text-app-light-muted sm:text-xs dark:text-app-dark-muted">
              Venue
            </p>
            <p class="mt-1 text-mobile-value font-semibold text-app-light-text sm:text-sm dark:text-app-dark-text">
              {{ race.venue_name }}
            </p>
          </div>
          <div v-if="distanceLabel">
            <p class="text-mobile-label uppercase tracking-caps text-app-light-muted sm:text-xs dark:text-app-dark-muted">
              Distance
            </p>
            <p class="mt-1 text-mobile-value font-semibold text-app-light-text sm:text-sm dark:text-app-dark-text">
              {{ distanceLabel }}
            </p>
          </div>
          <div>
            <p class="text-mobile-label uppercase tracking-caps text-app-light-muted sm:text-xs dark:text-app-dark-muted">
              Conditions
            </p>
            <p class="mt-1 text-mobile-value font-semibold text-app-light-text sm:text-sm dark:text-app-dark-text">
              {{ conditionsLabel }}
            </p>
          </div>
        </div>

        <div
          v-if="race.race_comment"
          class="mt-4"
        >
          <p class="text-mobile-label uppercase tracking-caps text-app-light-muted sm:text-xs sm:mb-3 dark:text-app-dark-muted">
            Race Comment
          </p>
          <p class="mt-1 text-mobile-value font-semibold leading-6 text-app-light-text sm:text-sm sm:mt-0 dark:text-app-dark-text">
            {{ race.race_comment }}
          </p>
        </div>
        </div>
      </div>
    </div>
  </button>
</template>
