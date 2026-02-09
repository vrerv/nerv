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
      challenge_records: {
        Row: {
          challenge_code: string
          completed: boolean | null
          date: number
          owner_id: string
          records: Json | null
        }
        Insert: {
          challenge_code: string
          completed?: boolean | null
          date: number
          owner_id: string
          records?: Json | null
        }
        Update: {
          challenge_code?: string
          completed?: boolean | null
          date?: number
          owner_id?: string
          records?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_records_challenge_code_fkey"
            columns: ["challenge_code"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["code"]
          }
        ]
      }
      challenges: {
        Row: {
          code: string
          created_at: string
          description: string
          name: string
          open_level: number
          owner_id: string | null
          prompt: string | null
          verification: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          name: string
          open_level?: number
          owner_id?: string | null
          prompt?: string | null
          verification: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          name?: string
          open_level?: number
          owner_id?: string | null
          prompt?: string | null
          verification?: string
        }
        Relationships: []
      }
      periods: {
        Row: {
          created_at: string
          id: number
          is_holiday: boolean | null
          name: string
          weeks: Json
        }
        Insert: {
          created_at?: string
          id?: number
          is_holiday?: boolean | null
          name: string
          weeks?: Json
        }
        Update: {
          created_at?: string
          id?: number
          is_holiday?: boolean | null
          name?: string
          weeks?: Json
        }
        Relationships: []
      }
      routines: {
        Row: {
          challenges: string[] | null
          created_at: string
          id: number
          name: string | null
          open_level: number | null
          owner_id: string
          period_id: number | null
        }
        Insert: {
          challenges?: string[] | null
          created_at?: string
          id?: number
          name?: string | null
          open_level?: number | null
          owner_id: string
          period_id?: number | null
        }
        Update: {
          challenges?: string[] | null
          created_at?: string
          id?: number
          name?: string | null
          open_level?: number | null
          owner_id?: string
          period_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routines_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "periods"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          created_at: string
          id: number
          name: string
          open_level: number
          url: string
          configuration: Json | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
          open_level?: number
          url: string
          configuration?: Json | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          open_level?: number
          url?: string
          configuration?: Json | null
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

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
