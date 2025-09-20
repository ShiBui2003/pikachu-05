export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
type Priority = 'low' | 'medium' | 'high'

export interface Database {
  public: {
    Tables: {
      issues: {
        Row: {
          id: string
          created_at: string
          updated_at?: string
          title: string
          description: string
          status: IssueStatus
          priority: Priority
          category: string
          user_id: string
          image_url: string | null
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          status?: IssueStatus
          priority?: Priority
          category: string
          user_id: string
          image_url?: string | null
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          status?: IssueStatus
          priority?: Priority
          category?: string
          user_id?: string
          image_url?: string | null
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          level: number
          permissions: any | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          level: number
          permissions?: any | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          level?: number
          permissions?: any | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          created_at: string | null
          updated_at: string | null
          role_id: string | null
          department_id: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
          role_id?: string | null
          department_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string | null
          updated_at?: string | null
          role_id?: string | null
          department_id?: string | null
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
