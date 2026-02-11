<template>
  <div :class="schema.col || 'col-12'">
    <div class="flex flex-column gap-2">
      <label v-if="schema.label" :for="schema.name" class="font-semibold text-color text-sm">
        {{ schema.label }}
        <span v-if="schema.required" class="text-red-500">*</span>
      </label>
      
      <Textarea 
        :id="schema.name"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :placeholder="schema.placeholder"
        :rows="schema.rows || 4"
        :autoResize="schema.autoResize !== false"
        :class="{'p-invalid': schema.error}"
      />
      
      <small v-if="schema.error" class="p-error">{{ schema.errorMessage || 'Bu alan zorunludur.' }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea';

defineProps({
  schema: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
