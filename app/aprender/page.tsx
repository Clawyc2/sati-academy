'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, LayoutDashboard, User, X, Star, BookOpen, Gamepad2, 
  FileQuestion, Gift, Lock, CheckCircle, Play, ChevronRight
} from 'lucide-react';
import { STAGES_CONFIG } from '@/lib/constants';

// Sidebar component
function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const menuItems = [
    { id: 'learn', icon: Map, label: 'Aprender' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <aside className="sidebar fixed left-0 top-0 h-screen flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--gray)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl">
            🪙
          </div>
          <div className="sidebar-logo-text">
            <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Sati Academy</p>
            <p className="text-xs text-[var(--text2)]">Aprende Bitcoin</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`sidebar-item w-full flex items-center gap-3 px-5 py-3 ${
              activeTab === item.id ? 'active' : ''
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="sidebar-label text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Streak */}
      <div className="p-4 border-t border-[var(--gray)]">
        <div className="stat-pill justify-center">
          <span className="text-orange-400">🔥</span>
          <span className="font-semibold">0 días</span>
        </div>
      </div>
    </aside>
  );
}

// Topbar component
function Topbar({ title }: { title: string }) {
  return (
    <header className="fixed top-0 left-[220px] right-0 h-16 bg-[var(--bg)] border-b border-[var(--gray)] z-30 px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
      
      <div className="flex items-center gap-3">
        <div className="stat-pill">
          <span>🔥</span>
          <span className="font-semibold">0</span>
        </div>
        <div className="stat-pill">
          <span>💎</span>
          <span className="font-semibold">0</span>
        </div>
      </div>
    </header>
  );
}

// Node component
function MapNode({ 
  type, 
  status, 
  title, 
  onClick,
  offset 
}: { 
  type: 'lesson' | 'reading' | 'simulator' | 'exam' | 'chest';
  status: 'done' | 'current' | 'locked';
  title: string;
  onClick: () => void;
  offset: number;
}) {
  const getIcon = () => {
    if (status === 'locked') return <Lock className="w-6 h-6 text-[var(--text2)]" />;
    if (status === 'done') return <CheckCircle className="w-6 h-6 text-white" />;
    
    switch (type) {
      case 'lesson': return <Star className="w-6 h-6 text-white" />;
      case 'reading': return <BookOpen className="w-6 h-6 text-white" />;
      case 'simulator': return <Gamepad2 className="w-6 h-6 text-white" />;
      case 'exam': return <FileQuestion className="w-6 h-6 text-white" />;
      case 'chest': return <span className="text-2xl">📦</span>;
    }
  };

  const getNodeClass = () => {
    if (status === 'done') return 'node-done';
    if (status === 'current') return 'node-current';
    if (status === 'locked') return 'node-locked';
    if (type === 'exam') return 'node-exam';
    if (type === 'chest') return 'node-chest';
    return 'node-locked';
  };

  const getStatusText = () => {
    if (status === 'done') return 'Completado ✅';
    if (status === 'current') return 'En progreso 🔥';
    return 'Bloqueado';
  };

  return (
    <div 
      className="relative"
      style={{ transform: `translateX(${offset}px)` }}
    >
      <button
        onClick={status !== 'locked' ? onClick : undefined}
        className={`node ${getNodeClass()}`}
        disabled={status === 'locked'}
      >
        {getIcon()}
        
        {/* Tooltip */}
        <div className="tooltip">
          <p className="font-semibold">{title}</p>
          <p className="text-[var(--text2)] text-xs mt-1">{getStatusText()}</p>
        </div>
      </button>
    </div>
  );
}

// Lesson Modal
function LessonModal({ 
  isOpen, 
  onClose, 
  lesson 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  lesson: { type: string; title: string; stageId: number } | null;
}) {
  if (!isOpen || !lesson) return null;

  const getIcon = () => {
    switch (lesson.type) {
      case 'lesson': return '⭐';
      case 'reading': return '📖';
      case 'simulator': return '🎮';
      case 'exam': return '📝';
      case 'chest': return '📦';
      default: return '⭐';
    }
  };

  const getDescription = () => {
    switch (lesson.type) {
      case 'lesson': return 'Aprende los conceptos fundamentales de Bitcoin de forma interactiva.';
      case 'reading': return 'Lectura detallada sobre el tema para profundizar tu conocimiento.';
      case 'simulator': return 'Practica con nuestro simulador interactivo y aprende haciendo.';
      case 'exam': return 'Demuestra lo que has aprendido. Necesitas 60% para aprobar.';
      case 'chest': return '¡Recompensa desbloqueada! Reclama tus $SATI y tu badge.';
      default: return 'Continúa tu aprendizaje.';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-[var(--bg3)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text2)]" />
          </button>

          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-4xl shadow-lg animate-glow">
              {getIcon()}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {lesson.title}
            </h2>
            <p className="text-[var(--text2)] text-sm leading-relaxed">
              {getDescription()}
            </p>
          </div>

          {/* Points indicator */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="stat-pill">
              <span className="text-cyan-400">💎</span>
              <span className="text-sm">+{lesson.type === 'simulator' ? '10' : '5'} pts</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[var(--gray)] rounded-xl text-[var(--text2)] hover:bg-[var(--bg3)] transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-orange-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              ¡Empezar!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Level Map with zigzag
function LevelMap() {
  const [selectedLesson, setSelectedLesson] = useState<{ type: string; title: string; stageId: number } | null>(null);

  // Zigzag offsets pattern
  const zigzagOffsets = [-80, -30, 30, 80, 30, -30, -80];

  const getLessonStatus = (stageId: number, lessonIndex: number) => {
    // Etapa 1 es la única desbloqueada al inicio
    if (stageId === 1) {
      // Solo el primer nodo (lessonIndex 0) está activo
      if (lessonIndex === 0) return 'current';
      // Todos los demás nodos de la etapa 1 están bloqueados
      // hasta que el usuario complete el nodo anterior
    }
    // Todas las demás etapas están completamente bloqueadas
    return 'locked';
  };

  return (
    <div className="pt-20 pb-32 px-6 max-w-2xl mx-auto">
      {STAGES_CONFIG.map((stage, stageIndex) => (
        <div key={stage.id} className="relative mb-8">
          {/* Stage Header */}
          <div className={`stage-card ${stage.id > 1 ? 'stage-card-locked' : ''}`}>
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ 
                  background: stage.id === 1 ? stage.color : 'var(--bg3)',
                  color: stage.id === 1 ? 'white' : 'var(--text2)'
                }}
              >
                {stage.id}
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {stage.title}
                </h3>
                <p className="text-sm text-[var(--text2)]">{stage.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Nodes with zigzag */}
          <div className="relative pl-8">
            {stage.lessons.map((lesson, lessonIndex) => {
              const offset = zigzagOffsets[lessonIndex % zigzagOffsets.length];
              const status = getLessonStatus(stage.id, lessonIndex);

              return (
                <div key={lesson.id} className="flex flex-col items-center">
                  {/* Connector line (except first) */}
                  {lessonIndex > 0 && (
                    <div 
                      className={`connector-line h-8 ${status === 'locked' ? 'connector-line-locked' : ''}`}
                    />
                  )}

                  {/* Node */}
                  <MapNode
                    type={lesson.type as any}
                    status={status as any}
                    title={lesson.title}
                    offset={offset}
                    onClick={() => setSelectedLesson({ 
                      type: lesson.type, 
                      title: lesson.title, 
                      stageId: stage.id 
                    })}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Lesson Modal */}
      <LessonModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson}
      />

      {/* Sati Mascot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-20"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-4xl shadow-2xl cursor-pointer hover:scale-110 transition-transform"
        >
          🪙
        </motion.div>
      </motion.div>
    </div>
  );
}

// Dashboard
function Dashboard() {
  const stats = [
    { label: 'Racha', value: '0', icon: '🔥', color: 'text-orange-400' },
    { label: 'Puntos', value: '0', icon: '💎', color: 'text-cyan-400' },
    { label: 'Badges', value: '0/8', icon: '🏅', color: 'text-amber-400' },
    { label: 'Etapa', value: '1', icon: '📊', color: 'text-purple-400' },
  ];

  const leaderboard = [
    { rank: 1, name: 'CryptoAbuela', points: 2840, streak: 32 },
    { rank: 2, name: 'SatoshiFanMX', points: 2650, streak: 28 },
    { rank: 3, name: 'BitcoinNovato', points: 2420, streak: 21 },
    { rank: 4, name: 'HodlerPro', points: 2180, streak: 15 },
    { rank: 5, name: 'LightningKid', points: 1950, streak: 14 },
  ];

  return (
    <div className="pt-20 pb-8 px-6 max-w-4xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--bg2)] border border-[var(--gray)] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-sm text-[var(--text2)]">{stat.label}</span>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-[var(--bg2)] border border-[var(--gray)] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          🏆 Ranking Global
        </h2>

        <div className="space-y-3">
          {leaderboard.map((player, i) => (
            <div 
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                i === 0 ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-[var(--bg3)]'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                i === 0 ? 'bg-amber-400 text-gray-900' :
                i === 1 ? 'bg-gray-300 text-gray-900' :
                i === 2 ? 'bg-amber-700 text-white' :
                'bg-[var(--gray)] text-[var(--text2)]'
              }`}>
                {player.rank}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{player.name}</p>
                <p className="text-xs text-[var(--text2)]">🔥 {player.streak} días</p>
              </div>
              <p className="text-lg font-bold gradient-text">{player.points.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Profile
function Profile() {
  const badges = [
    { name: 'Mente Abierta', stage: 1, earned: false },
    { name: 'Guardián', stage: 2, earned: false },
    { name: 'Primer Paso', stage: 3, earned: false },
    { name: 'Hodler Novato', stage: 4, earned: false },
    { name: 'Trader Básico', stage: 5, earned: false },
    { name: 'Lightning Fast', stage: 6, earned: false },
    { name: 'DeFi Explorer', stage: 7, earned: false },
    { name: 'Liquidity Master', stage: 8, earned: false },
  ];

  return (
    <div className="pt-20 pb-8 px-6 max-w-4xl mx-auto">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-4xl">
            🪙
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Usuario Demo
            </h1>
            <p className="text-[var(--text2)] text-sm">Miembro desde hoy</p>
            <div className="flex gap-3 mt-3">
              <div className="stat-pill text-xs">
                <span>💎</span>
                <span>0 puntos</span>
              </div>
              <div className="stat-pill text-xs">
                <span>🔥</span>
                <span>0 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-[var(--bg2)] border border-[var(--gray)] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          🏅 Badges
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <div 
              key={i}
              className={`p-4 rounded-xl border text-center ${
                badge.earned 
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30' 
                  : 'bg-[var(--bg3)] border-[var(--gray)] opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">
                {badge.earned ? '🏆' : '🔒'}
              </div>
              <p className="font-semibold text-sm">{badge.name}</p>
              <p className="text-xs text-[var(--text2)] mt-1">Etapa {badge.stage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main App Page
export default function AppPage() {
  const [activeTab, setActiveTab] = useState('learn');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'learn': return 'Mapa de Aprendizaje';
      case 'dashboard': return 'Dashboard';
      case 'profile': return 'Mi Perfil';
      default: return 'Sati Academy';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Topbar title={getPageTitle()} />
      
      <main className="ml-[220px] min-h-screen">
        {activeTab === 'learn' && <LevelMap />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}
