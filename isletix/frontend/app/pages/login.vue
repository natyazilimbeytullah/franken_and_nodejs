<!-- filepath: /Volumes/Kodlooper/kodlooperYazilim/htdocs/_dev_lab/node_js/nuxtjs/nuxt_template_v3/app/pages/login.vue -->
<template>
  <LoginForm />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
import { useJwtAuth } from '~/composables/useJwtAuth'
import LoginForm from '../components/LoginForm.vue'

const { requireAuth } = useJwtAuth()
</script>