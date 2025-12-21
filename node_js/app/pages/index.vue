<template>
  <div class="dashboard-page">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <StatsCard
        :value="284560"
        label="Toplam Satış"
        icon="pi pi-shopping-cart"
        color="blue"
        :trend="12.5"
        prefix="₺ "
      />
      <StatsCard
        :value="156"
        label="Tamamlanan Sipariş"
        icon="pi pi-check-circle"
        color="green"
        :trend="8.2"
      />
      <StatsCard
        :value="23"
        label="Bekleyen Sipariş"
        icon="pi pi-clock"
        color="orange"
        :trend="-3.1"
      />
      <StatsCard
        :value="1248"
        label="Aktif Müşteri"
        icon="pi pi-users"
        color="purple"
        :trend="5.7"
      />
    </div>

    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="tab-group">
        <SelectButton v-model="selectedPeriod" :options="periods" />
      </div>
      <div class="actions-group">
        <Button label="Rapor İndir" icon="pi pi-download" outlined />
        <DatePicker 
          v-model="dateRange" 
          selectionMode="range" 
          :manualInput="false"
          dateFormat="dd/mm/yy"
          placeholder="Tarih Aralığı"
          showIcon
        />
      </div>
    </div>

    <!-- Chart Section -->
    <Card class="chart-card">
      <template #title>
        <div class="chart-header">
          <span class="chart-title">Satış Analizi</span>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot sales"></span>
              <span>Satış</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot orders"></span>
              <span>Sipariş</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot returns"></span>
              <span>İade</span>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <div class="chart-container">
          <div class="chart-y-axis">
            <span>₺300K</span>
            <span>₺250K</span>
            <span>₺200K</span>
            <span>₺150K</span>
            <span>₺100K</span>
            <span>₺50K</span>
            <span>₺0</span>
          </div>
          <div class="chart-bars">
            <div v-for="month in chartData" :key="month.name" class="bar-group">
              <div class="bars">
                <div class="bar sales" :style="{ height: `${month.sales / 1500}px` }"></div>
                <div class="bar orders" :style="{ height: `${month.orders / 1500}px` }"></div>
                <div class="bar returns" :style="{ height: `${month.returns / 1500}px` }"></div>
              </div>
              <span class="bar-label">{{ month.name }}</span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <!-- Recent Orders Table -->
      <Card class="orders-card">
        <template #title>
          <div class="card-title-row">
            <span>Son Siparişler</span>
            <NuxtLink to="/orders">
              <Button label="Tümünü Gör" link />
            </NuxtLink>
          </div>
        </template>
        <template #content>
          <DataTable :value="recentOrders" :rows="5" class="orders-table">
            <Column field="orderId" header="Sipariş No">
              <template #body="slotProps">
                <span class="order-id">#{{ slotProps.data.orderId }}</span>
              </template>
            </Column>
            <Column field="customer" header="Müşteri">
              <template #body="slotProps">
                <div class="customer-info">
                  <Avatar :label="slotProps.data.initials" :style="{ backgroundColor: slotProps.data.avatarColor, color: '#fff' }" shape="circle" size="normal" />
                  <span class="customer-name">{{ slotProps.data.customer }}</span>
                </div>
              </template>
            </Column>
            <Column field="product" header="Ürün"></Column>
            <Column field="date" header="Tarih"></Column>
            <Column field="amount" header="Tutar">
              <template #body="slotProps">
                <span class="amount">₺ {{ slotProps.data.amount.toLocaleString('tr-TR') }}</span>
              </template>
            </Column>
            <Column field="status" header="Durum">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Right Panel -->
      <div class="right-panel">
        <!-- Stock Alerts -->
        <Card class="alerts-card">
          <template #title>
            <div class="card-title-row">
              <span>Stok Uyarıları</span>
              <Badge :value="lowStockItems.length" severity="warning" />
            </div>
          </template>
          <template #content>
            <ul class="alerts-list">
              <li v-for="item in lowStockItems" :key="item.id" class="alert-item">
                <div class="alert-icon" :class="item.level">
                  <i class="pi pi-exclamation-triangle"></i>
                </div>
                <div class="alert-content">
                  <span class="alert-product">{{ item.name }}</span>
                  <span class="alert-stock">Kalan: {{ item.stock }} adet</span>
                </div>
              </li>
            </ul>
          </template>
        </Card>

        <!-- Top Products -->
        <Card class="products-card">
          <template #title>
            <div class="card-title-row">
              <span>En Çok Satan</span>
            </div>
          </template>
          <template #content>
            <ul class="products-list">
              <li v-for="(product, index) in topProducts" :key="product.id" class="product-item">
                <span class="product-rank">{{ index + 1 }}</span>
                <div class="product-info">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-sales">{{ product.sales }} satış</span>
                </div>
                <span class="product-revenue">₺ {{ product.revenue.toLocaleString('tr-TR') }}</span>
              </li>
            </ul>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const selectedPeriod = ref('Aylık')
const periods = ref(['Haftalık', 'Aylık', 'Yıllık'])
const dateRange = ref()

