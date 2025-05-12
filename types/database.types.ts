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
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          hours: Json | null
          faqs: Json | null
          ordering_instructions: string | null
          created_at: string
          updated_at: string
          trial_plan: boolean | null
          trial_expiration_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          hours?: Json | null
          faqs?: Json | null
          ordering_instructions?: string | null
          created_at?: string
          updated_at?: string
          trial_plan?: boolean | null
          trial_expiration_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          hours?: Json | null
          faqs?: Json | null
          ordering_instructions?: string | null
          created_at?: string
          updated_at?: string
          trial_plan?: boolean | null
          trial_expiration_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          last_sign_in_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          is_super_admin: boolean | null
          role: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          is_super_admin?: boolean | null
          role?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          is_super_admin?: boolean | null
          role?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
