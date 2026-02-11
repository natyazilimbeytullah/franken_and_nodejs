<template>



  <div class="flex flex-column gap-4 fade-in">
    <!--<div class="flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom-1 surface-border">
      <div class="flex align-items-center gap-3">
        <Button icon="pi pi-arrow-left" text rounded severity="secondary"/>
        <div>
          <h1 class="text-2xl font-bold m-0 text-color" v-if="schemaOptions.title">{{ schemaOptions.title }}</h1>
          <p class="text-color-secondary text-sm m-0 mt-1" v-if="schemaOptions.description">{{ schemaOptions.description }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button label="İptal" icon="pi pi-times" outlined severity="secondary" />
        <Button label="Kaydet" icon="pi pi-check" @click="save" :loading="loading" />
      </div>
    </div>-->

    <Card>
      <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-box text-primary"></i>
          <span class="text-lg font-semibold">{{ schemaOptions.title }}</span>
        </div>
      </template>
      <template #content> 
        <div class="grid">
          <component
            v-for="(field, index) in schema"
            :key="index"
            :is="getComponent(field.type)"
            :schema="field"
            :modelValue="formData[field.name]"
            @update:modelValue="(value: any) => updateField(field.name, value)"
          />
        </div>
      </template>
    </Card>
  </div>
 
</template>

<script setup lang="ts">
import TemplateFormsInput from './forms/input.vue'
import TemplateFormsTextarea from './forms/textarea.vue'

const loading = ref(false)

interface FieldSchema {
  type: string
  name: string
  label?: string
  placeholder?: string
  col?: string
  required?: boolean
  error?: boolean
  errorMessage?: string
  addon?: string
  rows?: number
  autoResize?: boolean
  [key: string]: any
}

const props = defineProps<{
  schema: FieldSchema[],
  schemaOptions: {
    title: string | null,
    description: string | null
  }
}>()

const formData = defineModel<Record<string, any>>({ default: () => ({}) })

const getComponent = (type: string) => {
  const components: Record<string, any> = {
    'input': TemplateFormsInput,
    'textarea': TemplateFormsTextarea
  }
  return components[type] || TemplateFormsInput
}

const updateField = (fieldName: string, value: any) => {
  formData.value[fieldName] = value
}


const save = () => {
  loading.value = true
}
</script>
