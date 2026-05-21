<script setup lang="ts">
import { computed } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import type { ThemeMode } from '@/types/race'

const props = defineProps<{
  isFollowingSystem: boolean
  lastUpdatedLabel: string
  statusChipLabel?: 'Loading' | null
  theme: ThemeMode
}>()

const emit = defineEmits<{
  'toggle-theme': []
}>()

const highlightedUpdatedToken = computed(() => {
  const match = props.lastUpdatedLabel.match(/^(\d+[sm])(.*)$/i)

  if (!match) {
    return null
  }

  return {
    accent: match[1],
    suffix: match[2] || '',
  }
})
</script>

<template>
  <header
    class="theme-transition relative flex items-center justify-between gap-4 bg-app-light-navBg px-5 py-4 backdrop-blur-xl shadow-[0_18px_42px_-30px_rgba(124,77,255,0.18),0_10px_24px_-22px_rgba(15,23,42,0.16)] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-app-light-palettePinkOrchid after:content-[''] lg:flex-row lg:justify-between lg:gap-6 dark:bg-[rgb(43_43_71_/_0.84)] dark:shadow-[0_24px_48px_-32px_rgba(0,0,0,0.62),0_12px_28px_-24px_rgba(0,0,0,0.38)] dark:after:bg-white/10"
  >
    <div class="min-w-0 flex-1 space-y-1">
      <h1
        class="font-display text-3xl font-semibold tracking-tight text-app-light-primaryStrong dark:text-app-dark-text"
      >
        Next To Go Races
      </h1>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p class="max-w-xl text-mobile-value font-semibold text-app-light-body sm:text-base dark:text-app-dark-muted">
          Live race list with category filters and countdowns
        </p>
        <div class="inline-flex items-center gap-2 text-mobile-label font-semibold uppercase tracking-caps text-app-light-muted sm:text-xs dark:text-app-dark-muted">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-app-light-paletteThistle/46 px-2.5 py-1 text-app-light-muted dark:bg-app-dark-accentSoft dark:text-app-dark-muted"
          >
            <template v-if="statusChipLabel">
              <LoaderCircle class="h-3.5 w-3.5 animate-spin text-app-light-primaryStrong dark:text-app-dark-accent" />
              {{ statusChipLabel }}
            </template>
            <template v-else>
              Updated
              <template v-if="highlightedUpdatedToken">
                <span class="text-app-light-primaryStrong dark:text-app-dark-accent">
                  {{ highlightedUpdatedToken.accent }}
                </span>{{ highlightedUpdatedToken.suffix }}
              </template>
              <template v-else>
                {{ lastUpdatedLabel }}
              </template>
            </template>
          </span>
        </div>
      </div>
    </div>

    <ThemeToggle
      :theme="theme"
      @toggle="emit('toggle-theme')"
    />
  </header>
</template>
