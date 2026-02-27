'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Trophy, User, X, Star, BookOpen, Gamepad2, 
  FileQuestion, Gift, Lock, CheckCircle, Play, Settings, LogOut,
  Flame, Zap, ChevronLeft, Menu, Bell, Moon, Wallet, BarChart3, Edit
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

// Config Dropdown
function ConfigDropdown({ isOpen, onClose, onLogout, onNavigate }: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode] = useState(true); // Siempre ON

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-14 right-4 md:right-8 w-64 bg-[var(--bg2)] border border-[var(--gray)] rounded-xl shadow-xl z-50 overflow-hidden"
      >
        <div className="p-3 border-b border-[var(--gray)]">
          <p className="font-bold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Configuración
          </p>
        </div>

        <div className="py-2">
          <button 
            onClick={() => { onNavigate('profile'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg3)] transition-colors"
          >
            <Edit className="w-4 h-4 text-[var(--text2)]" />
            <span className="text-sm">Editar perfil</span>
          </button>

          <button 
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--bg3)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[var(--text2)]" />
              <span className="text-sm">Notificaciones</span>
            </div>
            <div 
              onClick={() => setNotifications(!notifications)}
              className={`w-10 h-6 rounded-full transition-colors ${notifications ? 'bg-orange-500' : 'bg-[var(--gray)]'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${notifications ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>

          <button 
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--bg3)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-[var(--text2)]" />
              <span className="text-sm">Modo oscuro</span>
            </div>
            <div className="w-10 h-6 rounded-full bg-orange-500">
              <div className="w-5 h-5 rounded-full bg-white shadow-md transform translate-x-4" />
            </div>
          </button>

          <button 
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg3)] transition-colors"
          >
            <Wallet className="w-4 h-4 text-[var(--text2)]" />
            <span className="text-sm">Conectar wallet</span>
            <span className="ml-auto text-xs text-[var(--text2)]">→</span>
          </button>

          <button 
            onClick={() => { onNavigate('profile'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg3)] transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-[var(--text2)]" />
            <span className="text-sm">Mis estadísticas</span>
          </button>
        </div>

        <div className="border-t border-[var(--gray)] py-2">
          <button 
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}

// Bottom Navigation para Mobile
function BottomNav({ activeTab, onTabChange }: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    { id: 'learn', icon: Map, label: 'Aprender' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'badges', icon: Gift, label: 'Badges' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg2)] border-t border-[var(--gray)] z-50 flex items-center justify-around md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === tab.id 
              ? 'text-orange-400' 
              : 'text-[var(--text2)]'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Stats Mini Cards para Mobile
function MobileStats() {
  return (
    <div className="md:hidden overflow-x-auto px-4 py-3 bg-[var(--bg2)] border-b border-[var(--gray)]">
      <div className="flex gap-3 min-w-max">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg3)] border border-[var(--gray)]">
          <span>🔥</span>
          <span className="text-sm font-medium">Racha: <span className="text-orange-400">0</span></span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg3)] border border-[var(--gray)]">
          <span>💎</span>
          <span className="text-sm font-medium">Puntos: <span className="text-cyan-400">0</span></span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg3)] border border-[var(--gray)]">
          <span>🪙</span>
          <span className="text-sm font-medium">$SATI: <span className="text-orange-400">0.00</span></span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg3)] border border-[var(--gray)]">
          <span>⚡</span>
          <span className="text-sm font-medium">Desafío: <span className="text-amber-400">0/1</span></span>
        </div>
      </div>
    </div>
  );
}

// Sidebar para Desktop (y drawer en mobile)
function Sidebar({ activeTab, onTabChange, onLogout, collapsed, onClose, onConfigClick }: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  onClose: () => void;
  onConfigClick: () => void;
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
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={onClose}
      />
      
      {/* Desktop Sidebar - siempre visible con texto */}
      <aside className={`fixed left-0 top-0 h-screen w-56 bg-[var(--bg2)] border-r border-[var(--gray)] flex-col z-50 transition-transform duration-300 ${
        collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
      } hidden md:flex`}>
        {/* Logo */}
        <div className="p-5 border-b border-[var(--gray)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl shrink-0">
              🪙
            </div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>Sati Academy</p>
              <p className="text-xs text-[var(--text2)]">Aprende Bitcoin</p>
            </div>
          </div>
        </div>

        {/* Menu - siempre con iconos + texto en desktop */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 transition-all ${
                activeTab === item.id 
                  ? 'bg-orange-500/10 border-l-4 border-orange-500 text-orange-400' 
                  : 'text-[var(--text)] hover:bg-[var(--bg3)]'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Section - User + Logout */}
        <div className="border-t border-[var(--gray)] p-4">
          {/* User Block */}
          <button 
            onClick={() => onTabChange('profile')}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg3)] mb-3 hover:bg-[var(--bg3)]/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shrink-0">
              👤
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-sm truncate">Usuario</p>
              <p className="text-xs text-[var(--text2)]">Etapa 1 · 0 pts</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onConfigClick(); }}
              className="p-1.5 hover:bg-[var(--bg2)] rounded-lg"
            >
              <Settings className="w-4 h-4 text-[var(--text2)]" />
            </button>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[var(--bg2)] border-r border-[var(--gray)] flex flex-col z-50 transition-transform duration-300 ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      } md:hidden`}>
        {/* Logo + Stats */}
        <div className="p-5 border-b border-[var(--gray)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl">
                🪙
              </div>
              <div>
                <p className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>Sati Academy</p>
                <p className="text-xs text-[var(--text2)]">Aprende Bitcoin</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[var(--bg3)] rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Stats compactos */}
          <div className="flex gap-4 text-sm">
            <div>🔥 <span className="text-orange-400 font-semibold">0</span></div>
            <div>💎 <span className="text-cyan-400 font-semibold">0</span></div>
            <div>⚡ <span className="text-amber-400 font-semibold">Etapa 1</span></div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 transition-all ${
                activeTab === item.id 
                  ? 'bg-orange-500/10 border-l-4 border-orange-500 text-orange-400' 
                  : 'text-[var(--text)] hover:bg-[var(--bg3)]'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout al fondo */}
        <div className="p-4 border-t border-[var(--gray)]">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Topbar
