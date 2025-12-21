interface JwtPayload {
  exp?: number
  iat?: number
  [key: string]: unknown
}

export class JwtAuthController {
  private static instance: JwtAuthController
  private tokenKey = 'auth_token'

  static getInstance(): JwtAuthController {
    if (!JwtAuthController.instance) {
      JwtAuthController.instance = new JwtAuthController()
    }
    return JwtAuthController.instance
  }

  getToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  setToken(token: string): void {
    if (import.meta.client) {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  removeToken(): void {
    if (import.meta.client) {
      localStorage.removeItem(this.tokenKey)
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) return null
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token)
    if (!payload || !payload.exp) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    return !this.isTokenExpired(token)
  }

  checkAuthAndRedirect(): void {
    const router = useRouter()
    
    if (this.isAuthenticated()) {
      router.push('/')
    } else {
      this.removeToken()
      router.push('/login')
    }
  }

  requireAuth(): boolean {
    const router = useRouter()
    
    if (!this.isAuthenticated()) {
      this.removeToken()
      router.push('/login')
      return false
    }
    return true
  }

  requireGuest(): boolean {
    const router = useRouter()
    
    if (this.isAuthenticated()) {
      router.push('/dashboard')
      return false
    }
    return true
  }
}

export const useJwtAuth = () => {
  const jwtAuth = JwtAuthController.getInstance()

  return {
    jwtAuth,
    getToken: () => jwtAuth.getToken(),
    setToken: (token: string) => jwtAuth.setToken(token),
    removeToken: () => jwtAuth.removeToken(),
    isAuthenticated: () => jwtAuth.isAuthenticated(),
    checkAuthAndRedirect: () => jwtAuth.checkAuthAndRedirect(),
    requireAuth: () => jwtAuth.requireAuth(),
    requireGuest: () => jwtAuth.requireGuest()
  }
}
