export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      answers: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          followup: string | null
          id: number
          log_from: string | null
          org_id: number | null
          org_name: string | null
          question_id: number
          retrieved_1: string | null
          retrieved_2: string | null
          retrieved_3: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          followup?: string | null
          id?: number
          log_from?: string | null
          org_id?: number | null
          org_name?: string | null
          question_id: number
          retrieved_1?: string | null
          retrieved_2?: string | null
          retrieved_3?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          followup?: string | null
          id?: number
          log_from?: string | null
          org_id?: number | null
          org_name?: string | null
          question_id?: number
          retrieved_1?: string | null
          retrieved_2?: string | null
          retrieved_3?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      category_tag: {
        Row: {
          category_id: number
          created_at: string
          tag: string
          updated_at: string | null
        }
        Insert: {
          category_id?: number
          created_at?: string
          tag: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number
          created_at?: string
          tag?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_category_tag_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "knowledge_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          id: number
          name: string
          org_key: string
          status: number
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          org_key: string
          status?: number
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          org_key?: string
          status?: number
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_jobs_org_key_fkey"
            columns: ["org_key"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["key"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          answer: string | null
          category: string | null
          caution_required: boolean | null
          created_at: string
          frequently_asked: boolean | null
          id: number
          intent: string | null
          org_id: number
          org_key: string | null
          org_name: string | null
          question: string | null
          similar_questions: string | null
          support_manual: string | null
          updated_at: string
        }
        Insert: {
          answer?: string | null
          category?: string | null
          caution_required?: boolean | null
          created_at?: string
          frequently_asked?: boolean | null
          id?: number
          intent?: string | null
          org_id: number
          org_key?: string | null
          org_name?: string | null
          question?: string | null
          similar_questions?: string | null
          support_manual?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string | null
          category?: string | null
          caution_required?: boolean | null
          created_at?: string
          frequently_asked?: boolean | null
          id?: number
          intent?: string | null
          org_id?: number
          org_key?: string | null
          org_name?: string | null
          question?: string | null
          similar_questions?: string | null
          support_manual?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          org_key: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          org_key: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          org_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_knowledge_categories_org_key_fkey"
            columns: ["org_key"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["key"]
          },
        ]
      }
      organizations: {
        Row: {
          admin_channel: string | null
          company_info_policy: string | null
          created_at: string
          dev_channel: string | null
          id: number
          key: string
          name_eng: string
          name_kor: string
          updated_at: string | null
        }
        Insert: {
          admin_channel?: string | null
          company_info_policy?: string | null
          created_at?: string
          dev_channel?: string | null
          id?: number
          key: string
          name_eng: string
          name_kor: string
          updated_at?: string | null
        }
        Update: {
          admin_channel?: string | null
          company_info_policy?: string | null
          created_at?: string
          dev_channel?: string | null
          id?: number
          key?: string
          name_eng?: string
          name_kor?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      question_image: {
        Row: {
          created_at: string
          image_url: string | null
          question_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          image_url?: string | null
          question_id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          image_url?: string | null
          question_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_question_image_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      question_tag: {
        Row: {
          created_at: string
          question_id: number
          tag: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          question_id?: number
          tag?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          question_id?: number
          tag?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_question_tag_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_question_tag_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "category_tag"
            referencedColumns: ["tag"]
          },
        ]
      }
      questions: {
        Row: {
          "\bcategory": string | null
          created_at: string
          id: number
          log_from: string | null
          org_id: number | null
          org_name: string | null
          updated_at: string | null
          user_id: string | null
          user_question: string | null
        }
        Insert: {
          "\bcategory"?: string | null
          created_at?: string
          id?: number
          log_from?: string | null
          org_id?: number | null
          org_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_question?: string | null
        }
        Update: {
          "\bcategory"?: string | null
          created_at?: string
          id?: number
          log_from?: string | null
          org_id?: number | null
          org_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_question?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          created_at: string
          id: number
          org_key: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          org_key: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          org_key?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_uploads_org_key_fkey"
            columns: ["org_key"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "public_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organizations: {
        Row: {
          created_at: string
          id: number
          org_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          org_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "user_organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string | null
          instance_id: string | null
          invited_at: string | null
          is_sso_user: boolean | null
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
