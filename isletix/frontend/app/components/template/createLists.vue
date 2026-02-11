<template>

  <Card class="filter-card" v-if="elements.find((e:string) => e == 'top')">
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

  <DataTable 
    v-bind="$attrs"
    :value="products"
  >
    <Column 
      v-for="(column, index) in schema" 
      :key="index"
      :field="column.field"
      :header="column.header"
      :sortable="column.sortable !== false"
    >
      <template #body="{ data: rowData }">
        <span>{{ rowData[column.field] }}</span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
interface ColumnSchema {
  field: string
  header: string
  sortable?: boolean
}

const props = defineProps<{
  schema: ColumnSchema[]
  url: string,
  elements?: any
}>()

const { isMobile, isDesktop, isLargeDesktop } = useWindowSize()
const { products, filters, statusOptions, categoryOptions, brandOptions, stockStatusOptions,  loading, totalRecords, lazyParams, onPage, onSort, onFilter, applyFilters, clearFilters } = useProducts(props.url)

</script>