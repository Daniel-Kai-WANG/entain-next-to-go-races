<script setup lang="ts">
import { ListFilter } from '@lucide/vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import RaceCard from '@/components/RaceCard.vue'
import RaceDetailPanel from '@/components/RaceDetailPanel.vue'
import type { RaceSummary } from '@/types/race'

const props = defineProps<{
  error: string | null
  helperMessage?: string | null
  loading: boolean
  nowSeconds: number
  races: RaceSummary[]
}>()

const emit = defineEmits<{
  retry: []
}>()

const isDesktop = ref(false)
const selectedRaceId = ref<string | null>(null)
const expandedRaceId = ref<string | null>(null)
const desktopAnimationVersion = ref(0)

let desktopMediaQuery: MediaQueryList | undefined

const selectedRace = computed(
  () => props.races.find((race) => race.race_id === selectedRaceId.value) ?? null,
)
const showDesktopPanel = computed(() => isDesktop.value && selectedRace.value !== null)

function syncDesktopMode(matches = desktopMediaQuery?.matches ?? false) {
  isDesktop.value = matches

  if (matches) {
    expandedRaceId.value = null
  } else {
    selectedRaceId.value = null
  }
}

function handleDesktopModeChange(event: MediaQueryListEvent) {
  syncDesktopMode(event.matches)
}

function handleSelectRace(raceId: string) {
  selectedRaceId.value = raceId
}

function handleToggleExpanded(raceId: string) {
  expandedRaceId.value = expandedRaceId.value === raceId ? null : raceId
}

watch(
  () => props.races.map((race) => race.race_id).join(':'),
  (nextSignature) => {
    if (!nextSignature) {
      selectedRaceId.value = null
      expandedRaceId.value = null
      return
    }

    if (selectedRaceId.value && !props.races.some((race) => race.race_id === selectedRaceId.value)) {
      selectedRaceId.value = null
    }

    if (expandedRaceId.value && !props.races.some((race) => race.race_id === expandedRaceId.value)) {
      expandedRaceId.value = null
    }

    desktopAnimationVersion.value += 1
  },
  { immediate: true },
)

onMounted(() => {
  desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
  syncDesktopMode(desktopMediaQuery.matches)
  desktopMediaQuery.addEventListener('change', handleDesktopModeChange)
})

onUnmounted(() => {
  desktopMediaQuery?.removeEventListener('change', handleDesktopModeChange)
})
</script>

<template>
  <section class="space-y-5 px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-8">
    <div
      class="flex flex-col gap-3 border-b border-app-light-border/60 pb-5 lg:flex-row lg:items-center lg:justify-between dark:border-app-dark-border"
    >
      <div class="space-y-1">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-app-light-muted dark:text-app-dark-muted">
          Race Feed
        </p>
        <p v-if="helperMessage" class="text-sm text-app-light-body dark:text-app-dark-muted">
          {{ helperMessage }}
        </p>
      </div>

      <div class="inline-flex items-center gap-2 text-sm text-app-light-primaryStrong dark:text-app-dark-accent">
        <ListFilter class="h-4 w-4" />
        <span>Sort by Time</span>
      </div>
    </div>

    <ErrorState v-if="error && races.length === 0 && !loading" :message="error" @retry="emit('retry')" />
    <LoadingState v-else-if="loading && races.length === 0" />
    <EmptyState v-else-if="!loading && races.length === 0" />

    <div v-else class="relative">
      <div
        class="grid gap-6 theme-transition lg:transition-[grid-template-columns]"
        :class="showDesktopPanel ? 'lg:grid-cols-[minmax(0,0.78fr)_minmax(360px,1fr)]' : 'lg:grid-cols-1'"
      >
        <div class="space-y-4">
          <div
            v-for="(race, index) in races"
            :key="isDesktop ? `${race.race_id}-${desktopAnimationVersion}` : race.race_id"
            :class="isDesktop ? 'animate-card-enter opacity-0' : ''"
            :style="isDesktop ? { animationDelay: `${index * 70}ms` } : undefined"
          >
            <RaceCard
              :is-desktop="isDesktop"
              :is-expanded="expandedRaceId === race.race_id"
              :is-selected="selectedRaceId === race.race_id"
              :now-seconds="nowSeconds"
              :race="race"
              :use-scroll-reveal="!isDesktop"
              @select="handleSelectRace(race.race_id)"
              @toggle-expand="handleToggleExpanded(race.race_id)"
            />
          </div>
        </div>

        <Transition
          enter-active-class="theme-transition duration-500 ease-smooth"
          enter-from-class="translate-x-10 opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="theme-transition duration-300 ease-smooth"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="translate-x-6 opacity-0"
        >
          <RaceDetailPanel
            v-if="showDesktopPanel && selectedRace"
            :now-seconds="nowSeconds"
            :race="selectedRace"
            @close="selectedRaceId = null"
          />
        </Transition>
      </div>

      <Transition
        enter-active-class="theme-transition duration-300 ease-smooth"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="theme-transition duration-200 ease-smooth"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="loading && races.length > 0"
          class="absolute inset-0 z-10 flex items-center justify-center rounded-[32px] bg-app-light-overlay backdrop-blur-shimmer dark:bg-app-dark-overlay"
        >
          <div class="w-full max-w-md px-4">
            <LoadingState compact label="Refreshing visible races" />
          </div>
        </div>
      </Transition>

      <div
        v-if="error && races.length > 0"
        class="glass-surface mt-5 rounded-[24px] px-4 py-3 text-sm text-app-light-body dark:text-app-dark-muted"
      >
        Showing the latest cached races. {{ error }}
      </div>
    </div>
  </section>
</template>
