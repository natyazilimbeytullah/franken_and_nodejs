<template>
  <div class="flex flex-column gap-3 page-container">
    <!-- Page Header -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-2">
      <p class="text-color-secondary m-0 hidden md:block"></p>
      <div class="flex gap-2 w-full md:w-auto justify-content-end">
        <Button :label="isMobile ? '' : 'Dışa Aktar'" icon="pi pi-download" outlined :class="{'p-button-sm': isMobile}" />
        <NuxtLink to="/stock/add">
          <Button :label="isMobile ? '' : 'Yeni Ürün'" icon="pi pi-plus" :class="{'p-button-sm': isMobile}" />
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
              <InputText v-model="filters.search" placeholder="Ürün adı, SKU veya marka..." class="w-full" />
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
            <label class="text-xs font-semibold text-color-secondary uppercase">Kategori</label>
            <Select 
              v-model="filters.category" 
              :options="categoryOptions" 
              placeholder="Tümü" 
              showClear
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Marka</label>
            <Select 
              v-model="filters.brand" 
              :options="brandOptions" 
              placeholder="Tümü" 
              showClear
              class="w-full"
            />
          </div>
          <div class="col-12 md:col-6 lg:col-2 flex flex-column gap-2">
            <label class="text-xs font-semibold text-color-secondary uppercase">Stok Durumu</label>
            <Select 
              v-model="filters.stockStatus" 
              :options="stockStatusOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="Tümü" 
              showClear
              class="w-full"
            />
          </div>
          <div class="col-12 lg:col-2 flex align-items-end gap-2">
            <Button :label="isMobile ? '' : ''" icon="pi pi-filter" @click="applyFilters" class="flex-1" />
            <Button :label="isMobile ? '' : ''" icon="pi pi-times" outlined severity="secondary" @click="clearFilters" :class="{'text-white bg-red-500 flex-1': !isMobile, 'hidden': isMobile}" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Data Table Card -->
    <Card>
      <template #content>
        <DataTable 
          v-model:selection="selectedProducts"
          v-model:filters="tableFilters"
          :value="products" 
          :lazy="true"
          :loading="loading"
          :totalRecords="totalRecords"
          :rows="lazyParams.rows"
          :first="lazyParams.first"
          :paginator="true"
          :rowsPerPageOptions="isMobile ? [5, 10] : [5, 10, 25, 50]"
          :paginatorTemplate="isMobile ? 'PrevPageLink CurrentPageReport NextPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'"
          currentPageReportTemplate="{first} - {last} / {totalRecords}"
          :globalFilterFields="['name', 'sku', 'brand', 'category']"
          responsiveLayout="scroll"
          class="products-table"
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
              <i class="pi pi-box"></i>
              <p>Ürün bulunamadı</p>
            </div>
          </template>

          <!--<Column v-if="isDesktop" selectionMode="multiple" headerStyle="width: 3rem"></Column>-->

          <Column field="name" header="Ürün" sortable>
            <template #body="{ data }">
              <div class="product-cell">
                <Image 
                  :src="data.image" 
                  :alt="data.name"
                  width="48"
                  height="48"
                  class="product-image"
                  preview
                />
                <div class="product-details">
                  <span class="product-name">{{ data.name }}</span>
                  <span class="product-sku">{{ data.sku }}</span>
                </div>
              </div>
            </template>
          </Column>

          <Column v-if="isDesktop" field="category" header="Kategori" sortable>
            <template #body="{ data }">
              <div class="category-cell">
                <i class="pi pi-tag"></i>
                <span>{{ data.category }}</span>
              </div>
            </template>
          </Column>

          <Column v-if="!isMobile" field="brand" header="Marka" sortable>
            <template #body="{ data }">
              <span class="brand-cell">{{ data.brand }}</span>
            </template>
          </Column>

          <Column v-if="isLargeDesktop" field="price" header="Fiyat" sortable>
            <template #body="{ data }">
              <span class="price-cell">₺{{ data.price.toLocaleString('tr-TR') }}</span>
            </template>
          </Column>

          <Column field="stock" header="Stok" sortable>
            <template #body="{ data }">
              <Tag 
                :value="`${data.stock} adet`" 
                :severity="getStockSeverity(data.stock)"
                :icon="data.stock === 0 ? 'pi pi-times' : data.stock <= 50 ? 'pi pi-exclamation-triangle' : 'pi pi-check'"
              />
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
          </Column>


          <Column v-if="isLargeDesktop" field="createdAt" header="Oluşturma Tarihi" sortable>
            <template #body="{ data }">
              <span class="date-cell">{{ data.createdAt }}</span>
            </template>
          </Column>

          <Column header="İşlemler" :frozen="isDesktop" alignFrozen="right">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button icon="pi pi-eye" text rounded severity="info" size="small" @click="viewProduct(data)" />
                <Button v-if="isDesktop" icon="pi pi-pencil" text rounded severity="success" size="small" @click="editProduct(data)" />
                <Button icon="pi pi-trash" text rounded severity="danger" size="small" @click="confirmDelete(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:visible="deleteDialog" header="Ürün Sil" :modal="true" :style="{ width: '400px' }">
      <div class="flex align-items-start gap-3 py-2">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
        <p class="m-0">
          <strong>{{ selectedProduct?.name }}</strong> adlı ürünü silmek istediğinizden emin misiniz?
        </p>
      </div>
      <template #footer>
        <Button label="İptal" icon="pi pi-times" outlined @click="deleteDialog = false" />
        <Button label="Sil" icon="pi pi-trash" severity="danger" @click="deleteProduct" />
      </template>
    </Dialog>

    <!-- Product Detail Dialog -->
    <Dialog v-model:visible="detailDialog" :header="selectedProduct?.name" :modal="true" :style="{ width: '600px' }">
      <div v-if="selectedProduct" class="py-2">
        <div class="flex align-items-center gap-3 pb-3 mb-3 border-bottom-1 surface-border">
          <Image 
            :src="selectedProduct.image" 
            :alt="selectedProduct.name"
            width="80"
            height="80"
            class="product-detail-image"
            preview
          />
          <div>
            <h3 class="m-0 mb-2">{{ selectedProduct.name }}</h3>
            <Tag :value="selectedProduct.category" severity="info" />
          </div>
        </div>
        <div class="grid">
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">SKU</label>
            <span class="font-medium">{{ selectedProduct.sku }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Marka</label>
            <span class="font-medium">{{ selectedProduct.brand }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Fiyat</label>
            <span class="font-semibold text-green-500">₺ {{ selectedProduct.price.toLocaleString('tr-TR') }}</span>
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Durum</label>
            <Tag :value="selectedProduct.status" :severity="getStatusSeverity(selectedProduct.status)" />
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Stok Durumu</label>
            <Tag :value="`${selectedProduct.stock} adet - ${getStockStatus(selectedProduct.stock)}`" :severity="getStockSeverity(selectedProduct.stock)" />
          </div>
          <div class="col-6 flex flex-column gap-1">
            <label class="text-xs text-color-secondary uppercase font-semibold">Oluşturma Tarihi</label>
            <span class="font-medium">{{ selectedProduct.createdAt }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Kapat" icon="pi pi-times" outlined @click="detailDialog = false" />
        <Button label="Düzenle" icon="pi pi-pencil" @click="editProduct(selectedProduct)" />
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
} = useProducts("/api/products")
</script>
