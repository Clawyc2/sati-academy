'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Trophy, User, X, Star, BookOpen, Gamepad2, 
  FileQuestion, Gift, Lock, CheckCircle, Play, Settings, LogOut,
  Flame, Zap, ChevronLeft, Menu
} from 'lucide-react';
import { STAGES_CONFIG } from '@/lib/constants';
import { signOut } from '@/lib/supabase';

// Badges por etapa
const STAGE_BADGES = [
  { name: 'La Chispa', image: '/images/Badges/la-chispa.png' },
  { name: 'Guardián', image: '/images/Badges/guardian.png' },
  { name: 'Primer Paso', image: '/images/Badges/primer-paso.png' },
  { name: 'On-Chain', image: '/images/Badges/onchain.png' },
  { name: 'CEX Master', image: '/images/Badges/cex.png' },
  { name: 'Lightning Fast', image: '/images/Badges/lightning-fast.png' },
  { name: 'DeFi Explorer', image: '/images/Badges/defi-explorer.png' },
  { name: 'Liquidity Master', image: '/images/Badges/Liquidez.png' },
];

// Sidebar component
function Sidebar({ activeTab, onTabChange, onLogout, collapsed, onClose }: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  onClose: () => void;
}) {
  const menuItems = [
    { id: 'learn', icon: Map, label: 'Aprender' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'badges', icon: Gift, label: 'Mis Badges' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={onClose}
      />
      
      <aside className={`fixed left-0 top-0 h-screen bg-[var(--bg2)] border-r border-[var(--gray)] flex flex-col z-40 transition-all duration-300 ${
        collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'
      } md:w-64`}>
        {/* Logo */}
        <div className="p-4 md:p-5 border-b border-[var(--gray)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl shrink-0">
                🪙
              </div>
              {!collapsed && (
                <div>
                  <p className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>Sati Academy</p>
                  <p className="text-xs text-[var(--text2)]">Aprende Bitcoin</p>
                </div>
              )}
            </div>
            <button 
              onClick={onClose}
              className="md:hidden p-2 hover:bg-[var(--bg3)] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-2 md:py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 md:px-5 py-3 transition-all ${
                activeTab === item.id 
                  ? 'bg-orange-500/10 border-l-4 border-orange-500 text-orange-400' 
                  : 'text-[var(--text)] hover:bg-[var(--bg3)]'
              } ${collapsed ? 'md:justify-center' : ''}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(!collapsed) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-[var(--gray)] p-3 md:p-4">
          {/* Profile Quick Access */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg3)] mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shrink-0">
              👤
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">Usuario</p>
                <p className="text-xs text-[var(--text2)]">Etapa 1</p>
              </div>
            )}
            {!collapsed && <Settings className="w-4 h-4 text-[var(--text2)]" />}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ${
              collapsed ? 'md:justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!collapsed) && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

// Topbar component
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 md:right-[280px] h-16 bg-[var(--bg)] border-b border-[var(--gray)] z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left - Menu + Logo */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-[var(--bg3)] rounded-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-2xl hidden md:block">🪙</span>
        <span className="font-bold text-base md:text-lg hidden md:block" style={{ fontFamily: 'Syne' }}>Sati Academy</span>
      </div>
      
      {/* Center - Stats (ocultos en móvil) */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-orange-400">🔥</span>
          <span className="font-semibold text-sm">Racha: <span className="text-orange-400">0</span> días</span>
        </div>
        <div className="w-px h-6 bg-[var(--gray)]" />
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">💎</span>
          <span className="font-semibold text-sm">Puntos: <span className="text-cyan-400">0</span></span>
        </div>
        <div className="w-px h-6 bg-[var(--gray)]" />
        <div className="flex items-center gap-2">
          <span className="text-amber-400">⚡</span>
          <span className="font-semibold text-sm">Etapa <span className="text-amber-400">1</span></span>
        </div>
      </div>

      {/* Right - Config + Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        <button className="p-2 hover:bg-[var(--bg3)] rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-[var(--text2)]" />
        </button>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-base md:text-lg">
          👤
        </div>
      </div>
    </header>
  );
}

// Right Panel with widgets
function RightPanel() {
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const top3 = [
    { rank: 2, name: 'Ana', points: 2800 },
    { rank: 1, name: 'Pedro', points: 3200 },
    { rank: 3, name: 'María', points: 2650 },
  ];

  return (
    <aside className="hidden md:block w-[280px] fixed right-0 top-16 bottom-0 bg-[var(--bg2)] border-l border-[var(--gray)] overflow-y-auto p-4 space-y-4">
      {/* Widget 1 - Token SATI */}
      <div className="bg-[var(--bg3)] rounded-xl p-4 border border-[var(--gray)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🪙</span>
          <span className="font-bold text-lg">$SATI tokens:</span>
        </div>
        <p className="text-2xl font-bold text-orange-400">0.00</p>
        <p className="text-xs text-[var(--text2)] mt-2">Completa etapas para ganar</p>
      </div>

      {/* Widget 2 - Racha */}
      <div className="bg-[var(--bg3)] rounded-xl p-4 border border-[var(--gray)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🔥</span>
          <span className="font-bold">Racha de <span className="text-orange-400">0</span> días</span>
        </div>
        <div className="flex gap-1 mb-3">
          {weekDays.map((day, i) => (
            <div key={i} className="w-8 h-8 rounded-lg bg-[var(--bg2)] flex items-center justify-center text-xs font-semibold text-[var(--text2)]">
              {day}
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text2)]">¡Sigue así, no rompas la racha!</p>
      </div>

      {/* Widget 3 - Ranking */}
      <div className="bg-[var(--bg3)] rounded-xl p-4 border border-[var(--gray)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <span className="font-bold">División Plata</span>
          </div>
          <button className="text-xs text-orange-400 hover:underline">VER RANKING →</button>
        </div>
        
        {/* Top 3 */}
        <div className="flex justify-center items-end gap-2 mb-4 h-20">
          {top3.map((player, i) => (
            <div key={i} className={`flex flex-col items-center ${i === 1 ? 'order-first' : i === 0 ? 'order-2' : 'order-3'}`}>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-lg mb-1 ${i === 1 ? 'ring-2 ring-amber-400' : ''}`}>
                👤
              </div>
              <span className="text-xs font-semibold">{player.rank === 1 ? '👑' : `#${player.rank}`}</span>
            </div>
          ))}
        </div>

        {/* User Position */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg2)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-sm">
            👤
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Tú</p>
            <p className="text-xs text-[var(--text2)]">150 pts</p>
          </div>
          <span className="text-xs text-[var(--text2)]">#1,234</span>
        </div>
      </div>

      {/* Widget 4 - Desafío del día */}
      <div className="bg-[var(--bg3)] rounded-xl p-4 border border-[var(--gray)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⚡</span>
          <span className="font-bold">Desafío del día</span>
        </div>
        <p className="text-sm text-[var(--text)] mb-3">Completa 1 lección hoy</p>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
          <div className="h-full w-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
        </div>
        <p className="text-xs text-[var(--text2)] mt-2 text-center">0/1</p>
      </div>
    </aside>
  );
}

// Stage Tabs
function StageTabs({ activeStage, onStageChange }: { 
  activeStage: number; 
  onStageChange: (stage: number) => void;
}) {
  return (
    <div className="fixed top-16 left-[220px] right-[280px] h-14 bg-[var(--bg2)] border-b border-[var(--gray)] z-20 px-6 flex items-center gap-2 overflow-x-auto">
      {STAGES_CONFIG.map((stage) => {
        const isUnlocked = stage.id === 1;
        const isActive = activeStage === stage.id;
        
        return (
          <button
            key={stage.id}
            onClick={() => isUnlocked && onStageChange(stage.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400'
                : isUnlocked
                  ? 'bg-[var(--bg3)] border border-[var(--gray)] text-[var(--text)] hover:border-orange-500/50'
                  : 'bg-[var(--bg3)] border border-[var(--gray)] text-[var(--text2)] cursor-not-allowed'
            }`}
          >
            <span>Etapa {stage.id}</span>
            {isActive && <span className="w-2 h-2 rounded-full bg-orange-400" />}
            {!isUnlocked && <span>🔒</span>}
          </button>
        );
      })}
    </div>
  );
}

// Map Node
function MapNode({ 
  type, 
  status, 
  title, 
  onClick,
  badge
}: { 
  type: 'lesson' | 'exam' | 'chest' | 'badge';
  status: 'done' | 'current' | 'locked';
  title: string;
  onClick: () => void;
  badge?: { name: string; image: string };
}) {
  const getNodeStyle = () => {
    if (status === 'done') return 'bg-green-500 shadow-lg shadow-green-500/50';
    if (status === 'current') return 'bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse';
    if (type === 'exam') return 'bg-purple-600';
    if (type === 'chest') return 'bg-amber-700';
    return 'bg-[var(--bg3)] opacity-60';
  };

  const getIcon = () => {
    if (status === 'done') return <CheckCircle className="w-6 h-6 text-white" />;
    if (status === 'locked') return <Lock className="w-6 h-6 text-[var(--text2)]" />;
    if (type === 'lesson') return <Star className="w-6 h-6 text-white" />;
    if (type === 'exam') return <FileQuestion className="w-6 h-6 text-white" />;
    if (type === 'chest') return <span className="text-2xl">📦</span>;
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={status !== 'locked' ? onClick : undefined}
        disabled={status === 'locked'}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${getNodeStyle()} ${
          status !== 'locked' ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
        }`}
      >
        {type === 'badge' && badge ? (
          <img src={badge.image} alt={badge.name} className="w-10 h-10 object-contain" />
        ) : (
          getIcon()
        )}
      </button>
      <p className={`text-xs mt-2 text-center max-w-[100px] ${status === 'locked' ? 'text-[var(--text2)]' : 'text-[var(--text)]'}`}>
        {title}
      </p>
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
  lesson: { type: string; title: string } | null;
}) {
  if (!isOpen || !lesson) return null;

  const getIcon = () => {
    switch (lesson.type) {
      case 'lesson': return '⭐';
      case 'exam': return '📝';
      case 'chest': return '📦';
      case 'badge': return '🏆';
      default: return '📖';
    }
  };

  const getDescription = () => {
    switch (lesson.type) {
      case 'lesson': return 'Aprende los conceptos fundamentales de forma interactiva.';
      case 'exam': return 'Demuestra lo que has aprendido. Necesitas 60% para aprobar.';
      case 'chest': return '¡Recompensa desbloqueada! Reclama tus $SATI.';
      case 'badge': return '¡Badge desbloqueado! Muestra tu logro al mundo.';
      default: return 'Continúa tu aprendizaje.';
    }
  };

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
          className="bg-[var(--bg2)] rounded-3xl p-8 max-w-md w-full border border-[var(--gray)] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-[var(--bg3)] rounded-lg">
            <X className="w-5 h-5 text-[var(--text2)]" />
          </button>

          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-4xl shadow-lg mb-4">
              {getIcon()}
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>{lesson.title}</h2>
            <p className="text-[var(--text2)] text-sm">{getDescription()}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 border border-[var(--gray)] rounded-xl text-[var(--text2)]">
              Cerrar
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              ¡Empezar!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Logout Confirmation Modal
function LogoutModal({ isOpen, onConfirm, onCancel }: { 
  isOpen: boolean; 
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[var(--bg2)] rounded-3xl p-8 max-w-sm w-full border border-[var(--gray)] text-center"
        >
          <div className="text-5xl mb-4">🚪</div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>¿Cerrar sesión?</h2>
          <p className="text-[var(--text2)] text-sm mb-6">Se cerrará tu sesión en este dispositivo.</p>

          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-3 border border-[var(--gray)] rounded-xl text-[var(--text2)]">
              Cancelar
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold">
              Cerrar sesión
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Level Map with zigzag
function LevelMap({ activeStage }: { activeStage: number }) {
  const [selectedLesson, setSelectedLesson] = useState<{ type: string; title: string } | null>(null);

  const stage = STAGES_CONFIG[activeStage - 1];
  const badge = STAGE_BADGES[activeStage - 1];

  // Zigzag offsets - serpentine pattern
  const zigzagOffsets = [-80, 80, -60, 60, -40, 40, -20, 20];

  return (
    <div className="pt-28 pb-8 px-6 max-w-3xl mx-auto">
      {/* Stage Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[var(--bg3)] rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>
              ETAPA {stage.id} — {stage.title}
            </h2>
            <p className="text-sm text-[var(--text2)]">{stage.subtitle}</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-[var(--gray)] rounded-lg text-sm font-medium hover:border-orange-500 hover:text-orange-400 transition-colors">
          📋 GUÍA
        </button>
      </div>

      {/* Nodes with zigzag */}
      <div className="relative flex flex-col items-center">
        {stage.lessons.map((lesson, lessonIndex) => {
          const isExam = lesson.type === 'exam';
          const isChest = lesson.type === 'chest';
          
          // Status logic (solo el primer nodo está activo)
          const status = lessonIndex === 0 ? 'current' : 'locked';
          
          // Offset (zigzag) - exam and chest centered
          const offset = isExam || isChest ? 0 : zigzagOffsets[lessonIndex % zigzagOffsets.length];

          return (
            <div key={lesson.id} className="relative flex flex-col items-center mb-4">
              {/* Dotted curved connector line (except first) */}
              {lessonIndex > 0 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 flex items-center justify-center">
                  <div className={`w-0.5 h-full border-l-2 border-dashed ${status === 'locked' ? 'border-[var(--gray)]' : 'border-orange-500'}`} />
                </div>
              )}

              {/* Node with offset */}
              <div style={{ transform: `translateX(${offset}px)` }} className="relative z-10 mt-3">
                <MapNode
                  type={isChest ? 'chest' : isExam ? 'exam' : 'lesson'}
                  status={status as any}
                  title={lesson.title}
                  onClick={() => setSelectedLesson({ type: lesson.type, title: lesson.title })}
                />
              </div>
            </div>
          );
        })}

        {/* Badge Node - SIEMPRE AL FINAL */}
        <div className="relative flex flex-col items-center mt-4">
          {/* Connector line from chest */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 flex items-center justify-center">
            <div className="w-0.5 h-full border-l-2 border-dashed border-[var(--gray)]" />
          </div>
          
          <div className="relative z-10 mt-3">
            <MapNode
              type="badge"
              status="locked"
              title={`🏆 Badge: ${badge.name}`}
              badge={badge}
              onClick={() => setSelectedLesson({ type: 'badge', title: badge.name })}
            />
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={!!selectedLesson}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson}
      />
    </div>
  );
}

// Main App Page
export default function AppPage() {
  const [activeTab, setActiveTab] = useState('learn');
  const [activeStage, setActiveStage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={() => setShowLogoutModal(true)}
        collapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      
      {activeTab === 'learn' && (
        <>
          <StageTabs activeStage={activeStage} onStageChange={setActiveStage} />
          <RightPanel />
          <main className="ml-0 md:ml-64 mr-0 md:mr-[280px] min-h-screen pt-16 md:pt-16">
            <LevelMap activeStage={activeStage} />
          </main>
        </>
      )}

      {activeTab !== 'learn' && (
        <main className="ml-0 md:ml-64 min-h-screen pt-20">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center px-4">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold mb-2">En construcción</h2>
              <p className="text-[var(--text2)]">Esta sección estará disponible pronto</p>
            </div>
          </div>
        </main>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
