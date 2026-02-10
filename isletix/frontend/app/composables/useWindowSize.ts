/**
 * Ekran boyutunu algılayan composable
 * Responsive tasarım için breakpoint'ler sağlar
 */
export const useWindowSize = () => {
  const width = ref(0)
  
  const isMobile = computed(() => width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 1280)
  const isDesktop = computed(() => width.value >= 1280)
  const isLargeDesktop = computed(() => width.value >= 1440)

  const updateWidth = () => {
    if (import.meta.client) {
      width.value = window.innerWidth
    }
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  }
}

