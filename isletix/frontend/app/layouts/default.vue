<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Sidebar Component -->
    <Sidebar 
      :collapsed="sidebarCollapsed" 
      @toggle="toggleSidebar"
    />
    
    <div class="layout-content">
      <Header @toggle-sidebar="toggleSidebar" />
      
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/Sidebar.vue'
import Header from '~/components/Header.vue'
import { useJwtAuth } from '~/composables/useJwtAuth'

const { requireAuth } = useJwtAuth()

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// LocalStorage'dan sidebar durumunu al ve auth kontrolü yap
onMounted(() => {
  // Auth kontrolü - token yoksa login'e yönlendir
  //requireAuth()

  if (import.meta.client) {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      sidebarCollapsed.value = saved === 'true'
    }
  }
})

// Sidebar durumunu kaydet
watch(sidebarCollapsed, (value) => {
  localStorage.setItem('sidebar-collapsed', String(value))
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f1f5f9;
  position: relative;
}

.layout-content {
  flex: 1;
  margin-left: 230px;
  max-width: calc(100vw - 230px);
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.app-layout.sidebar-collapsed .layout-content {
  margin-left: 80px;
}

.main-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .layout-content {
    margin-left: 80px;
    max-width: calc(100vw - 80px);
    width: calc(100% - 80px);
    overflow-x: hidden;
  }

  .main-content {
    padding: 1rem;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
}
</style>

