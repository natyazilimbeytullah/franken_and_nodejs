export const useAuth = () => {
  const user = useState('auth_user', () => null as null | { id: number; name: string; email: string })

  const setUser = (u: any) => {
    user.value = u
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_token')
  }

  return { user, setUser, logout }
}
