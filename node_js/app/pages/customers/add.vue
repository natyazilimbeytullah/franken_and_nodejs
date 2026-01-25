<template>
  <div class="flex flex-column gap-4 fade-in">
    <!-- Header -->
    <div class="flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom-1 surface-border">
      <div class="flex align-items-center gap-3">
        <Button icon="pi pi-arrow-left" text rounded severity="secondary" @click="router.back()" />
        <div>
          <h1 class="text-2xl font-bold m-0 text-color">Yeni Müşteri Ekle</h1>
          <p class="text-color-secondary text-sm m-0 mt-1">Sisteme yeni bir müşteri kaydı oluşturun</p>
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
                <i class="pi pi-user text-primary"></i>
                <span class="text-lg font-semibold">Genel Bilgiler</span>
              </div>
            </template>
            <template #content>
              <!-- Avatar Upload Section -->
              <div class="flex justify-content-center mb-5">
                <div class="relative">
                  <div 
                    class="avatar-upload-container border-circle flex align-items-center justify-content-center cursor-pointer transition-all transition-duration-200" 
                    :class="avatarPreview ? '' : 'surface-100 hover:surface-200'"
                    style="width: 100px; height: 100px; border: 2px dashed var(--surface-300)"
                    @click="triggerFileUpload"
                  >
                    <div v-if="!avatarPreview" class="flex flex-column align-items-center text-color-secondary">
                      <i class="pi pi-camera text-2xl mb-1"></i>
                      <span class="text-xs">Fotoğraf Ekle</span>
                    </div>
                    <img v-else :src="avatarPreview" class="w-full h-full border-circle fit-cover" />
                    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelect" />
                  </div>
                  <Button 
                    v-if="avatarPreview" 
                    icon="pi pi-times" 
                    rounded 
                    severity="danger" 
                    size="small"
                    class="absolute" 
                    style="top: -5px; right: -5px; width: 1.75rem; height: 1.75rem;" 
                    @click.stop="removeAvatar" 
                  />
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="name" class="font-semibold text-color text-sm">
                      Ad Soyad / Firma Adı <span class="text-red-500">*</span>
                    </label>
                    <InputText 
                      id="name" 
                      v-model="customer.name" 
                      placeholder="Örn: Ahmet Yılmaz" 
                      :class="{'p-invalid': submitted && !customer.name}" 
                    />
                    <small v-if="submitted && !customer.name" class="p-error">Bu alan zorunludur.</small>
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="email" class="font-semibold text-color text-sm">
                      Email Adresi <span class="text-red-500">*</span>
                    </label>
                    <InputText 
                      id="email" 
                      v-model="customer.email" 
                      placeholder="ornek@sirket.com" 
                      type="email" 
                      :class="{'p-invalid': submitted && !customer.email}" 
                    />
                    <small v-if="submitted && !customer.email" class="p-error">Geçerli bir email giriniz.</small>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="phone" class="font-semibold text-color text-sm">
                      Telefon <span class="text-red-500">*</span>
                    </label>
                    <InputMask 
                      id="phone" 
                      v-model="customer.phone" 
                      mask="(999) 999 99 99" 
                      placeholder="(5XX) XXX XX XX" 
                      :class="{'p-invalid': submitted && !customer.phone}" 
                    />
                    <small v-if="submitted && !customer.phone" class="p-error">Telefon zorunludur.</small>
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="website" class="font-semibold text-color text-sm">Web Sitesi</label>
                    <div class="p-inputgroup">
                      <span class="p-inputgroup-addon">
                        <i class="pi pi-globe"></i>
                      </span>
                      <InputText id="website" v-model="customer.website" placeholder="www.ornek.com" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Finansal Bilgiler Card -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-wallet text-primary"></i>
                <span class="text-lg font-semibold">Finansal Bilgiler</span>
              </div>
            </template>
            <template #content>
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="taxOffice" class="font-semibold text-color text-sm">Vergi Dairesi</label>
                    <InputText id="taxOffice" v-model="customer.taxOffice" placeholder="Örn: Kadıköy" />
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="taxNumber" class="font-semibold text-color text-sm">Vergi / TC Kimlik No</label>
                    <InputText id="taxNumber" v-model="customer.taxNumber" placeholder="Örn: 1234567890" />
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
          <!-- Status & Segment -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-tag text-primary"></i>
                <span class="text-lg font-semibold">Durum ve Segment</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-column gap-4">
                <div class="flex flex-column gap-2">
                  <label for="status" class="font-semibold text-color text-sm">Müşteri Durumu</label>
                  <Select 
                    id="status"
                    v-model="customer.status" 
                    :options="statusOptions" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Durum Seçin" 
                    class="w-full"
                  />
                </div>
                <div class="flex flex-column gap-2">
                  <label for="segment" class="font-semibold text-color text-sm">Müşteri Segmenti</label>
                  <Select 
                    id="segment"
                    v-model="customer.segment" 
                    :options="segmentOptions" 
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Segment Seçin" 
                    class="w-full"
                  >
                    <template #option="slotProps">
                      <div class="flex align-items-center gap-2">
                        <Tag :value="slotProps.option.label" :severity="getSegmentSeverity(slotProps.option.value)" />
                      </div>
                    </template>
                  </Select>
                </div>
              </div>
            </template>
          </Card>

          <!-- Address Info -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-map-marker text-primary"></i>
                <span class="text-lg font-semibold">Adres Bilgileri</span>
              </div>
            </template>
            <template #content>
              <div class="flex flex-column gap-4">
                <div class="flex flex-column gap-2">
                  <label for="city" class="font-semibold text-color text-sm">Şehir</label>
                  <Select 
                    id="city"
                    v-model="customer.city" 
                    :options="cityOptions" 
                    placeholder="Şehir Seçin" 
                    class="w-full"
                    showClear
                    filter
                  />
                </div>
                <div class="flex flex-column gap-2">
                  <label for="district" class="font-semibold text-color text-sm">İlçe</label>
                  <InputText id="district" v-model="customer.district" placeholder="Örn: Kadıköy" />
                </div>
                <div class="flex flex-column gap-2">
                  <label for="address" class="font-semibold text-color text-sm">Açık Adres</label>
                  <Textarea 
                    id="address" 
                    v-model="customer.address" 
                    rows="3" 
                    placeholder="Mahalle, sokak, bina no..." 
                    autoResize 
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- Notes -->
          <Card>
            <template #title>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-file-edit text-primary"></i>
                <span class="text-lg font-semibold">Notlar</span>
              </div>
            </template>
            <template #content>
              <Textarea 
                v-model="customer.notes" 
                rows="4" 
                class="w-full" 
                placeholder="Müşteri hakkında özel notlar..." 
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
const { statusOptions, segmentOptions, cityOptions, getSegmentSeverity } = useCustomers()

definePageMeta({
  layout: 'default'
})

// State
const loading = ref(false)
const submitted = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)

const customer = ref({
  name: '',
  email: '',
  phone: '',
  website: '',
  taxOffice: '',
  taxNumber: '',
  status: 'Aktif',
  segment: 'Yeni',
  city: null,
  district: '',
  address: '',
  notes: ''
})

// Avatar Logic
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const onFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  avatarPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Save Logic
const save = async () => {
  submitted.value = true

  if (!customer.value.name || !customer.value.email || !customer.value.phone) {
    return // Validation failed
  }

  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // Here you would typically show a success toast and redirect
    console.log('Saved:', customer.value)
    router.push('/customers')
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
:deep(.p-inputmask) {
  width: 100%;
}

/* Input group addon styling */
:deep(.p-inputgroup-addon) {
  background: var(--surface-100);
  border-color: var(--surface-300);
  color: var(--text-color-secondary);
}
</style>
