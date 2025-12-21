import { FilterMatchMode } from '@primevue/core/api'

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  city: string
  segment: string
  status: string
  totalOrders: number
  totalSpent: number
  createdAt: string
  initials: string
  avatarColor: string
}

/**
 * Müşteri yönetimi için composable
 * Lazy loading, filtreleme, sıralama ve CRUD işlemleri
 */
export const useCustomers = () => {
  // State
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const totalRecords = ref(0)
  const selectedCustomers = ref<Customer[]>([])
  const selectedCustomer = ref<Customer | null>(null)
  const deleteDialog = ref(false)
  const detailDialog = ref(false)
  const viewMode = ref('list')

  // Lazy loading parametreleri
  const lazyParams = ref({
    first: 0,
    rows: 10,
    page: 1,
    sortField: 'name',
    sortOrder: 1,
    filters: {} as any
  })

  // Filtreler
  const filters = ref({
    search: '',
    status: null as string | null,
    city: null as string | null,
    segment: null as string | null,
    dateRange: null
  })

  const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    city: { value: null, matchMode: FilterMatchMode.EQUALS },
    segment: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
  })

  // Seçenekler
  const statusOptions = [
    { label: 'Aktif', value: 'Aktif' },
    { label: 'Pasif', value: 'Pasif' },
    { label: 'Beklemede', value: 'Beklemede' }
  ]

  const cityOptions = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana']

  const segmentOptions = [
    { label: 'Premium', value: 'Premium' },
    { label: 'Standart', value: 'Standart' },
    { label: 'Yeni', value: 'Yeni' }
  ]

  const viewModes = [
    { icon: 'pi pi-list', value: 'list' },
    { icon: 'pi pi-th-large', value: 'grid' }
  ]

  // API'den veri çekme
  const loadCustomers = async () => {
    loading.value = true
    
    try {
      const queryParams = new URLSearchParams({
        page: lazyParams.value.page.toString(),
        rows: lazyParams.value.rows.toString(),
        sortField: lazyParams.value.sortField,
        sortOrder: lazyParams.value.sortOrder.toString(),
      })
      
      if (filters.value.search) {
        queryParams.append('search', filters.value.search)
      }
      if (filters.value.status) {
        queryParams.append('status', filters.value.status)
      }
      if (filters.value.city) {
        queryParams.append('city', filters.value.city)
      }
      if (filters.value.segment) {
        queryParams.append('segment', filters.value.segment)
      }
      
      const response = await $fetch<{
        data: Customer[]
        totalRecords: number
        page: number
        rows: number
      }>(`/api/customers?${queryParams.toString()}`)
      
      customers.value = response.data
      totalRecords.value = response.totalRecords
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error)
    } finally {
      loading.value = false
    }
  }

  // Sayfa değişikliği
  const onPage = (event: any) => {
    lazyParams.value.first = event.first
    lazyParams.value.rows = event.rows
    lazyParams.value.page = (event.first / event.rows) + 1
    loadCustomers()
  }

  // Sıralama değişikliği
  const onSort = (event: any) => {
    lazyParams.value.sortField = event.sortField
    lazyParams.value.sortOrder = event.sortOrder
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadCustomers()
  }

  // Tablo filtresi değişikliği
  const onFilter = (event: any) => {
    lazyParams.value.filters = event.filters
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadCustomers()
  }

  // Filtreleri uygula
  const applyFilters = () => {
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadCustomers()
  }

  // Filtreleri temizle
  const clearFilters = () => {
    filters.value = {
      search: '',
      status: null,
      city: null,
      segment: null,
      dateRange: null
    }
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadCustomers()
  }

  // Yardımcı fonksiyonlar
  const getStatusSeverity = (status: string) => {
    const map: Record<string, string> = {
      'Aktif': 'success',
      'Pasif': 'danger',
      'Beklemede': 'warn'
    }
    return map[status] || 'secondary'
  }

  const getStatusIcon = (status: string) => {
    const map: Record<string, string> = {
      'Aktif': 'pi pi-check-circle',
      'Pasif': 'pi pi-times-circle',
      'Beklemede': 'pi pi-clock'
    }
    return map[status] || ''
  }

  const getSegmentSeverity = (segment: string) => {
    const map: Record<string, string> = {
      'Premium': 'success',
      'Standart': 'info',
      'Yeni': 'warn'
    }
    return map[segment] || 'secondary'
  }

  // CRUD işlemleri
  const viewCustomer = (customer: Customer) => {
    selectedCustomer.value = customer
    detailDialog.value = true
  }

  const editCustomer = (customer: Customer | null) => {
    if (customer) {
      console.log('Edit customer:', customer)
      detailDialog.value = false
    }
  }

  const confirmDelete = (customer: Customer) => {
    selectedCustomer.value = customer
    deleteDialog.value = true
  }

  const deleteCustomer = async () => {
    if (selectedCustomer.value) {
      // TODO: API'ye DELETE isteği gönder
      await loadCustomers()
      deleteDialog.value = false
      selectedCustomer.value = null
    }
  }

  // İlk yükleme
  onMounted(() => {
    loadCustomers()
  })

  return {
    // State
    customers,
    loading,
    totalRecords,
    selectedCustomers,
    selectedCustomer,
    deleteDialog,
    detailDialog,
    viewMode,
    lazyParams,
    filters,
    tableFilters,
    
    // Options
    statusOptions,
    cityOptions,
    segmentOptions,
    viewModes,
    
    // Methods
    loadCustomers,
    onPage,
    onSort,
    onFilter,
    applyFilters,
    clearFilters,
    getStatusSeverity,
    getStatusIcon,
    getSegmentSeverity,
    viewCustomer,
    editCustomer,
    confirmDelete,
    deleteCustomer
  }
}

