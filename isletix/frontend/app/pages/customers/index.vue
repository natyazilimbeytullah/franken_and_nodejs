<template>
  <div class="flex flex-column gap-3 page-container">
    <!-- Page Header -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-2">
      <p class="text-color-secondary m-0 hidden md:block">Tüm müşterilerinizi buradan yönetin</p>
      <div class="flex gap-2 w-full md:w-auto justify-content-end">
        <Button :label="isMobile ? '' : 'Dışa Aktar'" icon="pi pi-download" outlined :class="{'p-button-sm': isMobile}" />
        <NuxtLink to="/customers/add">
          <Button :label="isMobile ? '' : 'Yeni Müşteri'" icon="pi pi-plus" :class="{'p-button-sm': isMobile}" />
        </NuxtLink>
      </div>
    </div>

    <!-- Filters Card -->
    <Card class="filter-card">
      <template #content>
        <div class="grid overflow-hidden">
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Ara</label>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters.search" placeholder="İsim, email veya telefon..." class="w-full" />
            </IconField>
          </div>
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Durum</label>
            <Select 
              v-model="filters.status" 
              :options="statusOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="Tümü" 
              showClear
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Şehir</label>
            <Select 
              v-model="filters.city" 
              :options="cityOptions" 
              placeholder="Tümü" 
              showClear
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Kayıt Tarihi</label>
            <DatePicker 
              v-model="filters.dateRange" 
              selectionMode="range" 
              dateFormat="dd/mm/yy"
              placeholder="Tarih Aralığı"
              showIcon
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Segment</label>
            <Select 
              v-model="filters.segment" 
              :options="segmentOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="Tümü" 
              showClear
              class="w-full"
            />
          </div>
          <div class="col-12 lg:col-2 flex align-items-end gap-2">
            <Button :label="isMobile ? '' : 'Filtrele'" icon="pi pi-filter" @click="applyFilters" class="flex-1" />
            <Button :label="isMobile ? '' : 'Temizle'" icon="pi pi-times" outlined severity="secondary" @click="clearFilters" :class="{'flex-1': !isMobile, 'hidden': isMobile}" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Data Table Card -->
    <Card>
      <template #title>
        <div class="flex flex-wrap justify-content-between align-items-center gap-2">
          <div class="flex align-items-center gap-3">
            <span class="text-lg font-semibold">Müşteri Listesi</span>
            <Badge :value="`${totalRecords} müşteri`" severity="info" />
          </div>
          <SelectButton v-model="viewMode" :options="viewModes" optionLabel="icon" optionValue="value">
            <template #option="slotProps">
              <i :class="slotProps.option.icon"></i>
            </template>
          </SelectButton>
        </div>
      </template>
      <template #content>
        <DataTable 
          v-model:selection="selectedCustomers"
          v-model:filters="tableFilters"
          :value="customers" 
          :lazy="true"
          :loading="loading"
          :totalRecords="totalRecords"
          :rows="lazyParams.rows"
          :first="lazyParams.first"
          :paginator="true"
          :rowsPerPageOptions="isMobile ? [5, 10] : [5, 10, 25, 50]"
          :paginatorTemplate="isMobile ? 'PrevPageLink CurrentPageReport NextPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'"
          currentPageReportTemplate="{first} - {last} / {totalRecords}"
          :globalFilterFields="['name', 'email', 'phone', 'city']"
          responsiveLayout="scroll"
          class="customers-table"
          :size="isMobile ? 'small' : undefined"
          :sortField="lazyParams.sortField"
          :sortOrder="lazyParams.sortOrder"
          @page="onPage"
          @sort="onSort"
          @filter="onFilter"
          removableSort
          :filterDisplay="isMobile ? 'row' : 'menu'"
          :selectionMode="isMobile ? undefined : 'multiple'"
          scrollable
          scrollWidth="100%"
          :scrollHeight="isMobile ? undefined : 'flex'"
        >
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-users"></i>
              <p>Müşteri bulunamadı</p>
            </div>
          </template>

          <!-- <Column v-if="isDesktop" selectionMode="multiple" headerStyle="width: 3rem"></Column> -->

          <Column field="name" header="Müşteri" sortable>
            <template #body="{ data }">
              <div class="customer-cell">
                <Avatar 
                  :label="data.initials" 
                  :style="{ backgroundColor: data.avatarColor, color: '#fff' }" 
                  shape="circle" 
                  :size="isMobile ? 'normal' : 'large'"
                />
                <div class="customer-details">
                  <span class="customer-name">{{ data.name }}</span>
                  <span class="customer-email">{{ data.email }}</span>
                </div>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="İsme göre ara" />
            </template>
          </Column>

          <Column v-if="isDesktop" field="phone" header="Telefon" sortable>
            <template #body="{ data }">
              <span class="phone-cell">{{ data.phone }}</span>
            </template>
          </Column>

          <Column v-if="!isMobile" field="city" header="Şehir" sortable>
            <template #body="{ data }">
              <div class="city-cell">
                <i class="pi pi-map-marker"></i>
                <span>{{ data.city }}</span>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                v-model="filterModel.value" 
                :options="cityOptions" 
                placeholder="Şehir seç"
                @change="filterCallback()"
                showClear
              />
            </template>
          </Column>

          <Column v-if="isLargeDesktop" field="segment" header="Segment" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.segment" 
                :severity="getSegmentSeverity(data.segment)"
              />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                v-model="filterModel.value" 
                :options="segmentOptions" 
                optionLabel="label"
                optionValue="value"
                placeholder="Segment seç"
                @change="filterCallback()"
                showClear
              />
            </template>
          </Column>

          <Column v-if="isLargeDesktop" field="totalOrders" header="Sipariş" sortable>
            <template #body="{ data }">
              <span class="orders-count">{{ data.totalOrders }}</span>
            </template>
          </Column>

          <Column v-if="isLargeDesktop" field="totalSpent" header="Harcama" sortable>
            <template #body="{ data }">
              <span class="spent-cell">₺{{ data.totalSpent.toLocaleString('tr-TR') }}</span>
            </template>
          </Column>

          <Column field="status" header="Durum" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getStatusSeverity(data.status)"
                :icon="getStatusIcon(data.status)"
              />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                v-model="filterModel.value" 
                :options="statusOptions" 
                optionLabel="label"
                optionValue="value"
                placeholder="Durum seç"
                @change="filterCallback()"
                showClear
              />
            </template>
          </Column>

          <Column v-if="isLargeDesktop" field="createdAt" header="Kayıt Tarihi" sortable>
            <template #body="{ data }">
              <span class="date-cell">{{ data.createdAt }}</span>
            </template>
          </Column>

          <Column header="İşlemler" :frozen="isDesktop" alignFrozen="right">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button icon="pi pi-eye" text rounded severity="info" size="small" @click="viewCustomer(data)" />
                <Button v-if="isDesktop" icon="pi pi-pencil" text rounded severity="success" size="small" @click="editCustomer(data)" />
                <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="confirmDelete(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:visible="deleteDialog" header="Müşteri Sil" :modal="true" :style="{ width: '400px' }">
      <div class="flex align-items-start gap-3 py-2">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
        <p class="m-0">
          <strong>{{ selectedCustomer?.name }}</strong> adlı müşteriyi silmek istediğinizden emin misiniz?
        </p>
      </div>
      <template #footer>
        <Button label="İptal" icon="pi pi-times" outlined @click="deleteDialog = false" />
        <Button label="Sil" icon="pi pi-trash" severity="danger" @click="deleteCustomer" />
      </template>
    </Dialog>

    <!-- Customer Detail Dialog -->
    <Dialog v-model:visible="detailDialog" :header="selectedCustomer?.name" :modal="true" :style="{ width: '600px' }">
      <div v-if="selectedCustomer" class="py-2">
        <div class="flex align-items-center gap-3 pb-3 mb-3 border-bottom-1 surface-border">
          <Avatar 
            :label="selectedCustomer.initials" 
            :style="{ backgroundColor: selectedCustomer.avatarColor, color: '#fff' }" 
            shape="circle" 
            size="xlarge"
          />
          <div>
            <h3 class="m-0 mb-2">{{ selectedCustomer.name }}</h3>
            <Tag :value="selectedCustomer.segment" :severity="getSegmentSeverity(selectedCustomer.segment)" />
          </div>
        </div>
        <div class="grid">
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Email</label>
            <span class="font-medium">{{ selectedCustomer.email }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Telefon</label>
            <span class="font-medium">{{ selectedCustomer.phone }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Şehir</label>
            <span class="font-medium">{{ selectedCustomer.city }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Durum</label>
            <Tag :value="selectedCustomer.status" :severity="getStatusSeverity(selectedCustomer.status)" />
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Toplam Sipariş</label>
            <span class="font-medium">{{ selectedCustomer.totalOrders }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Toplam Harcama</label>
            <span class="font-semibold text-green-500">₺ {{ selectedCustomer.totalSpent.toLocaleString('tr-TR') }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Kapat" icon="pi pi-times" outlined @click="detailDialog = false" />
        <Button label="Düzenle" icon="pi pi-pencil" @click="editCustomer(selectedCustomer)" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Composables
const { isMobile, isDesktop, isLargeDesktop } = useWindowSize()

const {
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
} = useCustomers()
</script>