function Topbar({ onMenuClick, onConfigClick }: { 
  onMenuClick: () => void;
  onConfigClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 md:left-56 right-0 md:right-[280px] h-16 bg-[var(--bg)] border-b border-[var(--gray)] z-30 px-4 md:px-6 flex items-center justify-between">
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
      
      {/* Center - Stats (solo desktop) */}
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

      {/* Right - Solo Config */}
      <button 
        onClick={onConfigClick}
        className="p-2 hover:bg-[var(--bg3)] rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5 text-[var(--text2)]" />
      </button>
    </header>
  );
}

// Right Panel (solo desktop)
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
        <p className="text-3xl font-bold gradient-text mb-1">0.00</p>
        <p className="text-xs text-[var(--text2)]">≈ $0.00 USD</p>
      </div>

      {/* Widget 2 - Racha diaria */}
      <div className="bg-[var(--bg3)] rounded-xl p-4 border border-[var(--gray)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-bold">Racha diaria</span>
          </div>
          <span className="text-2xl font-bold text-orange-400">0</span>
        </div>
        
        {/* Week days */}
        <div className="flex justify-between mb-2">
          {weekDays.map((day, i) => (
            <div 
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i < 0 ? 'bg-orange-500 text-gray-900' : 'bg-[var(--gray)] text-[var(--text2)]'
              }`}
            >
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
        <div className="bg-[var(--bg2)] rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-sm">
            👤
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Tú</p>
            <p className="text-xs text-[var(--text2)]">0 puntos</p>
          </div>
          <span className="text-sm font-bold text-[var(--text2)]">#999</span>
        </div>
      </div>

      {/* Widget 4 - Desafío semanal */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold">Desafío semanal</span>
        </div>
        <p className="text-sm text-[var(--text2)] mb-3">Completa 5 lecciones esta semana</p>
        
        {/* Progress */}
        <div className="w-full h-3 bg-[var(--gray)] rounded-full overflow-hidden mb-2">
          <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>
        <p className="text-xs text-[var(--text2)]">0/5 completados</p>
      </div>
    </aside>
  );
}

// Stage Tabs
function StageTabs({ activeStage, onStageChange }: {
  activeStage: number;
  onStageChange: (stage: number) => void;
}) {
  const stages = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="fixed top-16 left-0 md:left-56 right-0 md:right-[280px] h-14 bg-[var(--bg2)] border-b border-[var(--gray)] z-20 flex items-center px-4 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {stages.map((stage) => {
          const isLocked = stage > 1;
          const isActive = activeStage === stage;
          
          return (
            <button
              key={stage}
              onClick={() => !isLocked && onStageChange(stage)}
              disabled={isLocked}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-orange-500 text-gray-900' 
                  : isLocked 
                    ? 'bg-[var(--bg3)] text-[var(--text2)] cursor-not-allowed'
                    : 'bg-[var(--bg3)] text-[var(--text)] hover:bg-orange-500/20'
              }`}
            >
              {isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">E{stage}</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Etapa {stage}</span>
                  <span className="sm:hidden">E{stage}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Level Map
function LevelMap({ activeStage }: { activeStage: number }) {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  const stageConfig = STAGES_CONFIG[activeStage - 1] || STAGES_CONFIG[0];
  
  // Detectar si es mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Offsets más pequeños en mobile
  const desktopOffsets = [-80, 80, -60, 60, -80, 80, -60, 60];
  const mobileOffsets = [-40, 40, -40, 40, -40, 40, -40, 40];
  const offsets = isMobile ? mobileOffsets : desktopOffsets;

  return (
    <div className="pt-16 md:pt-28 pb-20 md:pb-8 px-4 md:px-8">
      {/* Header de etapa */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>
          Etapa {activeStage}: {stageConfig.title}
        </h2>
        <p className="text-sm md:text-base text-[var(--text2)]">{stageConfig.description}</p>
      </div>

      {/* Mapa de nodos */}
      <div className="relative flex flex-col items-center gap-3 md:gap-4">
        {stageConfig.lessons.map((lesson: any, index: number) => {
          const isCompleted = index === 0;
          const isCurrent = index === 1;
          const isLocked = index > 1;
          const isExam = lesson.type === 'exam';
          const isBadge = lesson.type === 'badge';
          
          const offset = offsets[index % offsets.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center"
              style={{ marginLeft: `${offset}px` }}
            >
              {/* Nodo */}
              <button
                onClick={() => !isLocked && setSelectedLesson({ ...lesson, index })}
                disabled={isLocked}
                className={`relative flex items-center justify-center rounded-full transition-all ${
                  isCompleted ? 'w-14 h-14 md:w-[72px] md:h-[72px] node-done' :
                  isCurrent ? 'w-14 h-14 md:w-[72px] md:h-[72px] node-current' :
                  isExam ? 'w-14 h-14 md:w-[72px] md:h-[72px] node-exam' :
                  isBadge ? 'w-14 h-14 md:w-[72px] md:h-[72px] node-chest' :
                  'w-14 h-14 md:w-[72px] md:h-[72px] node-locked'
                }`}
              >
                {isCompleted && <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                {isCurrent && <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                {isExam && <FileQuestion className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                {isBadge && <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                {isLocked && <Lock className="w-5 h-5 md:w-6 md:h-6 text-[var(--text2)]" />}

                {/* Tooltip (solo desktop) */}
                {!isLocked && (
                  <div className="tooltip hidden md:block">
                    <p className="font-medium">{lesson.title}</p>
                    {!isCompleted && !isBadge && <p className="text-xs text-[var(--text2)]">{lesson.duration || '5 min'}</p>}
                  </div>
                )}
              </button>

              {/* Label */}
              <p className="text-[10px] md:text-xs text-center mt-1.5 max-w-[80px] md:max-w-[100px] leading-tight">
                {lesson.title}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Botón GUÍA */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8">
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
          📖 GUÍA
        </button>
      </div>
    </div>
  );
}

// Lesson Modal
function LessonModal({ isOpen, onClose, lesson }: { 
  isOpen: boolean; 
  onClose: () => void; 
  lesson: any;
}) {
  if (!isOpen || !lesson) return null;

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
          className="bg-[var(--bg2)] rounded-2xl p-6 max-w-md w-full border border-[var(--gray)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">
              {lesson.type === 'lesson' && '📚'}
              {lesson.type === 'exam' && '📝'}
              {lesson.type === 'badge' && '🎁'}
            </div>
            <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
            <p className="text-[var(--text2)]">{lesson.description || 'Lección interactiva'}</p>
          </div>

          {lesson.type !== 'badge' && (
            <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-bold">
              Comenzar
            </button>
          )}

          <button 
            onClick={onClose}
            className="w-full mt-3 py-2 text-[var(--text2)] hover:text-[var(--text)] transition-colors"
          >
            Cerrar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Logout Modal
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
          className="bg-[var(--bg2)] rounded-2xl p-6 max-w-sm w-full border border-[var(--gray)]"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">👋</div>
            <h3 className="text-xl font-bold mb-2">¿Cerrar sesión?</h3>
            <p className="text-[var(--text2)]">Tu progreso está guardado en la nube</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-3 border border-[var(--gray)] rounded-xl font-medium hover:bg-[var(--bg3)] transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main App Page
export default function AppPage() {
  const [activeTab, setActiveTab] = useState('learn');
  const [activeStage, setActiveStage] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

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
        onConfigClick={() => setShowConfig(true)}
      />
      <Topbar 
        onMenuClick={() => setSidebarOpen(true)}
        onConfigClick={() => setShowConfig(true)}
      />
      
      {/* Config Dropdown */}
      <ConfigDropdown 
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        onLogout={() => setShowLogoutModal(true)}
        onNavigate={(tab) => setActiveTab(tab)}
      />
      
      {/* Bottom Navigation para Mobile */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'learn' && (
        <>
          {/* Stats mini cards para mobile */}
          <MobileStats />
          
          <StageTabs activeStage={activeStage} onStageChange={setActiveStage} />
          <RightPanel />
          <main className="ml-0 md:ml-56 mr-0 md:mr-[280px] min-h-screen pb-16 md:pb-0">
            <LevelMap activeStage={activeStage} />
          </main>
        </>
      )}

      {activeTab !== 'learn' && (
        <main className="ml-0 md:ml-56 min-h-screen pt-20 pb-16 md:pb-0">
          <div className="flex items-center justify-center h-[60vh] px-4">
            <div className="text-center">
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
