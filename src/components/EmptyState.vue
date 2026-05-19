<script setup lang="ts">
import { Inbox } from '@lucide/vue'
</script>

<template>
  <div class="glass-card-strong rounded-[28px] px-6 py-8 text-left">
    <span
      class="flex h-14 w-14 items-center justify-center rounded-2xl bg-app-light-soft/70 text-app-light-primaryStrong dark:bg-app-dark-surfaceSoft dark:text-app-dark-accent"
    >
      <Inbox class="h-6 w-6" />
    </span>
    <h2 class="mt-5 text-xl font-semibold text-app-light-text dark:text-app-dark-text">
      No races are available right now
    </h2>
    <p class="mt-2 max-w-xl text-sm leading-6 text-app-light-body dark:text-app-dark-muted">
      There are no valid races to show for the current moment or filter combination. Please try
      again shortly.
    </p>
  </div>
</template>
