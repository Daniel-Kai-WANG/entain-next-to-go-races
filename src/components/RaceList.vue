<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import RaceCard from '@/components/RaceCard.vue'
import RaceDetailPanel from '@/components/RaceDetailPanel.vue'
import type { RaceSummary } from '@/types/race'

const props = defineProps<{
  blockingLoading?: boolean
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
  selectedRaceId.value = selectedRaceId.value === raceId ? null : raceId
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
  <section class="space-y-5 px-5 py-4 sm:px-7 lg:px-8">
    <div
      v-if="helperMessage"
      class="flex flex-col gap-3 pb-5 lg:flex-row lg:items-center lg:justify-between dark:border-app-dark-border"
    >
      <p class="text-sm text-app-light-body dark:text-app-dark-muted">
        {{ helperMessage }}
      </p>
    </div>

    <ErrorState v-if="error && races.length === 0 && !loading" :message="error" @retry="emit('retry')" />
    <LoadingState v-else-if="blockingLoading || (loading && races.length === 0)" />
    <EmptyState v-else-if="!loading && races.length === 0" />

    <div v-else class="relative">
      <div
        v-if="loading && races.length > 0 && !blockingLoading"
        class="mb-4 inline-flex items-center gap-2 rounded-full border border-app-light-bodyBorder bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-app-light-muted shadow-panel backdrop-blur-glass dark:border-app-dark-border dark:bg-white/5 dark:text-app-dark-muted"
      >
        <span class="h-2 w-2 rounded-full bg-app-light-primaryStrong dark:bg-app-dark-accent animate-pulse-soft" />
        Refreshing races
      </div>

      <div class="race-layout" :class="{ 'race-layout--panel-open': showDesktopPanel }">
        <div class="race-layout__list space-y-4">
          <div
            v-for="(race, index) in races"
            :key="race.race_id"
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

        <div class="race-layout__panel">
          <div class="race-layout__panel-inner">
            <Transition
              enter-active-class="transition-[opacity,transform] duration-500 ease-out"
              enter-from-class="translate-x-4 opacity-0"
              enter-to-class="translate-x-0 opacity-100"
              leave-active-class="transition-[opacity,transform] duration-300 ease-out"
              leave-from-class="translate-x-0 opacity-100"
              leave-to-class="translate-x-2 opacity-0"
            >
              <RaceDetailPanel
                v-if="showDesktopPanel && selectedRace"
                :now-seconds="nowSeconds"
                :race="selectedRace"
                @close="selectedRaceId = null"
              />
            </Transition>
          </div>
        </div>
      </div>

      <div
        v-if="error && races.length > 0"
        class="glass-surface light-flat-panel mt-5 rounded-3xl border-app-light-bodyBorder shadow-glass-deep px-4 py-3 text-sm text-app-light-body dark:text-app-dark-muted"
      >
        Showing the latest cached races. {{ error }}
      </div>
    </div>
  </section>
</template>
