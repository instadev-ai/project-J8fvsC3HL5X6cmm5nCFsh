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
      agents: {
        Row: {
          company_id: string | null
          created_at: string
          deactivated_at: string | null
          first_name: string
          id: string
          last_name: string
          license: string | null
          phone: number | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          deactivated_at?: string | null
          first_name: string
          id: string
          last_name: string
          license?: string | null
          phone?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          deactivated_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          license?: string | null
          phone?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_properties: {
        Row: {
          contract_id: string
          property_id: string
          renting_price: number | null
          selling_price: number | null
        }
        Insert: {
          contract_id: string
          property_id: string
          renting_price?: number | null
          selling_price?: number | null
        }
        Update: {
          contract_id?: string
          property_id?: string
          renting_price?: number | null
          selling_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_properties_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          agent_id: string | null
          agents: string[]
          company_id: string | null
          contract_number: number | null
          created_at: string
          customer_id: string | null
          document_id: string | null
          id: string
          properties: string[]
          rent_comission: number | null
          rent_comission_type:
            | Database["public"]["Enums"]["comission_type"]
            | null
          sell_comission: number | null
          sell_comission_type:
            | Database["public"]["Enums"]["comission_type"]
            | null
          type: Database["public"]["Enums"]["contract_type"]
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          agent_id?: string | null
          agents: string[]
          company_id?: string | null
          contract_number?: number | null
          created_at?: string
          customer_id?: string | null
          document_id?: string | null
          id?: string
          properties: string[]
          rent_comission?: number | null
          rent_comission_type?:
            | Database["public"]["Enums"]["comission_type"]
            | null
          sell_comission?: number | null
          sell_comission_type?:
            | Database["public"]["Enums"]["comission_type"]
            | null
          type: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          agent_id?: string | null
          agents?: string[]
          company_id?: string | null
          contract_number?: number | null
          created_at?: string
          customer_id?: string | null
          document_id?: string | null
          id?: string
          properties?: string[]
          rent_comission?: number | null
          rent_comission_type?:
            | Database["public"]["Enums"]["comission_type"]
            | null
          sell_comission?: number | null
          sell_comission_type?:
            | Database["public"]["Enums"]["comission_type"]
            | null
          type?: Database["public"]["Enums"]["contract_type"]
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_customer_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          agent_id: string | null
          company_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          agent_id: string | null
          company_id: string | null
          created_at: string
          id: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
          url: string
        }
        Insert: {
          agent_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          url: string
        }
        Update: {
          agent_id?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          company_id: string
          created_at: string
          id: number
          phone_number: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: number
          phone_number: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: number
          phone_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: Json
          agent_id: string | null
          apartment_number: string | null
          building_number: string | null
          company_id: string | null
          created_at: string
          floor_number: number | null
          id: string
          owner_name: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          renting_price: number
          rooms: number
          selling_price: number
          sq_meters: number | null
          updated_at: string
        }
        Insert: {
          address: Json
          agent_id?: string | null
          apartment_number?: string | null
          building_number?: string | null
          company_id?: string | null
          created_at?: string
          floor_number?: number | null
          id?: string
          owner_name?: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          renting_price?: number
          rooms?: number
          selling_price?: number
          sq_meters?: number | null
          updated_at?: string
        }
        Update: {
          address?: Json
          agent_id?: string | null
          apartment_number?: string | null
          building_number?: string | null
          company_id?: string | null
          created_at?: string
          floor_number?: number | null
          id?: string
          owner_name?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          renting_price?: number
          rooms?: number
          selling_price?: number
          sq_meters?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
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
      comission_type: "fixed" | "precent"
      contract_type:
        | "interested"
        | "cooperation"
        | "property_owner"
        | "exclusivity_agreement"
      document_type: "pdf"
      property_type:
        | "residentialBuilding"
        | "apartment"
        | "penthouse"
        | "gardenApartment"
        | "duplex"
        | "triplex"
        | "housingUnit"
        | "tourismAndVacation"
        | "studioLoft"
        | "basement"
        | "lot"
        | "assistedLiving"
        | "storage"
        | "parking"
        | "purchaseGroup"
        | "offices"
        | "commercialSpace"
        | "coWorkingSpace"
        | "halls"
        | "industrialTests"
        | "warehouses"
        | "plots"
        | "officeBuilding"
        | "parkingLot"
        | "cellar"
        | "general"
        | "studio"
        | "hotel"
        | "clinic"
        | "privateHouse"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
