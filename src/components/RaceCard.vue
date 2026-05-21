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
import { getRaceCategoryMeta } from '@/constants/raceCategories'
import { formatDistance, formatRaceStartTime } from '@/utils/time'
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
const distanceLabel = computed(() => formatDistance(props.race.distance, props.race.distance_unit))
const summaryLabel = computed(() => {
  const details = [`Race ${props.race.race_number}`]

  if (distanceLabel.value) {
    details.push(distanceLabel.value)
  }

  return details.join(' • ')
})

const iconClassName = computed(() => {
  switch (props.race.category_id) {
    case '9daef0d7-bf3c-4f50-921d-8e818c60fe61':
      return 'bg-app-light-paletteOldRose/30 text-app-light-paletteOldRose dark:bg-app-light-paletteOldRose/22 dark:text-app-light-paletteOldRose'
    case '161d9be2-e909-4326-8c2c-35ed71fb460b':
      return 'bg-app-light-primaryStrong/30 text-app-light-primaryStrong dark:bg-app-light-palettePeriwinkle/24 dark:text-app-light-palettePeriwinkle'
    default:
      return 'bg-app-light-palettePinkOrchid/30 text-app-light-palettePinkOrchid dark:bg-app-light-palettePinkOrchid/22 dark:text-app-light-palettePinkOrchid'
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
      return ChessKnight
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
      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div class="flex items-start gap-4">
          <div
            class="theme-transition flex h-16 w-16 shrink-0 items-center justify-center rounded-tile"
            :class="iconClassName"
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
            :class="iconClassName"
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
      class="grid transition-[grid-template-rows,opacity,margin,transform] duration-700 ease-smooth"
      :class="isDesktop ? 'mt-0 grid-rows-[0fr] opacity-0' : isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100 translate-y-0' : 'mt-0 grid-rows-[0fr] opacity-0 -translate-y-1'"
    >
      <div class="overflow-hidden">
        <div
          class="theme-transition rounded-3xl border border-app-light-bodyBorder bg-[#FFFBFA] p-4 duration-700 ease-smooth dark:border-app-dark-border dark:bg-white/5"
          :class="!isDesktop && isExpanded ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.985] opacity-0'"
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
