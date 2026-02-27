'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Trophy, Users, Bitcoin, Sparkles, Play, ChevronRight
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { STAGES_CONFIG } from '@/lib/constants';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  const handleStartNow = () => {
    setShowAuth(true);
  };

  // Features verticales con imágenes
  const features = [
    {
      icon: BookOpen,
      title: 'Aprende Jugando',
      description: 'Sati te lleva paso a paso por lecciones cortas con ejemplos de la vida real. Practicas en simuladores sin arriesgar un solo satoshi cuando quieras avanzar, el conocimiento ya está en tu cabeza.',
      image: '/images/lessons/aprende-jugando.png',
      color: 'orange',
    },
    {
      icon: Trophy,
      title: 'Badges Únicos',
      description: 'Cada etapa que dominas te da una insignia que nadie te puede quitar. Son tuyas, las ganaste con conocimiento. Desde tu primer "¿qué es Bitcoin?" hasta convertirte en Liquidity Master.',
      image: '/images/lessons/badges-unicos.png',
      color: 'amber',
    },
    {
      icon: Users,
      title: 'Ranking Global',
      description: '¿Quién sabe más Bitcoin en México? Aquí se demuestra. Mantén tu racha diaria, saca 100% en los exámenes y escala posiciones en tiempo real contra toda la comunidad.',
      image: '/images/lessons/ranking-global.png',
      color: 'purple',
    },
    {
      icon: Bitcoin,
      title: 'Gana $SATI',
      description: 'Aprender tiene recompensa real. Al completar cada etapa desbloqueas un cofre con tokens $SATI en la red de Bitcoin. Entre más aprendes, más ganas. Así de simple.',
      image: '/images/lessons/gana-sati.png',
      color: 'cyan',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          {/* Mascot */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-6xl shadow-2xl animate-bounce-slow">
                🪙
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
              >
                ₿
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
              <span className="gradient-text">Sati</span> Academy
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-2 font-display">
              El Duolingo de Bitcoin
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Bitcoin para todos. <span className="text-orange-400 font-semibold">Hasta para la abuelita.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleStartNow}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Empezar Ahora — Gratis
            </button>
            <a
              href="#como-funciona"
              className="px-8 py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-medium hover:border-orange-500 hover:text-orange-400 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Ver Cómo Funciona
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { value: '8', label: 'Etapas' },
              { value: '34+', label: 'Lecciones' },
              { value: '$SATI', label: 'Recompensas' },
              { value: '🇲🇽', label: 'México' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - VERTICAL con Imágenes */}
      <section id="como-funciona" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Aprende Bitcoin paso a paso, a tu ritmo, con recompensas reales
            </p>
          </motion.div>

          {/* Features Verticales */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className={`bg-gradient-to-br ${
                feature.color === 'orange' ? 'from-orange-500/10 to-amber-500/10' :
                feature.color === 'amber' ? 'from-amber-500/10 to-yellow-500/10' :
                feature.color === 'purple' ? 'from-purple-500/10 to-pink-500/10' :
                'from-cyan-500/10 to-blue-500/10'
              } rounded-3xl border ${
                feature.color === 'orange' ? 'border-orange-500/30' :
                feature.color === 'amber' ? 'border-amber-500/30' :
                feature.color === 'purple' ? 'border-purple-500/30' :
                'border-cyan-500/30'
              } overflow-hidden`}>
                <div className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-stretch`}>
                  {/* Imagen */}
                  <div className="md:w-1/2 relative">
                    <div className="bg-gray-800 flex items-center justify-center">
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full h-auto md:h-full object-contain md:object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 rounded-xl ${
                        feature.color === 'orange' ? 'bg-orange-400/20' :
                        feature.color === 'amber' ? 'bg-amber-400/20' :
                        feature.color === 'purple' ? 'bg-purple-400/20' :
                        'bg-cyan-400/20'
                      } flex items-center justify-center`}>
                        <feature.icon className={`w-7 h-7 ${
                          feature.color === 'orange' ? 'text-orange-400' :
                          feature.color === 'amber' ? 'text-amber-400' :
                          feature.color === 'purple' ? 'text-purple-400' :
                          'text-cyan-400'
                        }`} />
                      </div>
                      <h3 className="text-3xl font-bold">{feature.title}</h3>
                    </div>
                    
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap Preview Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-orange-950/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Tu Camino Bitcoiner
            </h2>
            <p className="text-xl text-gray-400">
              8 etapas progresivas, de cero a DeFi
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAGES_CONFIG.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-4 rounded-xl bg-gradient-to-br ${stage.colorGradient} bg-opacity-20`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                    {stage.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{stage.title}</p>
                  </div>
                </div>
                <p className="text-xs text-white/70">{stage.lessons.length - 2} lecciones</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={handleStartNow}
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Ver programa completo <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 via-transparent to-amber-950/20" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block text-6xl"
              >
                🪙
              </motion.div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para aprender <span className="gradient-text">Bitcoin</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Únete a la comunidad. Gratis. Para siempre.
            </p>

            <button
              onClick={handleStartNow}
              className="px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-bold text-xl hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-2 inline-flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Empezar Ahora — Gratis
            </button>

            <p className="text-sm text-gray-500 mt-8">
              Proyecto para el <span className="text-orange-400 font-semibold">Hackathon Bitcoin México 2026</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🪙</span>
              <div>
                <p className="font-bold text-lg">Sati Academy</p>
                <p className="text-sm text-gray-500">El Duolingo de Bitcoin</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                Hecho por <a href="https://x.com/luisxdrop" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-medium">@luisxdrop</a> en X 🇲🇽
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          window.location.href = '/aprender';
        }}
      />
    </main>
  );
}
