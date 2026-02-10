export default defineEventHandler(async (event) => {
  // Query parametrelerini al
  const query = getQuery(event)
  
  // Mock data
  const allCustomers = [
    { id: 1, name: 'Mehmet Kaya', email: 'mehmet@email.com', phone: '0532 123 4567', city: 'İstanbul', segment: 'Premium', status: 'Aktif', totalOrders: 45, totalSpent: 125000, createdAt: '12/03/2023', initials: 'MK', avatarColor: '#3b82f6' },
    { id: 2, name: 'Ayşe Demir', email: 'ayse@email.com', phone: '0533 234 5678', city: 'Ankara', segment: 'Standart', status: 'Aktif', totalOrders: 23, totalSpent: 45000, createdAt: '05/06/2023', initials: 'AD', avatarColor: '#ec4899' },
    { id: 3, name: 'Ali Yıldız', email: 'ali@email.com', phone: '0534 345 6789', city: 'İzmir', segment: 'Premium', status: 'Aktif', totalOrders: 67, totalSpent: 234000, createdAt: '18/01/2023', initials: 'AY', avatarColor: '#22c55e' },
    { id: 4, name: 'Fatma Özkan', email: 'fatma@email.com', phone: '0535 456 7890', city: 'Bursa', segment: 'Yeni', status: 'Beklemede', totalOrders: 2, totalSpent: 3500, createdAt: '28/11/2024', initials: 'FÖ', avatarColor: '#f59e0b' },
    { id: 5, name: 'Emre Şahin', email: 'emre@email.com', phone: '0536 567 8901', city: 'Antalya', segment: 'Standart', status: 'Aktif', totalOrders: 34, totalSpent: 78000, createdAt: '10/08/2023', initials: 'EŞ', avatarColor: '#8b5cf6' },
    { id: 6, name: 'Zeynep Arslan', email: 'zeynep@email.com', phone: '0537 678 9012', city: 'İstanbul', segment: 'Premium', status: 'Aktif', totalOrders: 89, totalSpent: 456000, createdAt: '02/02/2022', initials: 'ZA', avatarColor: '#06b6d4' },
    { id: 7, name: 'Burak Çelik', email: 'burak@email.com', phone: '0538 789 0123', city: 'Ankara', segment: 'Yeni', status: 'Pasif', totalOrders: 5, totalSpent: 12000, createdAt: '15/10/2024', initials: 'BÇ', avatarColor: '#ef4444' },
    { id: 8, name: 'Selin Koç', email: 'selin@email.com', phone: '0539 890 1234', city: 'İzmir', segment: 'Standart', status: 'Aktif', totalOrders: 28, totalSpent: 56000, createdAt: '22/04/2023', initials: 'SK', avatarColor: '#84cc16' },
    { id: 9, name: 'Cem Aydın', email: 'cem@email.com', phone: '0530 901 2345', city: 'Konya', segment: 'Premium', status: 'Aktif', totalOrders: 52, totalSpent: 198000, createdAt: '07/07/2022', initials: 'CA', avatarColor: '#f97316' },
    { id: 10, name: 'Deniz Yılmaz', email: 'deniz@email.com', phone: '0531 012 3456', city: 'Adana', segment: 'Standart', status: 'Aktif', totalOrders: 19, totalSpent: 34000, createdAt: '30/09/2023', initials: 'DY', avatarColor: '#14b8a6' },
    { id: 11, name: 'Ahmet Yılmaz', email: 'ahmet@email.com', phone: '0532 111 2222', city: 'İstanbul', segment: 'Premium', status: 'Aktif', totalOrders: 30, totalSpent: 90000, createdAt: '01/01/2024', initials: 'AY', avatarColor: '#3b82f6' },
    { id: 12, name: 'Elif Kaya', email: 'elif@email.com', phone: '0533 222 3333', city: 'Ankara', segment: 'Standart', status: 'Aktif', totalOrders: 15, totalSpent: 30000, createdAt: '15/02/2024', initials: 'EK', avatarColor: '#ec4899' },
    { id: 13, name: 'Can Demir', email: 'can@email.com', phone: '0534 333 4444', city: 'İzmir', segment: 'Yeni', status: 'Beklemede', totalOrders: 3, totalSpent: 5000, createdAt: '20/03/2024', initials: 'CD', avatarColor: '#f59e0b' },
    { id: 14, name: 'Selin Yıldız', email: 'selin2@email.com', phone: '0535 444 5555', city: 'Bursa', segment: 'Premium', status: 'Aktif', totalOrders: 40, totalSpent: 110000, createdAt: '10/04/2024', initials: 'SY', avatarColor: '#22c55e' },
    { id: 15, name: 'Berk Özkan', email: 'berk@email.com', phone: '0536 555 6666', city: 'Antalya', segment: 'Standart', status: 'Aktif', totalOrders: 20, totalSpent: 40000, createdAt: '05/05/2024', initials: 'BÖ', avatarColor: '#8b5cf6' },
    { id: 16, name: 'Gizem Şahin', email: 'gizem@email.com', phone: '0537 666 7777', city: 'İstanbul', segment: 'Premium', status: 'Aktif', totalOrders: 55, totalSpent: 220000, createdAt: '12/06/2024', initials: 'GŞ', avatarColor: '#06b6d4' },
    { id: 17, name: 'Murat Kaya', email: 'murat@email.com', phone: '0538 777 8888', city: 'Ankara', segment: 'Standart', status: 'Aktif', totalOrders: 25, totalSpent: 50000, createdAt: '18/07/2024', initials: 'MK', avatarColor: '#f97316' },
    { id: 18, name: 'Seda Yıldız', email: 'seda@email.com', phone: '0539 888 9999', city: 'İzmir', segment: 'Yeni', status: 'Beklemede', totalOrders: 1, totalSpent: 2000, createdAt: '25/08/2024', initials: 'SY', avatarColor: '#f59e0b' },
    { id: 19, name: 'Okan Demir', email: 'okan@email.com', phone: '0530 999 0000', city: 'Bursa', segment: 'Premium', status: 'Aktif', totalOrders: 60, totalSpent: 250000, createdAt: '03/09/2024', initials: 'OD', avatarColor: '#22c55e' },
    { id: 20, name: 'Pınar Arslan', email: 'pinar@email.com', phone: '0531 000 1111', city: 'Antalya', segment: 'Standart', status: 'Aktif', totalOrders: 18, totalSpent: 32000, createdAt: '14/10/2024', initials: 'PA', avatarColor: '#ec4899' },
  ]
  
  // Query parametrelerini parse et
  const page = parseInt(query.page as string) || 1
  const rows = parseInt(query.rows as string) || 10
  const sortField = (query.sortField as string) || 'name'
  const sortOrder = parseInt(query.sortOrder as string) || 1
  
  // Filtreler
  const search = query.search as string || ''
  const status = query.status as string || null
  const city = query.city as string || null
  const segment = query.segment as string || null
  
  // Filtreleme
  let filtered = allCustomers.filter(customer => {
    // Arama filtresi
    if (search) {
      const searchLower = search.toLowerCase()
      if (!customer.name.toLowerCase().includes(searchLower) &&
          !customer.email.toLowerCase().includes(searchLower) &&
          !customer.phone.includes(search)) {
        return false
      }
    }
    
    // Status filtresi
    if (status && customer.status !== status) return false
    
    // City filtresi
    if (city && customer.city !== city) return false
    
    // Segment filtresi
    if (segment && customer.segment !== segment) return false
    
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

