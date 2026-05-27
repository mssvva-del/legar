/**
 * Database types для Supabase.
 * Після генерації через `supabase gen types typescript` — замінити цей файл.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── LEADS ────────────────────────────────────────────────────────────────────

export interface LeadRow {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
  created_at: string;
}

export interface LeadInsert {
  id?: number;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  service?: string | null;
  message?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  status?: string;
  created_at?: string;
}

// ─── LAWYER APPLICATIONS ──────────────────────────────────────────────────────

export interface LawyerApplicationRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  naau_certificate: string;
  years_practice: number;
  specializations: string[];
  monthly_capacity: number | null;
  has_military_practice: boolean | null;
  comment: string | null;
  status: string;
  created_at: string;
}

export interface LawyerApplicationInsert {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  naau_certificate: string;
  years_practice: number;
  specializations: string[];
  monthly_capacity?: number | null;
  has_military_practice?: boolean | null;
  comment?: string | null;
  status?: string;
  created_at?: string;
}

// ─── PROFILES ─────────────────────────────────────────────────────────────────

export type UserRole = "client" | "lawyer" | "admin";

export interface ProfileRow {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  naau_certificate: string | null;
  bio: string | null;
  specializations: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  specializations?: string[];
}

// ─── CASES ────────────────────────────────────────────────────────────────────

export type CaseStatus =
  | "lead"
  | "contract"
  | "paid"
  | "in_progress"
  | "closed"
  | "refunded";

export interface CaseRow {
  id: string;
  client_id: string;
  lawyer_id: string | null;
  service_slug: string;
  service_title: string;
  price_uah: number;
  status: CaseStatus;
  description: string | null;
  city: string | null;
  urgency: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseInsert {
  id?: string;
  client_id: string;
  lawyer_id?: string | null;
  service_slug: string;
  service_title: string;
  price_uah: number;
  status?: CaseStatus;
  description?: string | null;
  city?: string | null;
  urgency?: string | null;
  notes?: string | null;
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────

export interface DocumentRow {
  id: string;
  case_id: string;
  uploaded_by: string;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  is_signed: boolean;
  created_at: string;
}

export interface DocumentInsert {
  id?: string;
  case_id: string;
  uploaded_by: string;
  storage_path: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  is_signed?: boolean;
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export interface MessageRow {
  id: string;
  case_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageInsert {
  id?: string;
  case_id: string;
  sender_id: string;
  body: string;
  is_read?: boolean;
}

// ─── DATABASE ─────────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        Relationships: [];
      };
      lawyer_applications: {
        Row: LawyerApplicationRow;
        Insert: LawyerApplicationInsert;
        Update: Partial<LawyerApplicationInsert>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileRow;
        Update: ProfileUpdate;
        Relationships: [];
      };
      cases: {
        Row: CaseRow;
        Insert: CaseInsert;
        Update: Partial<CaseInsert>;
        Relationships: [];
      };
      documents: {
        Row: DocumentRow;
        Insert: DocumentInsert;
        Update: Partial<DocumentInsert>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
