<template>
    <!-- Template Create Lists Example -->
    <Card>
      <template #title>
        <span class="text-lg font-semibold">Stok Listesi</span>
      </template>
      <template #content>
        <TemplateCreateLists 
          :schema="tableSchema"
          url="/api/products"
          :elements="elements"
        />
      </template>
    </Card>
</template>

<script setup lang="ts">

// Table Schema for Template Component
const tableSchema = [
  { field: 'name', header: 'Ürün', sortable: true },
  { field: 'category', header: 'Kategori', sortable: true },
  { field: 'brand', header: 'Marka', sortable: true },
  { field: 'stock', header: 'Stok', sortable: true },
  { field: 'price', header: 'Fiyat', sortable: true },
  { field: 'status', header: 'Durum', sortable: true },
  { field: 'createdAt', header: 'Oluşturma Tarihi', sortable: true }
]

const elements = ref(['top', 'table'])

</script>