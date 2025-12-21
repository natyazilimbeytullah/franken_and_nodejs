<template>
  <div id="app-wrapper">
    <!-- Loading Screen - Her zaman başta render edilir -->
    <AppLoader v-show="!isAppReady" />
    
    <!-- Main Content - CSS ile kontrol edilir -->
    <div class="main-wrapper" :class="{ 'is-ready': isAppReady }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
// Client-side only ref - SSR'da her zaman false
const isAppReady = ref(false)

onMounted(() => {
  // Client-side'da hızlı bir şekilde başlat
  const initApp = () => {
    // Çok kısa bir bekleme - sadece CSS'lerin parse edilmesi için
    setTimeout(() => {
      isAppReady.value = true
      document.body.classList.add('app-loaded')
    }, 300)
  }
  
  // Hemen başlat
  initApp()
  
  // Fallback: maksimum 600ms
  setTimeout(() => {
    isAppReady.value = true
    document.body.classList.add('app-loaded')
  }, 600)
})
</script>

<style>
@import 'primeicons/primeicons.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Critical inline CSS - Load immediately */
html {
  scroll-behavior: smooth;
  background-color: #f1f5f9 !important;
}

body {
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  background-color: var(--surface-ground, #f1f5f9);
  color: var(--text-color, #1e293b);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  overflow: hidden !important; /* Prevent scroll during loading */
}

body.app-loaded {
  overflow: visible !important;
  overflow-x: hidden !important;
}

/* PrimeIcons font fix */
.pi {
  font-family: 'primeicons' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
}

/* Prevent FOUC */
#__nuxt,
#app-wrapper {
  min-height: 100vh;
  background-color: #f1f5f9;
}

/* Main wrapper - CRITICAL: başlangıçta kesinlikle gizli */
.main-wrapper {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.main-wrapper.is-ready {
  position: relative !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  transition: opacity 0.3s ease-in;
}
</style>
