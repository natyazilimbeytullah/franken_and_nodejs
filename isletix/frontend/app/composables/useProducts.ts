import { FilterMatchMode } from '@primevue/core/api'

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  brand: string
  price: number
  stock: number
  status: string
  image: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  data: Product[]
  totalRecords: number
}

/**
 * Ürün yönetimi için composable
 * Lazy loading, filtreleme, sıralama ve CRUD işlemleri
 */
export const useProducts = (url: string) => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const totalRecords = ref(0)
  const selectedProducts = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)
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
    category: null as string | null,
    brand: null as string | null,
    priceRange: null as number[] | null,
    stockStatus: null as string | null
  })

  const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.EQUALS },
    brand: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
  })

  // Seçenekler
  const statusOptions = [
    { label: 'Aktif', value: 'Aktif' },
    { label: 'Pasif', value: 'Pasif' },
    { label: 'Taslak', value: 'Taslak' }
  ]

  const categoryOptions = [
    'Elektronik',
    'Giyim',
    'Ev & Yaşam',
    'Spor & Outdoor',
    'Kitap & Kırtasiye',
    'Kozmetik',
    'Oyuncak'
  ]

  const brandOptions = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    'LG',
    'Philips',
    'Bosch'
  ]

  const stockStatusOptions = [
    { label: 'Stokta Var', value: 'in_stock' },
    { label: 'Stok Azaldı', value: 'low_stock' },
    { label: 'Tükendi', value: 'out_of_stock' }
  ]

  const viewModes = [
    { icon: 'pi pi-list', value: 'list' },
    { icon: 'pi pi-th-large', value: 'grid' }
  ]

  // API'den veri çekme
  const loadProducts = async () => {
    loading.value = true
    
    try {
      // API query parametrelerini hazırla
      const queryParams: any = {
        page: lazyParams.value.page,
        rows: lazyParams.value.rows,
        sortField: lazyParams.value.sortField,
        sortOrder: lazyParams.value.sortOrder
      }
      
      // Filtreleri ekle
      if (filters.value.search) queryParams.search = filters.value.search
      if (filters.value.status) queryParams.status = filters.value.status
      if (filters.value.category) queryParams.category = filters.value.category
      if (filters.value.brand) queryParams.brand = filters.value.brand
      if (filters.value.stockStatus) queryParams.stockStatus = filters.value.stockStatus
      
      // API'den veri çek
      const response = await $fetch<ProductsResponse>(url, {
        query: queryParams
      })
      
      // Response'u state'e ata
      products.value = response?.data || []
      totalRecords.value = response?.totalRecords || 0
      
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error)
    } finally {
      loading.value = false
    }
  }

  // Sayfa değişikliği
  const onPage = (event: any) => {
    lazyParams.value.first = event.first
    lazyParams.value.rows = event.rows
    lazyParams.value.page = (event.first / event.rows) + 1
    loadProducts()
  }

  // Sıralama değişikliği
  const onSort = (event: any) => {
    lazyParams.value.sortField = event.sortField
    lazyParams.value.sortOrder = event.sortOrder
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadProducts()
  }

  // Tablo filtresi değişikliği
  const onFilter = (event: any) => {
    lazyParams.value.filters = event.filters
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadProducts()
  }

  // Filtreleri uygula
  const applyFilters = () => {
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadProducts()
  }

  // Filtreleri temizle
  const clearFilters = () => {
    filters.value = {
      search: '',
      status: null,
      category: null,
      brand: null,
      priceRange: null,
      stockStatus: null
    }
    lazyParams.value.first = 0
    lazyParams.value.page = 1
    loadProducts()
  }

  // Yardımcı fonksiyonlar
  const getStatusSeverity = (status: string) => {
    const map: Record<string, string> = {
      'Aktif': 'success',
      'Pasif': 'danger',
      'Taslak': 'warn'
    }
    return map[status] || 'secondary'
  }

  const getStatusIcon = (status: string) => {
    const map: Record<string, string> = {
      'Aktif': 'pi pi-check-circle',
      'Pasif': 'pi pi-times-circle',
      'Taslak': 'pi pi-file-edit'
    }
    return map[status] || ''
  }

  const getStockSeverity = (stock: number) => {
    if (stock === 0) return 'danger'
    if (stock <= 50) return 'warn'
    return 'success'
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'Tükendi'
    if (stock <= 50) return 'Stok Azaldı'
    return 'Stokta'
  }

  // CRUD işlemleri
  const viewProduct = (product: Product) => {
    selectedProduct.value = product
    detailDialog.value = true
  }

  const editProduct = (product: Product | null) => {
    if (product) {
      console.log('Edit product:', product)
      detailDialog.value = false
      // TODO: Navigate to edit page
    }
  }

  const confirmDelete = (product: Product) => {
    selectedProduct.value = product
    deleteDialog.value = true
  }

  const deleteProduct = async () => {
    if (selectedProduct.value) {
      // TODO: API'ye DELETE isteği gönder
      await loadProducts()
      deleteDialog.value = false
      selectedProduct.value = null
    }
  }

  // İlk yükleme
  onMounted(() => {
    loadProducts()
  })

  return {
    // State
    products,
    loading,
    totalRecords,
    selectedProducts,
    selectedProduct,
    deleteDialog,
    detailDialog,
    viewMode,
    lazyParams,
    filters,
    tableFilters,
    
    // Options
    statusOptions,
    categoryOptions,
    brandOptions,
    stockStatusOptions,
    viewModes,
    
    // Methods
    loadProducts,
    onPage,
    onSort,
    onFilter,
    applyFilters,
    clearFilters,
    getStatusSeverity,
    getStatusIcon,
    getStockSeverity,
    getStockStatus,
    viewProduct,
    editProduct,
    confirmDelete,
    deleteProduct
  }
}
