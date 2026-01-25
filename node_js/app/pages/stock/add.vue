<template>
  <div class="flex flex-column gap-4 fade-in">
    <!-- Header -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom-1 surface-border">
      <div class="flex align-items-center gap-3">
        <Button icon="pi pi-arrow-left" text rounded severity="secondary" @click="router.back()" />
        <div>
          <h1 class="text-2xl font-bold m-0 text-color">Yeni Ürün Ekle</h1>
          <p class="text-color-secondary text-sm m-0 mt-1">Sisteme yeni bir ürün kaydı oluşturun</p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button label="İptal" icon="pi pi-times" outlined severity="secondary" @click="router.back()" />
        <Button label="Kaydet" icon="pi pi-check" @click="save" :loading="loading" />
      </div>
    </div>

    <div class="grid">
      <!-- Main Info -->
      <div class="col-12 lg:col-8">
        <div class="flex flex-column gap-4">
          <!-- Genel Bilgiler Card -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-box text-primary"></i>
                <span class="text-lg font-semibold">Genel Bilgiler</span>
              </div>
            </template>
            <template #content>
              <!-- Product Image Upload Section -->
              <div class="flex justify-content-center mb-5">
                <div class="relative">
                  <div 
                    class="image-upload-container border-round flex align-items-center justify-content-center cursor-pointer transition-all transition-duration-200" 
                    :class="imagePreview ? '' : 'surface-100 hover:surface-200'"
                    style="width: 200px; height: 200px; border: 2px dashed var(--surface-300)"
                    @click="triggerFileUpload"
                  >
                    <div v-if="!imagePreview" class="flex flex-column align-items-center text-color-secondary">
                      <i class="pi pi-image text-4xl mb-2"></i>
                      <span class="text-sm font-semibold">Ürün Görseli Ekle</span>
                      <span class="text-xs mt-1">Tıklayın veya sürükleyin</span>
                    </div>
                    <img v-else :src="imagePreview" class="w-full h-full border-round fit-cover" />
                    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelect" />
                  </div>
                  <Button 
                    v-if="imagePreview" 
                    icon="pi pi-times" 
                    rounded 
                    severity="danger" 
                    size="small"
                    class="absolute" 
                    style="top: -5px; right: -5px; width: 1.75rem; height: 1.75rem;" 
                    @click.stop="removeImage" 
                  />
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="name" class="font-semibold text-color text-sm">
                      Ürün Adı <span class="text-red-500">*</span>
                    </label>
                    <InputText 
                      id="name" 
                      v-model="product.name" 
                      placeholder="Örn: Apple iPhone 15 Pro" 
                      :class="{'p-invalid': submitted && !product.name}" 
                    />
                    <small v-if="submitted && !product.name" class="p-error">Bu alan zorunludur.</small>
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="sku" class="font-semibold text-color text-sm">
                      SKU <span class="text-red-500">*</span>
                    </label>
                    <div class="p-inputgroup">
                      <span class="p-inputgroup-addon">
                        <i class="pi pi-barcode"></i>
                      </span>
                      <InputText 
                        id="sku" 
                        v-model="product.sku" 
                        placeholder="SKU-00001" 
                        :class="{'p-invalid': submitted && !product.sku}" 
                      />
                    </div>
                    <small v-if="submitted && !product.sku" class="p-error">SKU zorunludur.</small>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="category" class="font-semibold text-color text-sm">
                      Kategori <span class="text-red-500">*</span>
                    </label>
                    <Select 
                      id="category"
                      v-model="product.category" 
                      :options="categoryOptions" 
                      placeholder="Kategori Seçin" 
                      class="w-full"
                      :class="{'p-invalid': submitted && !product.category}"
                    />
                    <small v-if="submitted && !product.category" class="p-error">Kategori zorunludur.</small>
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="brand" class="font-semibold text-color text-sm">
                      Marka <span class="text-red-500">*</span>
                    </label>
                    <Select 
                      id="brand"
                      filter 
                      v-model="product.brand" 
                      :options="brandOptions" 
                      placeholder="Marka Seçin" 
                      class="w-full"
                      :class="{'p-invalid': submitted && !product.brand}"
                    />
                    <small v-if="submitted && !product.brand" class="p-error">Marka zorunludur.</small>
                  </div>
                </div>

                <div class="col-12">
                  <div class="flex flex-column gap-2">
                    <label for="description" class="font-semibold text-color text-sm">Ürün Açıklaması</label>
                    <Textarea 
                      id="description" 
                      v-model="product.description" 
                      rows="4" 
                      placeholder="Ürün hakkında detaylı açıklama..." 
                      autoResize 
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Fiyat ve Stok Bilgileri Card -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-dollar text-primary"></i>
                <span class="text-lg font-semibold">Fiyat ve Stok Bilgileri</span>
              </div>
            </template>
            <template #content>
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="price" class="font-semibold text-color text-sm">
                      Fiyat (₺) <span class="text-red-500">*</span>
                    </label>
                    <InputNumber 
                      id="price" 
                      v-model="product.price" 
                      mode="currency" 
                      currency="TRY" 
                      locale="tr-TR"
                      placeholder="0,00 ₺"
                      :class="{'p-invalid': submitted && !product.price}"
                      :min="0"
                    />
                    <small v-if="submitted && !product.price" class="p-error">Fiyat zorunludur.</small>
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="stock" class="font-semibold text-color text-sm">
                      Stok Miktarı <span class="text-red-500">*</span>
                    </label>
                    <InputNumber 
                      id="stock" 
                      v-model="product.stock" 
                      placeholder="0"
                      :class="{'p-invalid': submitted && product.stock === null}"
                      :min="0"
                      showButtons
                      buttonLayout="horizontal"
                      :step="1"
                    >
                      <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                      </template>
                      <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                      </template>
                    </InputNumber>
                    <small v-if="submitted && product.stock === null" class="p-error">Stok miktarı zorunludur.</small>
                  </div>
                </div>

                <div class="col-12">
                  <div class="surface-100 border-round p-3">
                    <div class="flex align-items-center gap-2 mb-2">
                      <i class="pi pi-info-circle text-primary"></i>
                      <span class="font-semibold text-sm">Stok Durumu Önizlemesi</span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <Tag 
                        v-if="product.stock !== null"
                        :value="`${product.stock} adet - ${getStockStatusText(product.stock)}`" 
                        :severity="getStockSeverityLocal(product.stock)"
                        :icon="product.stock === 0 ? 'pi pi-times' : product.stock <= 50 ? 'pi pi-exclamation-triangle' : 'pi pi-check'"
                      />
                      <span v-else class="text-color-secondary text-sm">Stok miktarı girilmedi</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="col-12 lg:col-4">
        <div class="flex flex-column gap-4">
          <!-- Status -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-tag text-primary"></i>
                <span class="text-lg font-semibold">Durum</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-column gap-4">
                <div class="flex flex-column gap-2">
                  <label for="status" class="font-semibold text-color text-sm">Ürün Durumu</label>
                  <Select 
                    id="status"
                    v-model="product.status" 
                    :options="statusOptions" 
                    filter 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Durum Seçin" 
                    class="w-full"
                  >
                    <template #option="slotProps">
                      <div class="flex align-items-center gap-2">
                        <Tag :value="slotProps.option.label" :severity="getStatusSeverityLocal(slotProps.option.value)" />
                      </div>
                    </template>
                  </Select>
                </div>
              </div>
            </template>
          </Card>

          <!-- Quick Info -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-info-circle text-primary"></i>
                <span class="text-lg font-semibold">Hızlı Bilgi</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-column gap-3">
                <div class="flex justify-content-between align-items-center p-2 surface-50 border-round">
                  <span class="text-sm text-color-secondary">Oluşturma Tarihi</span>
                  <span class="text-sm font-semibold">{{ currentDate }}</span>
                </div>
                <div class="flex justify-content-between align-items-center p-2 surface-50 border-round">
                  <span class="text-sm text-color-secondary">Son Güncelleme</span>
                  <span class="text-sm font-semibold">{{ currentDate }}</span>
                </div>
                <Divider />
                <div class="flex flex-column gap-2">
                  <div class="flex align-items-center gap-2 text-color-secondary text-xs">
                    <i class="pi pi-check-circle text-green-500"></i>
                    <span>Tüm zorunlu alanları doldurun</span>
                  </div>
                  <div class="flex align-items-center gap-2 text-color-secondary text-xs">
                    <i class="pi pi-check-circle text-green-500"></i>
                    <span>Ürün görseli ekleyin (önerilen)</span>
                  </div>
                  <div class="flex align-items-center gap-2 text-color-secondary text-xs">
                    <i class="pi pi-check-circle text-green-500"></i>
                    <span>Detaylı açıklama yazın</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Additional Notes -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-file-edit text-primary"></i>
                <span class="text-lg font-semibold">Ek Notlar</span>
              </div>
            </template>
            <template #content>
              <Textarea 
                v-model="product.notes" 
                rows="4" 
                class="w-full" 
                placeholder="Ürün hakkında özel notlar veya hatırlatmalar..." 
                autoResize 
              />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { statusOptions, categoryOptions, brandOptions, getStatusSeverity, getStockSeverity, getStockStatus } = useProducts()

