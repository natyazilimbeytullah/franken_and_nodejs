<template>
  <TemplateFormsCreateForm :schema="formSchema" :schemaOptions="schemaOptions" />
</template>

<script setup lang="ts">
import TemplateFormsCreateForm from '~/components/template/createForm.vue'

const router = useRouter()

definePageMeta({
  layout: 'default'
})

// Form şeması - Buradan kolayca yönetebilirsiniz
const formSchema = ref(
  [
  {
    type: 'input',
    name: 'stock_name',
    label: 'Ürün Adı',
    placeholder: 'Örn: Apple iPhone 15 Pro',
    col: 'col-12 md:col-6',
    required: true,
    error: false
  },
  {
    type: 'input',
    name: 'sku',
    label: 'SKU',
    placeholder: 'SKU-00001',
    col: 'col-12 md:col-6',
    required: true,
    addon: 'pi pi-barcode',
    error: false
  },
  {
    type: 'input',
    name: 'brand',
    label: 'Marka',
    placeholder: 'Marka adı',
    col: 'col-12 md:col-6',
    required: true,
    error: false
  },
  {
    type: 'input',
    name: 'category',
    label: 'Kategori',
    placeholder: 'Kategori adı',
    col: 'col-12 md:col-6',
    required: false,
    error: false
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'Ürün Açıklaması',
    placeholder: 'Ürün hakkında detaylı açıklama...',
    col: 'col-12',
    rows: 4,
    autoResize: true,
    required: false,
    error: false
  },
  {
    type: 'textarea',
    name: 'notes',
    label: 'Ek Notlar',
    placeholder: 'Ürün hakkında özel notlar...',
    col: 'col-12',
    rows: 3,
    required: false,
    error: false
  },
  {
    type: 'input',
    name: 'notes',
    label: 'Ek Notlar 2',
    placeholder: 'Ürün hakkında özel notlar...',
    col: 'col-12',
    rows: 3,
    required: false,
    error: false
  },
  {
    type: 'textarea',
    name: 'notes',
    label: 'Turgay',
    placeholder: 'Turgay hakkında özel notlar özel notlar...',
    col: 'col-12',
    rows: 3,
    required: false,
    error: false
  },
  
  {
    type: 'input',
    name: 'notes',
    label: 'İRfan',
    placeholder: 'İRfan hakkında özel notlar özel notlar...',
    col: 'col-12',
    rows: 3,
    required: false,
    error: false
  },
])

const schemaOptions = ref({
  title: 'Müşteriler',
  description: null
})

</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

:deep(.p-card-title) {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
  margin-bottom: 1rem;
}
</style>
