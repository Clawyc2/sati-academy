'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'initial'>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!email.trim()) {
      return 'El correo es requerido';
    }
    if (!validateEmail(email)) {
      return 'Ingresa un correo válido';
    }
    if (!password.trim()) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (mode === 'signup' && !name.trim()) {
      return 'El nombre es requerido';
    }
    return null;
  };

  const getErrorMessage = (error: any): string => {
    const message = error?.message || error?.toString() || '';
    
    if (message.includes('Invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Confirma tu correo antes de entrar.';
    }
    if (message.includes('User not found') || message.includes('user not found')) {
      return 'No existe una cuenta con ese correo.';
    }
    if (message.includes('already registered') || message.includes('already exists')) {
      return 'Este correo ya está registrado. Intenta iniciar sesión.';
    }
    if (message.includes('Password should be at least')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    
    return 'Algo salió mal. Intenta de nuevo.';
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/aprender`
        }
      });
      
      if (error) {
        setError(getErrorMessage(error));
        return;
      }
      
      // OAuth will redirect, so we don't call onSuccess here
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });
        
        if (signUpError) {
          setError(getErrorMessage(signUpError));
          return;
        }
        
        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities?.length === 0) {
            setError('Revisa tu correo para confirmar tu cuenta.');
            return;
          }
          onSuccess();
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          setError(getErrorMessage(signInError));
          return;
        }
        
        if (data.user) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🪙</div>
            <h2 className="text-2xl font-bold mb-2">
              {mode === 'initial' && '¡Bienvenido a Sati Academy!'}
              {mode === 'login' && 'Inicia Sesión'}
              {mode === 'signup' && 'Crea tu Cuenta'}
            </h2>
            <p className="text-gray-400">
              {mode === 'initial' && 'Empieza a aprender Bitcoin hoy'}
              {mode === 'login' && 'Continúa tu aprendizaje'}
              {mode === 'signup' && 'Únete a la comunidad'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {mode === 'initial' && (
            <div className="space-y-4">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5" />
                    Continuar con Google
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <span className="relative bg-gray-900 px-4 text-sm text-gray-500">o</span>
              </div>

              {/* Email Sign Up */}
              <button
                onClick={() => setMode('signup')}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-orange-400 hover:to-amber-400 transition-all"
              >
                Registrarse con Email
              </button>

              {/* Already have account */}
              <button
                onClick={() => setMode('login')}
                className="w-full px-6 py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-medium hover:border-orange-500 hover:text-orange-400 transition-all"
              >
                Ya tengo cuenta
              </button>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white placeholder-gray-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-orange-400 hover:to-amber-400 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  mode === 'signup' ? 'Crear Cuenta' : 'Iniciar Sesión'
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('initial')}
                className="w-full text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                ← Volver
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
