<template>
  <div :class="schema.col || 'col-12'">
    <div class="flex flex-column gap-2">
      <label v-if="schema.label" :for="schema.name" class="font-semibold text-color text-sm">
        {{ schema.label }}
        <span v-if="schema.required" class="text-red-500">*</span>
      </label>
      
      <div v-if="schema.addon" class="input-with-icon">
        <i :class="schema.addon" class="input-icon"></i>
        <InputText 
          :id="schema.name"
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          :placeholder="schema.placeholder"
          :class="{'p-invalid': schema.error, 'with-icon': true}"
        />
      </div>
      
      <InputText 
        v-else
        :id="schema.name"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :placeholder="schema.placeholder"
        :class="{'p-invalid': schema.error}"
      />
      
      <small v-if="schema.error" class="p-error">{{ schema.errorMessage || 'Bu alan zorunludur.' }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style scoped>
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  z-index: 1;
  color: var(--text-color-secondary);
  pointer-events: none;
}

.input-with-icon :deep(.p-inputtext) {
  width: 100%;
}

.input-with-icon :deep(.p-inputtext.with-icon) {
  padding-left: 2.5rem;
}
</style>