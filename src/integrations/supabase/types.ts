export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      area_market_data: {
        Row: {
          area: string
          avg_price_sqft: number
          created_at: string
          id: string
          offplan_vs_ready_delta: number | null
          tenant_id: string | null
          trend_12m: string
          trend_percentage: number
          updated_at: string
        }
        Insert: {
          area: string
          avg_price_sqft: number
          created_at?: string
          id?: string
          offplan_vs_ready_delta?: number | null
          tenant_id?: string | null
          trend_12m: string
          trend_percentage?: number
          updated_at?: string
        }
        Update: {
          area?: string
          avg_price_sqft?: number
          created_at?: string
          id?: string
          offplan_vs_ready_delta?: number | null
          tenant_id?: string | null
          trend_12m?: string
          trend_percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_market_data_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_merchant: boolean | null
          logo_url: string | null
          name: string
          onboarded_at: string | null
          slug: string
          subscription_tier: string | null
          tenant_id: string | null
          total_projects: number | null
          years_active: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_merchant?: boolean | null
          logo_url?: string | null
          name: string
          onboarded_at?: string | null
          slug: string
          subscription_tier?: string | null
          tenant_id?: string | null
          total_projects?: number | null
          years_active?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_merchant?: boolean | null
          logo_url?: string | null
          name?: string
          onboarded_at?: string | null
          slug?: string
          subscription_tier?: string | null
          tenant_id?: string | null
          total_projects?: number | null
          years_active?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "developers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          created_at: string | null
          document_type: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          property_id: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          property_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          property_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string
          email_number: number
          email_type: string
          id: string
          lead_id: string
          scheduled_at: string
          sent_at: string | null
          status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          email_number?: number
          email_type?: string
          id?: string
          lead_id: string
          scheduled_at: string
          sent_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          email_number?: number
          email_type?: string
          id?: string
          lead_id?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          email: string
          golden_visa_interest: boolean | null
          id: string
          investment_capacity: number | null
          lead_status: string | null
          mortgage_data: Json | null
          name: string | null
          phone: string | null
          property_id: string | null
          quiz_responses: Json | null
          source: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          email: string
          golden_visa_interest?: boolean | null
          id?: string
          investment_capacity?: number | null
          lead_status?: string | null
          mortgage_data?: Json | null
          name?: string | null
          phone?: string | null
          property_id?: string | null
          quiz_responses?: Json | null
          source?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          email?: string
          golden_visa_interest?: boolean | null
          id?: string
          investment_capacity?: number | null
          lead_status?: string | null
          mortgage_data?: Json | null
          name?: string | null
          phone?: string | null
          property_id?: string | null
          quiz_responses?: Json | null
          source?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          developer_id: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          developer_id: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          developer_id?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_invites_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_users: {
        Row: {
          created_at: string
          developer_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          developer_id: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          developer_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_users_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          interests: string[] | null
          is_active: boolean
          source: string | null
          subscribed_at: string
          tenant_id: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          interests?: string[] | null
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          tenant_id?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          interests?: string[] | null
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          tenant_id?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          architect: string | null
          area: string
          bedrooms: number[] | null
          brochure_url: string | null
          community: string | null
          completion_date: string | null
          construction_percent: number | null
          construction_stage: string | null
          created_at: string
          description: string | null
          developer_id: string | null
          exclusive_amenities: Json | null
          features: Json | null
          golden_visa_eligible: boolean | null
          id: string
          last_edited_by: string | null
          latitude: number | null
          lifestyle_description: string | null
          lifestyle_tags: string[] | null
          listing_status: string | null
          location: string
          longitude: number | null
          name: string
          payment_plan: string | null
          post_handover_percent: number | null
          post_handover_years: number | null
          price_from: number
          price_to: number | null
          roi_estimate: number | null
          slug: string
          status: string | null
          submitted_by: string | null
          tagline: string | null
          tenant_id: string | null
          updated_at: string
          view_type: string[] | null
          virtual_tour_url: string | null
        }
        Insert: {
          architect?: string | null
          area: string
          bedrooms?: number[] | null
          brochure_url?: string | null
          community?: string | null
          completion_date?: string | null
          construction_percent?: number | null
          construction_stage?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string | null
          exclusive_amenities?: Json | null
          features?: Json | null
          golden_visa_eligible?: boolean | null
          id?: string
          last_edited_by?: string | null
          latitude?: number | null
          lifestyle_description?: string | null
          lifestyle_tags?: string[] | null
          listing_status?: string | null
          location: string
          longitude?: number | null
          name: string
          payment_plan?: string | null
          post_handover_percent?: number | null
          post_handover_years?: number | null
          price_from: number
          price_to?: number | null
          roi_estimate?: number | null
          slug: string
          status?: string | null
          submitted_by?: string | null
          tagline?: string | null
          tenant_id?: string | null
          updated_at?: string
          view_type?: string[] | null
          virtual_tour_url?: string | null
        }
        Update: {
          architect?: string | null
          area?: string
          bedrooms?: number[] | null
          brochure_url?: string | null
          community?: string | null
          completion_date?: string | null
          construction_percent?: number | null
          construction_stage?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string | null
          exclusive_amenities?: Json | null
          features?: Json | null
          golden_visa_eligible?: boolean | null
          id?: string
          last_edited_by?: string | null
          latitude?: number | null
          lifestyle_description?: string | null
          lifestyle_tags?: string[] | null
          listing_status?: string | null
          location?: string
          longitude?: number | null
          name?: string
          payment_plan?: string | null
          post_handover_percent?: number | null
          post_handover_years?: number | null
          price_from?: number
          price_to?: number | null
          roi_estimate?: number | null
          slug?: string
          status?: string | null
          submitted_by?: string | null
          tagline?: string | null
          tenant_id?: string | null
          updated_at?: string
          view_type?: string[] | null
          virtual_tour_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      property_highlights: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string
          id: string
          property_id: string
          tenant_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon: string
          id?: string
          property_id: string
          tenant_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          property_id?: string
          tenant_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_highlights_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_highlights_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          is_primary: boolean | null
          property_id: string
          tenant_id: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          property_id: string
          tenant_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          property_id?: string
          tenant_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_images_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          created_at: string
          id: string
          property_id: string
          referrer: string | null
          session_id: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          referrer?: string | null
          session_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          referrer?: string | null
          session_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_views_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          email: string
          filters: Json
          frequency: string
          id: string
          is_active: boolean
          last_notified_at: string | null
          name: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          filters?: Json
          frequency?: string
          id?: string
          is_active?: boolean
          last_notified_at?: string | null
          name?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          filters?: Json
          frequency?: string
          id?: string
          is_active?: boolean
          last_notified_at?: string | null
          name?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          brand_display: string
          brand_name: string
          brand_tagline: string | null
          country_code: string
          created_at: string
          currency_code: string
          currency_locale: string | null
          currency_symbol: string
          domain: string
          email: string
          features: Json | null
          id: string
          is_active: boolean | null
          mortgage_config: Json | null
          office_location: Json | null
          phone: string | null
          regulatory_body: string | null
          regulatory_number: string | null
          residency_program: Json | null
          seo_config: Json | null
          slug: string
          theme: Json | null
          updated_at: string
          whatsapp_number: string | null
          working_hours: Json | null
        }
        Insert: {
          brand_display: string
          brand_name: string
          brand_tagline?: string | null
          country_code?: string
          created_at?: string
          currency_code?: string
          currency_locale?: string | null
          currency_symbol?: string
          domain: string
          email: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          mortgage_config?: Json | null
          office_location?: Json | null
          phone?: string | null
          regulatory_body?: string | null
          regulatory_number?: string | null
          residency_program?: Json | null
          seo_config?: Json | null
          slug: string
          theme?: Json | null
          updated_at?: string
          whatsapp_number?: string | null
          working_hours?: Json | null
        }
        Update: {
          brand_display?: string
          brand_name?: string
          brand_tagline?: string | null
          country_code?: string
          created_at?: string
          currency_code?: string
          currency_locale?: string | null
          currency_symbol?: string
          domain?: string
          email?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          mortgage_config?: Json | null
          office_location?: Json | null
          phone?: string | null
          regulatory_body?: string | null
          regulatory_number?: string | null
          residency_program?: Json | null
          seo_config?: Json | null
          slug?: string
          theme?: Json | null
          updated_at?: string
          whatsapp_number?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          country: string
          created_at: string
          id: string
          is_featured: boolean | null
          name: string
          property_name: string | null
          quote: string
          rating: number | null
          tenant_id: string | null
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name: string
          property_name?: string | null
          quote: string
          rating?: number | null
          tenant_id?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name?: string
          property_name?: string | null
          quote?: string
          rating?: number | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_developer_id: { Args: { _user_id: string }; Returns: string }
      has_merchant_role: {
        Args: {
          _developer_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_belongs_to_developer: {
        Args: { _developer_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
