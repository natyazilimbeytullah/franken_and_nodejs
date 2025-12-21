<!-- filepath: /Volumes/Kodlooper/kodlooperYazilim/htdocs/_dev_lab/node_js/nuxtjs/nuxt_template_v3/app/components/LoginForm.vue -->
<template>
  <Card class="login-card">
    <template #header>
      <div class="card-header">
        <div class="logo-container">
          <i class="pi pi-lock" style="font-size: 2.5rem; color: var(--p-primary-color);"></i>
        </div>
        <h1 class="title">Hoş Geldiniz</h1>
        <p class="subtitle">Devam etmek için giriş yapın</p>
      </div>
    </template>

    <template #content>
      <Message v-if="error" severity="error" :closable="true" @close="error = ''" class="mb-4">
        {{ error }}
      </Message>

      <form @submit.prevent="onSubmit" class="login-form">
        <div class="field">
          <label for="email" class="field-label">E-posta</label>
          <IconField>
            <InputIcon class="pi pi-envelope" />
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              placeholder="ornek@email.com"
              class="w-full"
              required
            />
          </IconField>
        </div>

        <div class="field">
          <label for="password" class="field-label">Şifre</label>
          <IconField>
            <InputIcon class="pi pi-key" />
            <InputText
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full"
              required
              minlength="4"
            />
            <InputIcon 
              :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" 
              @click="showPassword = !showPassword"
              style="cursor: pointer;"
            />
          </IconField>
        </div>

        <div class="forgot-password">
          <NuxtLink to="/forgot" class="forgot-link">
            Şifremi unuttum
          </NuxtLink>
        </div>

        <Button
          type="submit"
          label="Giriş Yap"
          icon="pi pi-sign-in"
          :loading="loading"
          class="login-button"
        />
      </form>
    </template>
  </Card>

  <p class="footer-text">
    &copy; {{ new Date().getFullYear() }} Tüm hakları saklıdır.
  </p>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useJwtAuth } from '../composables/useJwtAuth'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    name?: string
  }
}

const router = useRouter()
const { setUser } = useAuth()
const { setToken, requireGuest } = useJwtAuth()

const form = ref({ email: 'erp@gmail.com', password: 'erp123' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Sayfa yüklendiğinde token kontrolü
onMounted(() => {
  requireGuest()
})

const onSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    // Geçerli token - exp: 1767225600 (1 Ocak 2026)
    // https://jwt.io/ üzerinden oluşturabilirsiniz
    /*setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoiZXJwQGdtYWlsLmNvbSIsImV4cCI6MTc2NzIyNTYwMH0.QF4TA2S0YRrPHdGmxHXJB9LxEGHQYKWL_4Hj4VfY8-I")
    setUser({ id: 1, email: form.value.email, name: "Test User" })*/

    // Gerçek API çağrısı
    const response = await $fetch<LoginResponse>('http://127.0.0.1/api/auth/login', {
      method: 'POST',
      body: form.value,
    })
    router.push('/')

  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; message?: string }
    error.value = err?.data?.message || err?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.card-header {
  text-align: center;
  padding: 2rem 2rem 0;
}

.logo-container {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.forgot-password {
  text-align: right;
  margin-top: -0.5rem;
}

.forgot-link {
  color: #667eea;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.875rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
}

.footer-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  margin-top: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.w-full {
  width: 100%;
}
</style>