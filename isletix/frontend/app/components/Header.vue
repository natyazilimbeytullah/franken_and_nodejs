<template>
  <header class="main-header">
    <div class="header-left">
      <button class="mobile-menu-btn" @click="$emit('toggle-sidebar')">
        <i class="pi pi-bars"></i>
      </button>
      <div class="breadcrumb">
        <NuxtLink to="/" class="breadcrumb-link">Ana Sayfa</NuxtLink>
        <template v-if="currentPage">
          <i class="pi pi-angle-right"></i>
          <span class="current">{{ currentPage }}</span>
        </template>
      </div>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    <div class="header-right">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input v-model="searchQuery" type="text" placeholder="Ara..." @keyup.enter="handleSearch" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const searchQuery = ref('')

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Kontrol Paneli',
    '/customers': 'Müşteriler',
    '/stock': 'Stok Yönetimi',
    '/orders': 'Siparişler',
    '/finance': 'Gelir/Gider',
    '/invoices': 'Faturalar',
    '/reports': 'Raporlar',
    '/employees': 'Personel',
    '/suppliers': 'Tedarikçiler',
    '/settings': 'Ayarlar'
  }
  return titles[route.path] || 'Dashboard'
})

const currentPage = computed(() => {
  if (route.path === '/') return null
  return pageTitle.value
})

const handleSearch = () => {
  if (searchQuery.value) {
    console.log('Searching:', searchQuery.value)
    // Arama işlemi burada yapılacak
  }
}
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.breadcrumb-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #3b82f6;
}

.breadcrumb .current {
  color: #3b82f6;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  min-width: 280px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box i {
  color: #94a3b8;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #1e293b;
  width: 100%;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.action-btn {
  position: relative;
  color: #64748b;
}

.action-btn:hover {
  color: #3b82f6;
}

.action-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.65rem;
  min-width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .main-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-right {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-box {
    width: 100%;
    min-width: unset;
  }
}
</style>

