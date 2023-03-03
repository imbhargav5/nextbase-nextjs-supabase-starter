export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      accounts: {
        Row: {
          access_token: string | null
          access_token_expires: string | null
          compound_id: string
          created_at: string
          id: string
          provider_account_id: string
          provider_id: string
          provider_type: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires?: string | null
          compound_id: string
          created_at?: string
          id: string
          provider_account_id: string
          provider_id: string
          provider_type: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_expires?: string | null
          compound_id?: string
          created_at?: string
          id?: string
          provider_account_id?: string
          provider_id?: string
          provider_type?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
      }
      api_keys: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
      }
      app_admins: {
        Row: {
          role: Database["public"]["Enums"]["app_admin_role"] | null
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["app_admin_role"] | null
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_admin_role"] | null
          user_id?: string
        }
      }
      app_settings: {
        Row: {
          id: number
          maintenance_message: string | null
          maintenance_status:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
          scheduled_maintenance_ends_at: string | null
        }
        Insert: {
          id?: number
          maintenance_message?: string | null
          maintenance_status?:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
          scheduled_maintenance_ends_at?: string | null
        }
        Update: {
          id?: number
          maintenance_message?: string | null
          maintenance_status?:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
          scheduled_maintenance_ends_at?: string | null
        }
      }
      banned_emails: {
        Row: {
          allow_access: boolean
          created_at: string
          email: string
          id: string
          times_banned: number
          updated_at: string
        }
        Insert: {
          allow_access?: boolean
          created_at?: string
          email: string
          id: string
          times_banned?: number
          updated_at?: string
        }
        Update: {
          allow_access?: boolean
          created_at?: string
          email?: string
          id?: string
          times_banned?: number
          updated_at?: string
        }
      }
      customers: {
        Row: {
          organization_id: string
          stripe_customer_id: string
        }
        Insert: {
          organization_id: string
          stripe_customer_id: string
        }
        Update: {
          organization_id?: string
          stripe_customer_id?: string
        }
      }
      legacy_subscriptions: {
        Row: {
          billing_end: string
          billing_start: string
          created_at: string
          credits_reset_at: string | null
          id: string
          promo_applied: boolean | null
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at: string
        }
        Insert: {
          billing_end: string
          billing_start: string
          created_at?: string
          credits_reset_at?: string | null
          id: string
          promo_applied?: boolean | null
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at?: string
        }
        Update: {
          billing_end?: string
          billing_start?: string
          created_at?: string
          credits_reset_at?: string | null
          id?: string
          promo_applied?: boolean | null
          status?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
          updated_at?: string
        }
      }
      organization_credits: {
        Row: {
          credits: number
          organization_id: string
        }
        Insert: {
          credits: number
          organization_id: string
        }
        Update: {
          credits?: number
          organization_id?: string
        }
      }
      organization_team_invitations: {
        Row: {
          created_at: string
          id: string
          invitee_team_role: Database["public"]["Enums"]["team_member_role"]
          invitee_user_email: string
          invitee_user_id: string | null
          inviter_user_id: string
          organization_id: string
          status: Database["public"]["Enums"]["team_invitation_link_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_team_role?: Database["public"]["Enums"]["team_member_role"]
          invitee_user_email: string
          invitee_user_id?: string | null
          inviter_user_id: string
          organization_id: string
          status?: Database["public"]["Enums"]["team_invitation_link_status"]
        }
        Update: {
          created_at?: string
          id?: string
          invitee_team_role?: Database["public"]["Enums"]["team_member_role"]
          invitee_user_email?: string
          invitee_user_id?: string | null
          inviter_user_id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["team_invitation_link_status"]
        }
      }
      organization_team_members: {
        Row: {
          created_at: string
          id: number
          member_id: string
          member_role: Database["public"]["Enums"]["team_member_role"]
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          member_id: string
          member_role: Database["public"]["Enums"]["team_member_role"]
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: number
          member_id?: string
          member_role?: Database["public"]["Enums"]["team_member_role"]
          organization_id?: string
        }
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          title?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string
        }
      }
      organizations_private_info: {
        Row: {
          billing_address: Json | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          billing_address?: Json | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          billing_address?: Json | null
          id?: string
          payment_method?: Json | null
        }
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_number: string
          invoice_url: string
          invoiceId: string
          paid_at: string
          provider: string
          subscription_id: string
          updated_at: string
          user_email: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id: string
          invoice_number: string
          invoice_url: string
          invoiceId: string
          paid_at: string
          provider: string
          subscription_id: string
          updated_at?: string
          user_email: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_number?: string
          invoice_url?: string
          invoiceId?: string
          paid_at?: string
          provider?: string
          subscription_id?: string
          updated_at?: string
          user_email?: string
        }
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
      }
      runs: {
        Row: {
          created_at: string
          duration_in_secs: number
          etag: string
          file_key: string
          id: string | null
          organization_id: string | null
          questGenRuns: number
          status: Database["public"]["Enums"]["RUN_STATUS"]
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          duration_in_secs: number
          etag: string
          file_key: string
          id?: string | null
          organization_id?: string | null
          questGenRuns?: number
          status: Database["public"]["Enums"]["RUN_STATUS"]
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          duration_in_secs?: number
          etag?: string
          file_key?: string
          id?: string | null
          organization_id?: string | null
          questGenRuns?: number
          status?: Database["public"]["Enums"]["RUN_STATUS"]
          updated_at?: string
          uuid?: string
        }
      }
      sessions: {
        Row: {
          access_token: string
          created_at: string
          expires: string
          id: string
          session_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires: string
          id: string
          session_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires?: string
          id?: string
          session_token?: string
          updated_at?: string
          user_id?: string
        }
      }
      stripe_profiles: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          stripe_customer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
          user_id?: string
        }
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          organization_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
        }
      }
      subtitles: {
        Row: {
          created_at: string
          id: string | null
          modified: string | null
          original: string
          run_id: string | null
          run_uuid: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: string | null
          modified?: string | null
          original: string
          run_id?: string | null
          run_uuid: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          id?: string | null
          modified?: string | null
          original?: string
          run_id?: string | null
          run_uuid?: string
          updated_at?: string
          uuid?: string
        }
      }
      user_private_info: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
        }
      }
      users: {
        Row: {
          created_at: string
          credits: number
          email: string
          email_verified: string | null
          id: string
          image: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits?: number
          email: string
          email_verified?: string | null
          id: string
          image?: string | null
          name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          email?: string
          email_verified?: string | null
          id?: string
          image?: string | null
          name?: string
          updated_at?: string
        }
      }
      verification_requests: {
        Row: {
          created_at: string
          expires: string
          id: string
          identifier: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires: string
          id: string
          identifier: string
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires?: string
          id?: string
          identifier?: string
          token?: string
          updated_at?: string
        }
      }
    }
    Views: {
      app_admin_view_all_organizations: {
        Row: {
          created_at: string | null
          id: string | null
          owner_email: string | null
          owner_full_name: string | null
          team_members_count: number | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          owner_email?: never
          owner_full_name?: never
          team_members_count?: never
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          owner_email?: never
          owner_full_name?: never
          team_members_count?: never
          title?: string | null
        }
      }
      app_admin_view_all_users: {
        Row: {
          avatar_url: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_app_admin: boolean | null
          is_confirmed: boolean | null
          updated_at: string | null
        }
      }
    }
    Functions: {
      check_if_authenticated_user_owns_email: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      check_if_user_is_app_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      decrement_credits: {
        Args: {
          org_id: string
          amount: number
        }
        Returns: undefined
      }
      disable_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enable_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_organization_team_admin_ids: {
        Args: {
          organization_id: string
        }
        Returns: {
          member_id: string
        }[]
      }
      get_organization_team_member_ids: {
        Args: {
          organization_id: string
        }
        Returns: {
          member_id: string
        }[]
      }
      is_app_in_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_app_not_in_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      make_user_app_admin: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      remove_app_admin_privilege_for_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      set_run_error: {
        Args: {
          arg_uuid: string
        }
        Returns: undefined
      }
      set_run_success: {
        Args: {
          arg_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_admin_role: "moderator" | "admin" | "super_admin"
      maintenance_status: "inactive" | "active" | "scheduled"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      RUN_STATUS: "PENDING" | "SUCCESS" | "ERROR"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
      team_invitation_link_status:
        | "active"
        | "finished_accepted"
        | "finished_declined"
        | "inactive"
      team_joining_status:
        | "invited"
        | "joinied"
        | "declined_invitation"
        | "joined"
      team_member_role: "owner" | "admin" | "member" | "readonly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
