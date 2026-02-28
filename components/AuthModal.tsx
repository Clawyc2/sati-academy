'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useActiveAccount } from "thirdweb/react";
import { ConnectEmbed } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from '@/lib/thirdweb';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeAccount = useActiveAccount();

  // Detectar cuando el usuario se conecta con Thirdweb
  useEffect(() => {
    if (activeAccount && !loading) {
      // Solo guardar address, no datos sensibles
      const user = {
        id: activeAccount.address,
        walletAddress: activeAccount.address,
        authenticatedAt: Date.now(),
      };
      
      // Usar sessionStorage en lugar de localStorage (más seguro)
      sessionStorage.setItem('sati_session', JSON.stringify(user));
      
      // Limpiar error si existe
      setError('');
      
      // Notificar éxito
      onSuccess();
    }
  }, [activeAccount, loading, onSuccess]);

  if (!isOpen) return null;

  // Configurar wallets de Thirdweb
  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "discord", 
          "email",
        ],
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
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl mb-3">🪙</div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              ¡Bienvenido a Sati Academy!
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Empieza a aprender Bitcoin hoy
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="px-4 py-3 rounded-xl mb-4 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {/* Thirdweb Auth */}
          <div className="thirdweb-container">
            <ConnectEmbed
              client={client}
              wallets={wallets}
              modalSize="compact"
              showThirdwebBranding={false}
              theme="dark"
            />
          </div>

          {/* Info */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>🔒 Tu wallet segura con Thirdweb</p>
            <p className="mt-1">Google, Discord o Email disponible</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
