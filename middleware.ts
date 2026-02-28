import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting simple basado en IP (en memoria)
const rateLimit = new Map<string, { count: number; lastRequest: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto
const RATE_LIMIT_MAX = 10 // 10 requests por minuto

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const path = request.nextUrl.pathname

  // Solo aplicar rate limiting a rutas sensibles
  if (path.includes('/api/auth') || path.includes('/api/login')) {
    const now = Date.now()
    const userLimit = rateLimit.get(ip)

    if (userLimit) {
      // Si pasó el tiempo de ventana, reiniciar contador
      if (now - userLimit.lastRequest > RATE_LIMIT_WINDOW) {
        rateLimit.set(ip, { count: 1, lastRequest: now })
      } else if (userLimit.count >= RATE_LIMIT_MAX) {
        // Rate limit excedido
        return new NextResponse(
          JSON.stringify({ error: 'Demasiadas solicitudes. Intenta más tarde.' }),
          { 
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      } else {
        // Incrementar contador
        rateLimit.set(ip, { 
          count: userLimit.count + 1, 
          lastRequest: now 
        })
      }
    } else {
      rateLimit.set(ip, { count: 1, lastRequest: now })
    }
  }

  // Agregar headers de seguridad a todas las respuestas
  const response = NextResponse.next()
  
  // Prevenir que la respuesta sea cacheada si contiene datos sensibles
  if (path.includes('/api/') || path.includes('/aprender')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/aprender/:path*',
  ],
}
