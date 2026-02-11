<template>
  <div class="prompt-container">
    <div class="form-section">
      <h1>Schema Oluşturucu</h1>
      
      <div class="input-group">
        <label for="pageName">Sayfa Adı:</label>
        <input 
          id="pageName"
          v-model="pageName" 
          type="text" 
          placeholder="Örn: urunler"
        >
      </div>

      <div class="input-group">
        <label for="description">Açıklama:</label>
        <input 
          id="description"
          v-model="description" 
          type="text" 
          placeholder="Örn: Ürün tablosu"
          @keyup.enter="generateSchema"
        >
      </div>
      
      <button 
        @click="generateSchema" 
        :disabled="loading || !description.trim()"
        class="generate-btn"
      >
        {{ loading ? 'Oluşturuluyor...' : 'OLUŞTUR' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <strong>Hata:</strong> {{ error }}
    </div>

    <div v-if="result" class="result-section">
      <h2>Sonuç:</h2>
      <pre class="result-content">{{ JSON.stringify(result, null, 2) }}</pre>
      
      <button 
        @click="saveToFile" 
        :disabled="!result || !pageName.trim()"
        class="save-btn"
      >
        KAYDET
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pageName = ref('')
const description = ref('Ürün tablosu')
const result = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const generateSchema = async () => {
  if (!description.value.trim()) {
    error.value = 'Lütfen bir açıklama girin'
    return
  }

  loading.value = true
  error.value = null
  result.value = null

  try {
    const url = `http://localhost:8000/generate-schema?description=${encodeURIComponent(description.value)}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    result.value = data
  } catch (err: any) {
    error.value = err.message || 'Bir hata oluştu'
    console.error('Schema generation error:', err)
  } finally {
    loading.value = false
  }
}

const saveToFile = async () => {
  if (!result.value || !pageName.value.trim()) {
    error.value = 'Sonuç ve sayfa adı gerekli'
    return
  }

  loading.value = true // Re-use loading state or add specific saving state if needed

  try {
    const response = await $fetch('/api/save-schema', {
      method: 'POST',
      body: {
        filename: pageName.value.trim(),
        content: result.value
      }
    })

    alert(`Schema başarıyla kaydedildi!\nDosya Yolu: ${response.path}`)
    error.value = null
  } catch (err: any) {
    error.value = 'Dosya kaydedilirken hata oluştu: ' + (err.data?.message || err.message)
    console.error('Save error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.prompt-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

h1 {
  margin-top: 0;
  color: #333;
  font-size: 1.8rem;
}

h2 {
  color: #555;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input[type="text"]:focus {
  outline: none;
  border-color: #4CAF50;
}

.generate-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.generate-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.generate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #f44336;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.result-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.result-content {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.save-btn {
  background-color: #2196F3;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
  width: 100%;
}

.save-btn:hover:not(:disabled) {
  background-color: #0b7dda;
}

.save-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
