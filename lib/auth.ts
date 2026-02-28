import { useEffect, useState } from 'react'

interface User {
  id: string
  walletAddress: string
  authenticatedAt: number
}

// Hook para manejar sesiones de forma segura
export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión existente
    const checkSession = () => {
      try {
        const sessionData = sessionStorage.getItem('sati_session')
        
        if (sessionData) {
          const parsed = JSON.parse(sessionData) as User
          
          // Verificar que la sesión no sea muy antigua (24 horas)
          const SESSION_TIMEOUT = 24 * 60 * 60 * 1000
          const isExpired = Date.now() - parsed.authenticatedAt > SESSION_TIMEOUT
          
          if (isExpired) {
            // Sesión expirada, limpiar
            sessionStorage.removeItem('sati_session')
            setUser(null)
          } else {
            setUser(parsed)
          }
        }
      } catch {
        // Error parseando sesión, limpiar
        sessionStorage.removeItem('sati_session')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const logout = () => {
    sessionStorage.removeItem('sati_session')
    setUser(null)
    // Redirigir a home
    window.location.href = '/'
  }

  const isAuthenticated = !!user

  return { user, loading, logout, isAuthenticated }
}

// Función para sanitizar inputs
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim()
    .slice(0, 1000) // Limitar longitud
}

// Función para validar email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Función para validar contraseña
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Mínimo 8 caracteres' }
  }
  if (password.length > 128) {
    return { valid: false, message: 'Máximo 128 caracteres' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Al menos una mayúscula' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Al menos una minúscula' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Al menos un número' }
  }
  return { valid: true }
}
