export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          points: number
          streak: number
          current_stage: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar?: string | null
          points?: number
          streak?: number
          current_stage?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string | null
          points?: number
          streak?: number
          current_stage?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
        }
      }
      badges: {
        Row: {
          id: string
          user_id: string
          badge_name: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_name: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_name?: string
          earned_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
