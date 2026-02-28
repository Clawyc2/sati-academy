'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

// Error Boundary para prevenir crashes y no exponer errores sensibles
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Solo loggear en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado:', error, errorInfo)
    }
    
    // En producción, enviar a servicio de monitoreo si existe
    // Ejemplo: Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Algo salió mal
            </h1>
            <p className="text-gray-400 mb-6">
              Ocurrió un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
