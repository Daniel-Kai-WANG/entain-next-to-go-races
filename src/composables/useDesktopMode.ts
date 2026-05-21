import { onMounted, onUnmounted, ref } from 'vue'
import { DESKTOP_MEDIA_QUERY } from '@/constants/app'

export function useDesktopMode() {
  const isDesktop = ref(false)
  let desktopMediaQuery: MediaQueryList | undefined

  const syncDesktopMode = (matches = desktopMediaQuery?.matches ?? false) => {
    isDesktop.value = matches
  }

  const handleDesktopModeChange = (event: MediaQueryListEvent) => {
    syncDesktopMode(event.matches)
  }

  onMounted(() => {
    desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    syncDesktopMode(desktopMediaQuery.matches)
    desktopMediaQuery.addEventListener('change', handleDesktopModeChange)
  })

  onUnmounted(() => {
    desktopMediaQuery?.removeEventListener('change', handleDesktopModeChange)
  })

  return {
    isDesktop,
  }
}
