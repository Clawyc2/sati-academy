'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useActiveAccount } from "thirdweb/react";
import { ConnectEmbed } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '@/lib/thirdweb';
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
  const [success, setSuccess] = useState('');

  const activeAccount = useActiveAccount();

  // Detectar cuando el usuario se conecta con Thirdweb
  useEffect(() => {
    if (activeAccount && !loading) {
      // Usuario conectado con wallet
      handleThirdwebAuth(activeAccount.address);
    }
  }, [activeAccount, loading]);

  const handleThirdwebAuth = async (walletAddress: string) => {
    try {
      // TODO: Cuando las tablas estén creadas, guardar en Supabase
      // Por ahora solo notificar éxito
      console.log('✅ Wallet conectada:', walletAddress);
      
      setSuccess('¡Bienvenido a Sati Academy!');
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      console.error('Error en Thirdweb auth:', err);
      setError('Error al conectar. Intenta de nuevo.');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!email.trim()) return 'El correo es requerido';
    if (!validateEmail(email)) return 'Ingresa un correo válido';
    if (!password.trim()) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (mode === 'signup' && !name.trim()) return 'El nombre es requerido';
    return null;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let result;
      
      if (mode === 'signup') {
        // Registrar con Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        
        if (signUpError) throw signUpError;
        result = data;
        
        // TODO: Crear perfil en sati_users cuando la tabla exista
        // Se creará automáticamente con el trigger en Supabase
        
      } else {
        // Login con Supabase Auth
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        result = data;
        
        // TODO: Actualizar last_active_at cuando la tabla exista
        // if (result.user) {
        //   await supabase.from('sati_users')
        //     .update({ last_active_at: new Date().toISOString() })
        //     .eq('id', result.user.id);
        // }
      }
      
      setSuccess('¡Bienvenido a Sati Academy!');
      setTimeout(() => onSuccess(), 1000);
      
    } catch (err: any) {
      console.error('Error en auth:', err);
      
      // Mensajes de error amigables
      if (err.message?.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos');
      } else if (err.message?.includes('already registered')) {
        setError('Este correo ya está registrado');
      } else if (err.message?.includes('Password')) {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setError('Error en la autenticación. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Configurar wallets de Thirdweb
  const wallets = [
    inAppWallet({
      auth: {
        options: ["google", "discord", "email"],
        mode: "popup",
      },
    }),
  ];

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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-700 shadow-2xl relative max-h-[90vh] overflow-y-auto"
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
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl mb-3">🪙</div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {mode === 'initial' && '¡Bienvenido a Sati Academy!'}
              {mode === 'login' && 'Inicia Sesión'}
              {mode === 'signup' && 'Crea tu Cuenta'}
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              {mode === 'initial' && 'Empieza a aprender Bitcoin hoy'}
              {mode === 'login' && 'Continúa tu aprendizaje'}
              {mode === 'signup' && 'Únete a la comunidad'}
            </p>
          </div>

          {/* Error/Success message */}
          {(error || success) && (
            <div className={`px-4 py-3 rounded-xl mb-4 text-sm ${
              success 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {success || error}
            </div>
          )}

          {mode === 'initial' && (
            <div className="space-y-3">
              {/* Thirdweb Wallet */}
              <div className="thirdweb-container">
                <ConnectEmbed
                  client={client}
                  wallets={wallets}
                  modalSize="compact"
                  showThirdwebBranding={false}
                  theme="dark"
                />
              </div>

              <div className="relative flex items-center justify-center my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <span className="relative bg-gray-900 px-4 text-sm text-gray-500">o</span>
              </div>

              {/* Email Sign Up */}
              <button
                onClick={() => setMode('signup')}
                className="w-full px-6 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-orange-400 hover:to-amber-400 transition-all text-sm md:text-base"
              >
                Registrarse con Email
              </button>

              {/* Already have account */}
              <button
                onClick={() => setMode('login')}
                className="w-full px-6 py-3 md:py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-medium hover:border-orange-500 hover:text-orange-400 transition-all text-sm md:text-base"
              >
                Ya tengo cuenta
              </button>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white placeholder-gray-500 text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white placeholder-gray-500 text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-orange-500 focus:outline-none text-white placeholder-gray-500 text-sm md:text-base"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-orange-400 hover:to-amber-400 transition-all disabled:opacity-50 text-sm md:text-base"
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
