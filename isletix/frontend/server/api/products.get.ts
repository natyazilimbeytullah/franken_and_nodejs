export default defineEventHandler(async (event) => {
  // Query parametrelerini al
  const query = getQuery(event)
  
  // Mock data - kategoriler ve markalar
  const categories = [
    'Elektronik',
    'Giyim',
    'Ev & Yaşam',
    'Spor & Outdoor',
    'Kitap & Kırtasiye',
    'Kozmetik',
    'Oyuncak'
  ]
  
  const brands = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    'LG',
    'Philips',
    'Bosch'
  ]
  
  const statuses = ['Aktif', 'Pasif', 'Taslak']
  
  // Mock ürün verisi oluştur
  const allProducts = []
  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)] || 'Elektronik'
    const brand = brands[Math.floor(Math.random() * brands.length)] || 'Apple'
    const status = statuses[Math.floor(Math.random() * statuses.length)] || 'Aktif'
    const stock = Math.floor(Math.random() * 500)
    const price = Math.floor(Math.random() * 10000) + 100

    allProducts.push({
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
  
  // Query parametrelerini parse et
  const page = parseInt(query.page as string) || 1
  const rows = parseInt(query.rows as string) || 10
  const sortField = (query.sortField as string) || 'name'
  const sortOrder = parseInt(query.sortOrder as string) || 1
  
  // Filtreler
  const search = query.search as string || ''
  const status = query.status as string || null
  const category = query.category as string || null
  const brand = query.brand as string || null
  const stockStatus = query.stockStatus as string || null
  
  // Filtreleme
  let filtered = allProducts.filter(product => {
    // Arama filtresi
    if (search) {
      const searchLower = search.toLowerCase()
      if (!product.name.toLowerCase().includes(searchLower) &&
          !product.sku.toLowerCase().includes(searchLower) &&
          !product.brand.toLowerCase().includes(searchLower)) {
        return false
      }
    }
    
    // Status filtresi
    if (status && product.status !== status) return false
    
    // Category filtresi
    if (category && product.category !== category) return false
    
    // Brand filtresi
    if (brand && product.brand !== brand) return false
    
    // Stock status filtresi
    if (stockStatus) {
      if (stockStatus === 'in_stock' && product.stock <= 50) return false
      if (stockStatus === 'low_stock' && (product.stock === 0 || product.stock > 50)) return false
      if (stockStatus === 'out_of_stock' && product.stock !== 0) return false
    }
    
    return true
  })
  
  // Toplam kayıt sayısı
  const totalRecords = filtered.length
  
  // Sıralama
  filtered.sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]
    
    if (aValue < bValue) return sortOrder === 1 ? -1 : 1
    if (aValue > bValue) return sortOrder === 1 ? 1 : -1
    return 0
  })
  
  // Pagination
  const start = (page - 1) * rows
  const end = start + rows
  const data = filtered.slice(start, end)
  
  // Response döndür
  return {
    data,
    totalRecords,
    page,
    rows
  }
})
