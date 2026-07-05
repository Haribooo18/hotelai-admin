import type { Lead, LeadStatus } from "@/types/lead";

import {
  throwRepositoryError,
  type RepositoryContext,
} from "./context.types";

export class LeadsRepository {
  constructor(private readonly ctx: RepositoryContext) {}

  async getAll(limit = 50): Promise<Lead[]> {
    const { data, error } = await this.ctx.supabase.rpc("list_hotel_leads", {
      p_hotel_id: this.ctx.hotelId,
      p_limit: limit,
    });

    if (error) throwRepositoryError(error);

    return (data ?? []) as Lead[];
  }

  async getById(leadId: string): Promise<Lead | null> {
    const { data, error } = await this.ctx.supabase
      .from("leads")
      .select("*")
      .eq("lead_id", leadId)
      .eq("hotel_id", this.ctx.hotelId)
      .maybeSingle();

    if (error) throwRepositoryError(error);

    return (data as Lead | null) ?? null;
  }

  async create(): Promise<string> {
    throw new Error("Создание лидов через админку не поддерживается");
  }

  async update(leadId: string, row: { status: LeadStatus }): Promise<void> {
    await this.updateStatus(leadId, row.status);
  }

  async delete(): Promise<void> {
    throw new Error("Удаление лидов не поддерживается");
  }

  async updateStatus(leadId: string, status: LeadStatus): Promise<void> {
    const { error } = await this.ctx.supabase.rpc("update_lead_status", {
      p_lead_id: leadId,
      p_status: status,
    });

    if (error) throwRepositoryError(error);
  }
}
