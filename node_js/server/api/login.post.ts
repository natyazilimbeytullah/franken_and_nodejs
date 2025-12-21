import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}

  // Basit stub: gerçek projede DB ve şifre kontrolü yapılmalı
  if (email === 'admin@site.test' && password === 'password') {
    return {
      token: 'fake-jwt-token-123456',
      user: {
        id: 1,
        name: 'Admin Kullanıcı',
        email: 'admin@site.test'
      }
    }
  }

  throw createError({ statusCode: 401, statusMessage: 'Geçersiz e-posta veya parola' })
})
