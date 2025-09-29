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
      analytics_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          data: Json
          expires_at: string
          id: string
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          data: Json
          expires_at: string
          id?: string
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          data?: Json
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          categories: Database["public"]["Enums"]["issue_category"][]
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          response_time_hours: number | null
          updated_at: string | null
        }
        Insert: {
          categories: Database["public"]["Enums"]["issue_category"][]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          response_time_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          categories?: Database["public"]["Enums"]["issue_category"][]
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          response_time_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      issue_assignments: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          created_at: string | null
          department_id: string | null
          id: string
          issue_id: string
          notes: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string | null
          department_id?: string | null
          id?: string
          issue_id: string
          notes?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string | null
          department_id?: string | null
          id?: string
          issue_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_assignments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          }
        ]
      }
      issue_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          is_status_update: boolean | null
          issue_id: string
          new_status: Database["public"]["Enums"]["issue_status"] | null
          old_status: Database["public"]["Enums"]["issue_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          is_status_update?: boolean | null
          issue_id: string
          new_status?: Database["public"]["Enums"]["issue_status"] | null
          old_status?: Database["public"]["Enums"]["issue_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          is_status_update?: boolean | null
          issue_id?: string
          new_status?: Database["public"]["Enums"]["issue_status"] | null
          old_status?: Database["public"]["Enums"]["issue_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      issue_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          issue_id: string
          photo_url: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          issue_id: string
          photo_url: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          issue_id?: string
          photo_url?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_photos_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      issue_upvotes: {
        Row: {
          created_at: string | null
          id: string
          issue_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          issue_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_upvotes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      issues: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["issue_category"]
          comments_count: number | null
          created_at: string | null
          department_id: string | null
          description: string
          id: string
          is_anonymous: boolean | null
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          location_point: unknown | null
          priority: Database["public"]["Enums"]["issue_priority"] | null
          reported_by: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["issue_status"] | null
          title: string
          updated_at: string | null
          upvotes_count: number | null
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["issue_category"]
          comments_count?: number | null
          created_at?: string | null
          department_id?: string | null
          description: string
          id?: string
          is_anonymous?: boolean | null
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_point?: unknown | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          reported_by?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title: string
          updated_at?: string | null
          upvotes_count?: number | null
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          comments_count?: number | null
          created_at?: string | null
          department_id?: string | null
          description?: string
          id?: string
          is_anonymous?: boolean | null
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_point?: unknown | null
          priority?: Database["public"]["Enums"]["issue_priority"] | null
          reported_by?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string
          updated_at?: string | null
          upvotes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          issue_id: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          issue_id?: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          issue_id?: string | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department_id: string | null
          email: string
          full_name: string
          id: string
          is_anonymous_default: boolean | null
          notifications_email: boolean | null
          notifications_push: boolean | null
          notifications_sms: boolean | null
          phone: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          email: string
          full_name: string
          id: string
          is_anonymous_default?: boolean | null
          notifications_email?: boolean | null
          notifications_push?: boolean | null
          notifications_sms?: boolean | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          email?: string
          full_name?: string
          id?: string
          is_anonymous_default?: boolean | null
          notifications_email?: boolean | null
          notifications_push?: boolean | null
          notifications_sms?: boolean | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
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
      issue_category:
        | "potholes"
        | "garbage"
        | "streetlights"
        | "water_leaks"
        | "traffic"
        | "noise"
        | "pollution"
        | "public_safety"
        | "infrastructure"
        | "other"
      issue_priority: "low" | "medium" | "high" | "urgent"
      issue_status:
        | "submitted"
        | "acknowledged"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "closed"
      notification_type:
        | "issue_update"
        | "assignment"
        | "comment"
        | "upvote"
        | "resolved"
      user_role: "citizen" | "municipal_staff" | "admin"
    }
  }
}