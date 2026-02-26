export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  points: number
  streak: number
  currentStage: number
  badges: Badge[]
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  earnedAt: Date
}

export interface Stage {
  id: number
  title: string
  subtitle: string
  description: string
  color: string
  colorGradient: string
  lessons: number
  badge: string
  unlocked: boolean
  completed: boolean
}

export interface Lesson {
  id: string
  stageId: number
  order: number
  type: 'lesson' | 'reading' | 'simulator' | 'exam' | 'chest'
  title: string
  completed: boolean
}

export interface ExamQuestion {
  id: string
  type: 'multiple' | 'open'
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar?: string
  points: number
  stage: number
  streak: number
  badges: number
}

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export type ThemeColor = 'orange' | 'blue' | 'yellow' | 'green' | 'cyan' | 'amber' | 'purple' | 'red'
