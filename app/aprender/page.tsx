'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, BookOpen, Gamepad2, FileQuestion, Gift, 
  Lock, CheckCircle, Sparkles, ArrowLeft, X
} from 'lucide-react';
import { STAGES_CONFIG } from '@/lib/constants';
import AuthModal from '@/components/AuthModal';

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'lesson': return Star;
    case 'reading': return BookOpen;
    case 'simulator': return Gamepad2;
    case 'exam': return FileQuestion;
    case 'chest': return Gift;
    default: return Star;
  }
};

const getLessonEmoji = (type: string) => {
  switch (type) {
    case 'lesson': return '⭐';
    case 'reading': return '📖';
    case 'simulator': return '🎮';
    case 'exam': return '📝';
    case 'chest': return '🏆';
    default: return '⭐';
  }
};

export default function AprenderPage() {
  const [currentStage] = useState(1);
  const [completedLessons] = useState<string[]>([]);
  const [showAuth, setShowAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{stageId: number, lessonId: string} | null>(null);

  const handleNodeClick = (stageId: number, lessonId: string) => {
    setSelectedLesson({ stageId, lessonId });
  };

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl">
                🪙
              </div>
              <div>
                <p className="font-bold text-orange-400">Sati Academy</p>
                <p className="text-xs text-gray-500">Aprende Bitcoin</p>
              </div>
            </a>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-lg font-bold text-orange-400 flex items-center gap-1">
                  🔥 <span>0</span>
                </p>
                <p className="text-xs text-gray-500">Racha</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400 flex items-center gap-1">
                  💎 <span>0</span>
                </p>
                <p className="text-xs text-gray-500">Puntos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="relative py-8 px-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-xl mx-auto">
          <div className="space-y-8">
            {STAGES_CONFIG.map((stage, stageIndex) => {
              const isUnlocked = stage.id <= currentStage;
              const zigzagDirection = stageIndex % 2 === 0 ? 'left' : 'right';
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stageIndex * 0.1 }}
                  className="relative"
                >
                  {/* Stage header */}
                  <div className={`mb-4 flex items-center gap-3 ${zigzagDirection === 'right' ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        isUnlocked 
                          ? `bg-gradient-to-br ${stage.colorGradient} text-white shadow-lg`
                          : 'bg-gray-800 text-gray-600'
                      }`}
                      style={isUnlocked ? { boxShadow: `0 8px 24px ${stage.color}40` } : {}}
                    >
                      {stage.id}
                    </div>
                    <div className={zigzagDirection === 'right' ? 'text-right' : ''}>
                      <h3 className={`text-lg font-bold ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                        {stage.title}
                      </h3>
                      <p className={`text-sm ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                        {stage.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className={`grid grid-cols-3 gap-3 ${zigzagDirection === 'right' ? 'pl-12' : 'pr-12'}`}>
                    {stage.lessons.map((lesson, lessonIndex) => {
                      const LessonIcon = getLessonIcon(lesson.type);
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = isUnlocked && !isCompleted && !selectedLesson;
                      const isLocked = !isUnlocked;

                      return (
                        <motion.button
                          key={lesson.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: stageIndex * 0.1 + lessonIndex * 0.05 }}
                          onClick={() => {
                            if (!isLocked) {
                              handleNodeClick(stage.id, lesson.id);
                            }
                          }}
                          disabled={isLocked}
                          className={`relative aspect-square rounded-2xl border-2 transition-all ${
                            isLocked
                              ? 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                              : isCompleted
                              ? `bg-gradient-to-br ${stage.colorGradient} border-transparent`
                              : isCurrent
                              ? 'bg-gray-800 border-orange-500/50 hover:border-orange-400 animate-pulse'
                              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          }`}
                          style={!isLocked && !isCompleted ? { borderColor: `${stage.color}50` } : {}}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                            {isLocked ? (
                              <Lock className="w-6 h-6 text-gray-600" />
                            ) : isCompleted ? (
                              lesson.type === 'chest' ? (
                                <span className="text-3xl">🏆</span>
                              ) : (
                                <CheckCircle className="w-6 h-6 text-white" />
                              )
                            ) : (
                              <>
                                <span className="text-2xl mb-1">{getLessonEmoji(lesson.type)}</span>
                              </>
                            )}
                            
                            {!isLocked && lesson.type !== 'chest' && (
                              <p className={`text-[10px] mt-0.5 text-center line-clamp-2 ${
                                isCompleted ? 'text-white/90' : 'text-gray-400'
                              }`}>
                                {lesson.title.split(' ').slice(0, 3).join(' ')}...
                              </p>
                            )}
                          </div>

                          {/* Start tooltip */}
                          {isCurrent && lessonIndex === 0 && (
                            <div 
                              className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                              style={{ backgroundColor: stage.color }}
                            >
                              EMPEZAR
                            </div>
                          )}

                          {/* Points */}
                          {!isLocked && !isCompleted && lesson.type !== 'chest' && (
                            <div className="absolute top-1.5 right-1.5 bg-gray-900/90 text-[9px] px-1.5 py-0.5 rounded-full text-cyan-400 font-mono">
                              +{lesson.type === 'simulator' ? '10' : '5'}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Connector */}
                  {stageIndex < STAGES_CONFIG.length - 1 && (
                    <div className="flex justify-center py-4">
                      <div 
                        className={`w-1 h-8 rounded-full ${
                          stage.id < currentStage 
                            ? `bg-gradient-to-b ${stage.colorGradient}`
                            : 'bg-gray-700'
                        }`}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sati mascot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="fixed bottom-6 right-6 z-20"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-4xl shadow-2xl cursor-pointer hover:scale-110 transition-transform"
            >
              🪙
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs whitespace-nowrap shadow-lg"
            >
              <Sparkles className="inline w-3 h-3 text-amber-400 mr-1" />
              ¡Empieza la Etapa 1!
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Lesson Modal (placeholder) */}
      {selectedLesson && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLesson(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-800 rounded-3xl p-8 max-w-lg w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {getLessonEmoji(STAGES_CONFIG.find(s => s.id === selectedLesson.stageId)?.lessons.find(l => l.id === selectedLesson.lessonId)?.type || 'lesson')}
                </span>
                <h3 className="text-xl font-bold">
                  {STAGES_CONFIG.find(s => s.id === selectedLesson.stageId)?.lessons.find(l => l.id === selectedLesson.lessonId)?.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <p className="text-gray-300 text-center">
                🚧 Lección en construcción
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                Esta lección estará disponible pronto
              </p>
            </div>

            <button
              onClick={() => setSelectedLesson(null)}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-gray-900 rounded-xl font-semibold hover:from-orange-400 hover:to-amber-400 transition-all"
            >
              Volver al Mapa
            </button>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
