<template>
  <header class="main-header">
    <div class="header-left">
      <button class="mobile-menu-btn" @click="$emit('toggle-sidebar')">
        <i class="pi pi-bars"></i>
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    <div class="header-right">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input v-model="searchQuery" type="text" placeholder="Ara..." @keyup.enter="handleSearch" />
      </div>
      
      <div class="user-profile" @click="toggleUserMenu" ref="userProfileRef">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
        <Transition name="fade">
          <div v-if="!collapsed" class="user-info">
            <span class="user-name">Ahmet Yılmaz</span>
            <span class="user-role">Yönetici</span>
          </div>
        </Transition>
        <Transition name="fade">
          <i v-if="!collapsed" class="pi pi-chevron-up" :class="{ 'rotate-180': !userMenuVisible }"></i>
        </Transition>
      </div>
      <Menu ref="userMenu" :model="userMenuItems" :popup="true" class="user-menu" />
      
    </div>
  </header>
</template>

<script setup lang="ts">

const props = defineProps<{
  collapsed: boolean
}>()

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


const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event)
  userMenuVisible.value = !userMenuVisible.value
}



// User Menu
const userMenu = ref()
const userProfileRef = ref()
const userMenuVisible = ref(false)
const router = useRouter()

const userMenuItems = ref([
  {
    label: 'Profil',
    icon: 'pi pi-user',
    command: () => {
      router.push('/profile')
    }
  },
  {
    label: 'Hesap Ayarları',
    icon: 'pi pi-cog',
    command: () => {
      router.push('/settings')
    }
  },
  {
    separator: true
  },
  {
    label: 'Çıkış Yap',
    icon: 'pi pi-sign-out',
    command: () => {
      // Çıkış işlemi burada yapılacak
      console.log('Çıkış yapılıyor...')
      router.push('/login')
    }
  }
])

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


.user-profile {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
}

.user-profile i.pi-chevron-up {
  margin-left: auto;
  font-size: 0.75rem;
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.user-profile i.pi-chevron-up.rotate-180 {
  transform: rotate(180deg);
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar.collapsed .user-profile {
  justify-content: center;
  padding: 0.5rem;
}

.user-profile img {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.user-profile:hover img {
  border-color: rgba(59, 130, 246, 0.5);
  transform: scale(1.05);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

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

