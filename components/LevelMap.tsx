'use client';

import { motion } from 'framer-motion';
import { 
  Star, BookOpen, Gamepad2, FileQuestion, Gift, 
  Lock, CheckCircle, Sparkles 
} from 'lucide-react';
import { STAGES_CONFIG } from '@/lib/constants';

interface LevelMapProps {
  onNodeClick?: (stageId: number, lessonId: string) => void;
  userProgress?: {
    currentStage: number;
    completedLessons: string[];
  };
}

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

export default function LevelMap({ onNodeClick, userProgress }: LevelMapProps) {
  const currentStage = userProgress?.currentStage || 1;
  const completedLessons = userProgress?.completedLessons || [];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-8 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header stats bar */}
        <div className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🪙</div>
              <div>
                <p className="text-sm text-gray-400">Etapa actual</p>
                <p className="font-bold text-orange-400">Fundamentos</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">🔥 0</p>
                <p className="text-xs text-gray-500">Racha</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">💎 0</p>
                <p className="text-xs text-gray-500">Puntos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map nodes */}
        <div className="space-y-6">
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
                {/* Stage title */}
                <div className={`mb-4 ${zigzagDirection === 'right' ? 'text-right' : 'text-left'}`}>
                  <h3 className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                    {stage.title}
                  </h3>
                  <p className={`text-sm ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {stage.subtitle}
                  </p>
                </div>

                {/* Lessons grid */}
                <div className={`grid grid-cols-2 gap-3 ${zigzagDirection === 'right' ? 'pl-8' : 'pr-8'}`}>
                  {stage.lessons.map((lesson, lessonIndex) => {
                    const LessonIcon = getLessonIcon(lesson.type);
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = isUnlocked && !isCompleted;
                    const isLocked = !isUnlocked;

                    return (
                      <motion.button
                        key={lesson.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: stageIndex * 0.1 + lessonIndex * 0.05 }}
                        onClick={() => {
                          if (!isLocked && onNodeClick) {
                            onNodeClick(stage.id, lesson.id);
                          }
                        }}
                        disabled={isLocked}
                        className={`relative aspect-square rounded-2xl border-2 transition-all ${
                          isLocked
                            ? 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                            : isCompleted
                            ? `bg-gradient-to-br ${stage.colorGradient} border-transparent shadow-lg shadow-${stage.color}/20`
                            : isCurrent
                            ? `bg-gray-800 border-${stage.color} animate-pulse cursor-pointer hover:scale-105`
                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {/* Node content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          {isLocked ? (
                            <Lock className="w-8 h-8 text-gray-600" />
                          ) : isCompleted ? (
                            <div className="text-center">
                              {lesson.type === 'chest' ? (
                                <span className="text-4xl">🏆</span>
                              ) : (
                                <CheckCircle className="w-8 h-8 text-white mx-auto mb-1" />
                              )}
                            </div>
                          ) : (
                            <>
                              {lesson.type === 'chest' ? (
                                <span className="text-4xl">📦</span>
                              ) : (
                                <LessonIcon className={`w-8 h-8 ${
                                  lesson.type === 'lesson' ? 'text-amber-400' :
                                  lesson.type === 'reading' ? 'text-blue-400' :
                                  lesson.type === 'simulator' ? 'text-green-400' :
                                  'text-purple-400'
                                }`} />
                              )}
                            </>
                          )}
                          
                          {/* Lesson title */}
                          {!isLocked && lesson.type !== 'chest' && (
                            <p className={`text-xs mt-1 text-center ${
                              isCompleted ? 'text-white' : 'text-gray-400'
                            } line-clamp-2`}>
                              {lesson.title}
                            </p>
                          )}
                        </div>

                        {/* Start tooltip for current lesson */}
                        {isCurrent && lessonIndex === 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            EMPEZAR
                          </div>
                        )}

                        {/* Points indicator */}
                        {!isLocked && !isCompleted && lesson.type !== 'chest' && (
                          <div className="absolute top-2 right-2 bg-gray-900/80 text-xs px-2 py-0.5 rounded-full text-cyan-400 font-mono">
                            +{lesson.type === 'simulator' ? '10' : '5'}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Stage connector */}
                {stageIndex < STAGES_CONFIG.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className={`w-1 h-12 rounded-full ${
                      stage.id < currentStage ? 'bg-gradient-to-b from-orange-500 to-orange-500/20' : 'bg-gray-700'
                    }`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Sati mascot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="fixed bottom-8 right-8 z-20"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-5xl shadow-2xl"
            >
              🪙
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm whitespace-nowrap shadow-lg"
            >
              <Sparkles className="inline w-4 h-4 text-amber-400 mr-1" />
              ¡Sigue así!
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
