<template>
  <aside class="sidebar" :class="{ collapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <div class="logo">
          <i class="pi pi-building"></i>
        </div>
        <Transition name="fade">
          <span v-if="!collapsed" class="logo-text">ERP</span>
        </Transition>
      </div>
      <button class="toggle-btn" @click="$emit('toggle')" :title="collapsed ? 'Menüyü Aç' : 'Menüyü Kapat'">
        <i :class="collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"></i>
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div v-for="section in menuSections" :key="section.title" class="nav-section">
        <Transition name="fade">
          <span v-if="!collapsed" class="nav-section-title">{{ section.title }}</span>
        </Transition>
        <ul class="nav-list">
          <li 
            v-for="item in section.items" 
            :key="item.to" 
            class="nav-item"
            :class="{ active: isActive(item.to) }"
          >
            <NuxtLink :to="item.to" class="nav-link" :title="item.label">
              <i :class="item.icon"></i>
              <Transition name="fade">
                <span v-if="!collapsed">{{ item.label }}</span>
              </Transition>
              <Badge 
                v-if="item.badge && !collapsed" 
                :value="item.badge" 
                :severity="item.badgeSeverity || 'danger'" 
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
    
    <!-- Footer -->
    <div class="sidebar-footer">
      <NuxtLink to="/settings" class="nav-link" title="Ayarlar">
        <i class="pi pi-cog"></i>
        <Transition name="fade">
          <span v-if="!collapsed">Ayarlar</span>
        </Transition>
      </NuxtLink>
      <div class="user-profile">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
        <Transition name="fade">
          <div v-if="!collapsed" class="user-info">
            <span class="user-name">Ahmet Yılmaz</span>
            <span class="user-role">Yönetici</span>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface MenuItem {
  label: string
  icon: string
  to: string
  badge?: number
  badgeSeverity?: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()

const route = useRoute()

const menuSections: MenuSection[] = [
  {
    title: 'Ana Menü',
    items: [
      { label: 'Dashboard', icon: 'pi pi-home', to: '/' },
      { label: 'Siparişler', icon: 'pi pi-shopping-cart', to: '/customers', badge: 12 },
      { label: 'Stok Yönetimi', icon: 'pi pi-box', to: '/customers' },
      { label: 'Müşteriler', icon: 'pi pi-users', to: '/customers' },
      { label: 'Login', icon: 'pi pi-sign-in', to: '/login' },
    ]
  },
  {
    title: 'Finans',
    items: [
      { label: 'Gelir/Gider', icon: 'pi pi-wallet', to: '/customers' },
      { label: 'Faturalar', icon: 'pi pi-file', to: '/customers' },
      { label: 'Raporlar', icon: 'pi pi-chart-bar', to: '/customers' }
    ]
  },
  {
    title: 'İK & Yönetim',
    items: [
      { label: 'Personel', icon: 'pi pi-id-card', to: '/customers' },
      { label: 'Tedarikçiler', icon: 'pi pi-truck', to: '/customers' }
    ]
  }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  min-height: 80px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1.5rem 0.75rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
}

.sidebar.collapsed .logo-wrapper {
  justify-content: center;
}

.logo {
  width: 44px;
  height: 44px;
  min-width: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  transition: all 0.3s ease;
}

.logo i {
  font-size: 1.5rem;
  color: white;
  display: inline-block;
}

.logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}

.logo-text {
  font-size: 1.625rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.toggle-btn {
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.toggle-btn i {
  font-size: 0.875rem;
  color: #1e293b;
  display: inline-block;
}

.toggle-btn:hover {
  background: #f8fafc;
  transform: translateY(-50%) scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.toggle-btn:active {
  transform: translateY(-50%) scale(0.9);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
  display: block;
  white-space: nowrap;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
  border-radius: 0 24px 24px 0;
  margin-right: 0.75rem;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.875rem;
  margin-right: 0.5rem;
  border-radius: 12px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
  transform: translateX(2px);
}

.sidebar.collapsed .nav-link:hover {
  transform: none;
}

.nav-item.active .nav-link {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
  color: white;
  border-left: 3px solid #3b82f6;
  font-weight: 600;
}

.sidebar.collapsed .nav-item.active .nav-link {
  border-left: none;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin: 0 0.5rem;
}

.nav-link i {
  font-size: 1.25rem;
  width: 24px;
  min-width: 24px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

/* Footer */
.sidebar-footer {
  padding: 1.25rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-footer .nav-link {
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  margin-right: 0.75rem;
}

.sidebar.collapsed .sidebar-footer .nav-link {
  justify-content: center;
  padding: 0.875rem;
  margin-right: 0.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  cursor: pointer;
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

.user-name {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.user-role {
  color: #94a3b8;
  font-size: 0.75rem;
  white-space: nowrap;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .logo-text,
  .nav-section-title,
  .nav-link span,
  .user-info {
    display: none !important;
  }

  .nav-link {
    justify-content: center;
  }

  .toggle-btn {
    display: none;
  }
}
</style>

