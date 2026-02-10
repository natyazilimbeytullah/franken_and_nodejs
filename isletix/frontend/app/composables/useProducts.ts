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

/**
 * Ürün yönetimi için composable
 * Lazy loading, filtreleme, sıralama ve CRUD işlemleri
 */
export const useProducts = () => {
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

  // Mock data generator
  const generateMockProducts = (): Product[] => {
    const categories = categoryOptions
    const brands = brandOptions
    const statuses = ['Aktif', 'Pasif', 'Taslak']
    const products: Product[] = []

    for (let i = 1; i <= 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)] || 'Elektronik'
      const brand = brands[Math.floor(Math.random() * brands.length)] || 'Apple'
      const status = statuses[Math.floor(Math.random() * statuses.length)] || 'Aktif'
      const stock = Math.floor(Math.random() * 500)
      const price = Math.floor(Math.random() * 10000) + 100

      products.push({
        id: i,
        name: `${brand} ${category} Ürün ${i}`,
        sku: `SKU-${String(i).padStart(5, '0')}`,
        category,
        brand,
        price,
        stock,
        status,
        image: `https://picsum.photos/seed/${i}/200/200`,
        description: `${brand} markasının kaliteli ${category} kategorisinde yer alan ürün. Yüksek performans ve dayanıklılık.`,
        createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('tr-TR'),
        updatedAt: new Date().toLocaleDateString('tr-TR')
      })
    }

    return products
  }

  // API'den veri çekme (şimdilik mock data)
  const loadProducts = async () => {
    loading.value = true
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let allProducts = generateMockProducts()
      
      // Apply filters
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        allProducts = allProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
        )
      }
      
      if (filters.value.status) {
        allProducts = allProducts.filter(p => p.status === filters.value.status)
      }
      
      if (filters.value.category) {
        allProducts = allProducts.filter(p => p.category === filters.value.category)
      }
      
      if (filters.value.brand) {
        allProducts = allProducts.filter(p => p.brand === filters.value.brand)
      }
      
      if (filters.value.stockStatus) {
        allProducts = allProducts.filter(p => {
          if (filters.value.stockStatus === 'in_stock') return p.stock > 50
          if (filters.value.stockStatus === 'low_stock') return p.stock > 0 && p.stock <= 50
          if (filters.value.stockStatus === 'out_of_stock') return p.stock === 0
          return true
        })
      }
      
      // Apply sorting
      if (lazyParams.value.sortField) {
        allProducts.sort((a, b) => {
          const field = lazyParams.value.sortField as keyof Product
          const aVal = a[field]
          const bVal = b[field]
          
          if (aVal < bVal) return -1 * lazyParams.value.sortOrder
          if (aVal > bVal) return 1 * lazyParams.value.sortOrder
          return 0
        })
      }
      
      totalRecords.value = allProducts.length
      
      // Apply pagination
      const start = lazyParams.value.first
      const end = start + lazyParams.value.rows
      products.value = allProducts.slice(start, end)
      
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
