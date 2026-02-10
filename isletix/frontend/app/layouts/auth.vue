<!-- filepath: /Volumes/Kodlooper/kodlooperYazilim/htdocs/_dev_lab/node_js/nuxtjs/nuxt_template_v3/app/layouts/auth.vue -->
<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-wrapper {
  width: 100%;
  max-width: 420px;
}
</style>