const chartData = ref([
  { name: 'Oca', sales: 180000, orders: 120000, returns: 15000 },
  { name: 'Şub', sales: 220000, orders: 150000, returns: 18000 },
  { name: 'Mar', sales: 250000, orders: 180000, returns: 22000 },
  { name: 'Nis', sales: 200000, orders: 140000, returns: 16000 },
  { name: 'May', sales: 280000, orders: 200000, returns: 25000 },
  { name: 'Haz', sales: 240000, orders: 170000, returns: 20000 },
  { name: 'Tem', sales: 190000, orders: 130000, returns: 14000 },
  { name: 'Ağu', sales: 300000, orders: 220000, returns: 28000 },
  { name: 'Eyl', sales: 270000, orders: 190000, returns: 23000 },
  { name: 'Eki', sales: 230000, orders: 160000, returns: 19000 },
  { name: 'Kas', sales: 260000, orders: 185000, returns: 21000 },
  { name: 'Ara', sales: 320000, orders: 240000, returns: 30000 }
])

const recentOrders = ref([
  { orderId: 'SIP-2024-1254', customer: 'Mehmet Kaya', initials: 'MK', avatarColor: '#3b82f6', product: 'MacBook Pro 14"', date: '15 Ara 2024', amount: 45000, status: 'Tamamlandı' },
  { orderId: 'SIP-2024-1253', customer: 'Ayşe Demir', initials: 'AD', avatarColor: '#ec4899', product: 'iPhone 15 Pro', date: '15 Ara 2024', amount: 62000, status: 'Kargoda' },
  { orderId: 'SIP-2024-1252', customer: 'Ali Yıldız', initials: 'AY', avatarColor: '#22c55e', product: 'Samsung TV 65"', date: '14 Ara 2024', amount: 38000, status: 'Hazırlanıyor' },
  { orderId: 'SIP-2024-1251', customer: 'Fatma Özkan', initials: 'FÖ', avatarColor: '#f59e0b', product: 'Sony PS5', date: '14 Ara 2024', amount: 22000, status: 'Beklemede' }
])

const lowStockItems = ref([
  { id: 1, name: 'iPhone 15 Pro Max', stock: 5, level: 'critical' },
  { id: 2, name: 'MacBook Air M3', stock: 12, level: 'warning' },
  { id: 3, name: 'AirPods Pro 2', stock: 8, level: 'critical' }
])

const topProducts = ref([
  { id: 1, name: 'iPhone 15 Pro', sales: 342, revenue: 21204000 },
  { id: 2, name: 'MacBook Pro 14"', sales: 186, revenue: 8370000 },
  { id: 3, name: 'iPad Pro 12.9"', sales: 124, revenue: 4340000 }
])

const getStatusSeverity = (status: string) => {
  const map: Record<string, string> = {
    'Tamamlandı': 'success',
    'Kargoda': 'info',
    'Hazırlanıyor': 'warn',
    'Beklemede': 'secondary'
  }
  return map[status] || 'secondary'
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Chart Card */
.chart-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.sales { background-color: #3b82f6; }
.legend-dot.orders { background-color: #22c55e; }
.legend-dot.returns { background-color: #f59e0b; }

.chart-container {
  display: flex;
  height: 280px;
  padding: 1rem 0;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: right;
  min-width: 60px;
}

.chart-bars {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  border-left: 1px solid #e2e8f0;
  padding: 0 1rem;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 220px;
}

.bar {
  width: 12px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.bar.sales { background-color: #3b82f6; }
.bar.orders { background-color: #22c55e; }
.bar.returns { background-color: #f59e0b; }

.bar-label {
  font-size: 0.75rem;
  color: #64748b;
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

/* Orders Card */
.orders-card, .alerts-card, .products-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.orders-table :deep(.p-datatable-thead > tr > th) {
  background: transparent;
  border: none;
  padding: 1rem;
  font-weight: 600;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.orders-table :deep(.p-datatable-tbody > tr > td) {
  border: none;
  padding: 1rem;
}

.orders-table :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid #f1f5f9;
}

.order-id {
  color: #3b82f6;
  font-weight: 500;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-name {
  font-weight: 500;
  color: #1e293b;
}

.amount {
  font-weight: 600;
  color: #1e293b;
}

/* Right Panel */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts-list, .products-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item, .product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon.critical { background: #fee2e2; color: #dc2626; }
.alert-icon.warning { background: #fef3c7; color: #d97706; }

.alert-content { flex: 1; }
.alert-product { display: block; font-weight: 500; color: #1e293b; font-size: 0.875rem; }
.alert-stock { display: block; color: #94a3b8; font-size: 0.75rem; }

.product-rank {
  width: 28px;
  height: 28px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #64748b;
}

.product-info { flex: 1; }
.product-info .product-name { display: block; font-weight: 500; color: #1e293b; }
.product-sales { display: block; color: #94a3b8; font-size: 0.75rem; }
.product-revenue { font-weight: 600; color: #22c55e; }

/* Responsive */
@media (max-width: 1400px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1200px) {
  .bottom-section { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
  .controls-bar { flex-direction: column; gap: 1rem; align-items: flex-start; }
  .chart-legend { display: none; }
}
</style>