definePageMeta({
  layout: 'default'
})

// State
const loading = ref(false)
const submitted = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)

const product = ref({
  name: '',
  sku: '',
  category: null as string | null,
  brand: null as string | null,
  price: null as number | null,
  stock: null as number | null,
  status: 'Aktif',
  description: '',
  notes: ''
})

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('tr-TR')
})

// Image Logic
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const onFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Helper functions
const getStatusSeverityLocal = (status: string) => {
  return getStatusSeverity(status)
}

const getStockSeverityLocal = (stock: number) => {
  return getStockSeverity(stock)
}

const getStockStatusText = (stock: number) => {
  return getStockStatus(stock)
}

// Save Logic
const save = async () => {
  submitted.value = true

  if (!product.value.name || !product.value.sku || !product.value.category || 
      !product.value.brand || product.value.price === null || product.value.stock === null) {
    return // Validation failed
  }

  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // Here you would typically show a success toast and redirect
    console.log('Saved:', product.value)
    router.push('/stock')
  }, 1000)
}
</script>

<style scoped>
.fit-cover {
  object-fit: cover;
}

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

/* Card title improvements */
:deep(.p-card-title) {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
  margin-bottom: 1rem;
}

/* Form input improvements */
:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-textarea),
:deep(.p-inputnumber) {
  width: 100%;
}

/* Input group addon styling */
:deep(.p-inputgroup-addon) {
  background: var(--surface-100);
  border-color: var(--surface-300);
  color: var(--text-color-secondary);
}

/* Image upload hover effect */
.image-upload-container:hover {
  border-color: var(--primary-color);
}

/* InputNumber button styling */
:deep(.p-inputnumber-button) {
  width: 2.5rem;
}

:deep(.p-inputnumber-button .p-button-icon) {
  font-size: 0.875rem;
}
</style>
