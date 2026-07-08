


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."is_hotel_member"("hid" "text") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public.memberships m
    where m.user_id = auth.uid()
      and m.hotel_id = hid
  );
$$;


ALTER FUNCTION "public"."is_hotel_member"("hid" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "lead_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "hotel_id" "text" NOT NULL,
    "source" "text" DEFAULT 'chat'::"text",
    "guest_name" "text",
    "phone" "text",
    "email" "text",
    "room_type" "text",
    "check_in" "date",
    "check_out" "date",
    "guests" integer,
    "status" "text" DEFAULT 'new'::"text",
    "comment" "text",
    "notified" boolean DEFAULT false,
    "session_id" "text",
    CONSTRAINT "leads_contact_format_check" CHECK (((("phone" IS NULL) OR ("phone" ~ '^\+?[0-9]{8,15}$'::"text")) AND (("email" IS NULL) OR ("email" ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'::"text")))),
    CONSTRAINT "leads_dates_check" CHECK ((("check_in" IS NULL) OR ("check_out" IS NULL) OR ("check_out" > "check_in"))),
    CONSTRAINT "leads_guests_check" CHECK ((("guests" IS NULL) OR ("guests" >= 0))),
    CONSTRAINT "leads_source_check" CHECK (("source" = ANY (ARRAY['chat'::"text", 'telegram'::"text", 'web'::"text", 'whatsapp'::"text", 'instagram'::"text", 'manual'::"text"]))),
    CONSTRAINT "leads_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'contacted'::"text", 'confirmed'::"text", 'cancelled'::"text", 'lost'::"text"])))
);

ALTER TABLE ONLY "public"."leads" REPLICA IDENTITY FULL;


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."list_hotel_leads"("p_hotel_id" "text", "p_limit" integer DEFAULT 50) RETURNS SETOF "public"."leads"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if not public.is_hotel_member(p_hotel_id) then
    raise exception 'access denied for hotel %', p_hotel_id using errcode = '42501';
  end if;

  return query
    select *
    from public.leads
    where hotel_id = p_hotel_id
    order by created_at desc
    limit greatest(coalesce(p_limit, 50), 0);
end;
$$;


ALTER FUNCTION "public"."list_hotel_leads"("p_hotel_id" "text", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_lead_status"("p_lead_id" "uuid", "p_status" "text") RETURNS "public"."leads"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_hotel_id text;
  v_row public.leads;
begin
  select hotel_id into v_hotel_id
  from public.leads
  where lead_id = p_lead_id;

  if v_hotel_id is null then
    raise exception 'lead % not found', p_lead_id using errcode = 'P0002';
  end if;

  if not public.is_hotel_member(v_hotel_id) then
    raise exception 'access denied for hotel %', v_hotel_id using errcode = '42501';
  end if;

  if p_status not in ('new', 'contacted', 'confirmed', 'cancelled') then
    raise exception 'invalid lead status %', p_status using errcode = '22023';
  end if;

  update public.leads
  set status = p_status
  where lead_id = p_lead_id
  returning * into v_row;

  return v_row;
end;
$$;


ALTER FUNCTION "public"."update_lead_status"("p_lead_id" "uuid", "p_status" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."activity_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "actor_type" "text" DEFAULT 'system'::"text" NOT NULL,
    "actor_id" "text",
    "event_type" "text" NOT NULL,
    "message" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."activity_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_actions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "conversation_id" "uuid",
    "message_id" "uuid",
    "action_type" "text" NOT NULL,
    "tool_name" "text",
    "input" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "output" "jsonb",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "model" "text",
    "token_usage" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "cost_usd" numeric(12,6),
    "duration_ms" integer,
    "request_id" "text",
    CONSTRAINT "ai_actions_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."ai_actions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_observability_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "level" "text" NOT NULL,
    "event" "text" NOT NULL,
    "conversation_id" "uuid",
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ai_observability_logs_level_check" CHECK (("level" = ANY (ARRAY['debug'::"text", 'info'::"text", 'warn'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."ai_observability_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."availability" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "room_type" "text" NOT NULL,
    "day" "date" NOT NULL,
    "available" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."availability" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."booking_sessions" (
    "session_id" "text" NOT NULL,
    "hotel_id" "text" NOT NULL,
    "room_type" "text",
    "check_in" "date",
    "check_out" "date",
    "guests" integer,
    "guest_name" "text",
    "phone" "text",
    "email" "text",
    "comment" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "current_step" "text",
    CONSTRAINT "booking_sessions_dates_check" CHECK ((("check_in" IS NULL) OR ("check_out" IS NULL) OR ("check_out" > "check_in")))
);


ALTER TABLE "public"."booking_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "room_id" "uuid" NOT NULL,
    "guest_name" "text" NOT NULL,
    "guest_email" "text",
    "guest_phone" "text",
    "check_in" "date" NOT NULL,
    "check_out" "date" NOT NULL,
    "adults" integer DEFAULT 1 NOT NULL,
    "children" integer DEFAULT 0 NOT NULL,
    "total_price" numeric(10,2) NOT NULL,
    "status" "text" DEFAULT 'confirmed'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bookings_dates_check" CHECK (("check_out" > "check_in")),
    CONSTRAINT "bookings_occupancy_check" CHECK ((("adults" >= 0) AND ("children" >= 0))),
    CONSTRAINT "bookings_status_check" CHECK (("status" = ANY (ARRAY['confirmed'::"text", 'checked_in'::"text", 'checked_out'::"text", 'cancelled'::"text"]))),
    CONSTRAINT "bookings_total_price_check" CHECK (("total_price" >= (0)::numeric))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "session_id" "text" NOT NULL,
    "role" "text" NOT NULL,
    "message" "text" NOT NULL,
    "raw" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversation_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "assigned_by" "uuid",
    "is_active" boolean DEFAULT true NOT NULL,
    "assigned_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "unassigned_at" timestamp with time zone
);


ALTER TABLE "public"."conversation_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversation_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "tag" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."conversation_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "guest_name" "text" NOT NULL,
    "guest_email" "text",
    "guest_phone" "text",
    "channel" "text" DEFAULT 'website'::"text" NOT NULL,
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "priority" "text" DEFAULT 'normal'::"text" NOT NULL,
    "lead_id" "text",
    "subject" "text",
    "last_message_preview" "text",
    "last_message_at" timestamp with time zone,
    "unread_count" integer DEFAULT 0 NOT NULL,
    "assigned_to" "uuid",
    "is_guest_typing" boolean DEFAULT false NOT NULL,
    "internal_notes" "text",
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_ai_typing" boolean DEFAULT false NOT NULL,
    CONSTRAINT "conversations_channel_check" CHECK (("channel" = ANY (ARRAY['website'::"text", 'whatsapp'::"text", 'telegram'::"text", 'instagram'::"text", 'facebook_messenger'::"text", 'email'::"text"]))),
    CONSTRAINT "conversations_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'normal'::"text", 'high'::"text", 'urgent'::"text"]))),
    CONSTRAINT "conversations_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'assigned'::"text", 'ai_answering'::"text", 'waiting_guest'::"text", 'resolved'::"text", 'archived'::"text"]))),
    CONSTRAINT "conversations_unread_count_check" CHECK (("unread_count" >= 0))
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "country" "text",
    "city" "text",
    "notes" "text",
    "total_bookings" integer DEFAULT 0 NOT NULL,
    "total_spent" numeric DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_vip" boolean DEFAULT false NOT NULL,
    "is_favorite" boolean DEFAULT false NOT NULL,
    "avatar_url" "text",
    "deleted_at" timestamp with time zone,
    CONSTRAINT "guests_totals_check" CHECK ((("total_bookings" >= 0) AND ("total_spent" >= (0)::numeric)))
);


ALTER TABLE "public"."guests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hotel_ai_settings" (
    "hotel_id" "text" NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "model" "text" DEFAULT 'gpt-4o-mini'::"text" NOT NULL,
    "max_output_tokens" integer DEFAULT 1024 NOT NULL,
    "temperature" numeric(4,2) DEFAULT 0.30 NOT NULL,
    "rate_limit_per_minute" integer DEFAULT 30 NOT NULL,
    "timeout_ms" integer DEFAULT 60000 NOT NULL,
    "max_tool_rounds" integer DEFAULT 5 NOT NULL,
    "max_retries" integer DEFAULT 2 NOT NULL,
    "extra_instructions" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "top_p" numeric(4,2) DEFAULT 1.00 NOT NULL,
    "tool_choice" "text" DEFAULT 'auto'::"text" NOT NULL,
    "system_language" "text" DEFAULT 'ru'::"text" NOT NULL,
    CONSTRAINT "hotel_ai_settings_max_output_tokens_check" CHECK ((("max_output_tokens" >= 64) AND ("max_output_tokens" <= 16384))),
    CONSTRAINT "hotel_ai_settings_max_retries_check" CHECK ((("max_retries" >= 0) AND ("max_retries" <= 5))),
    CONSTRAINT "hotel_ai_settings_max_tool_rounds_check" CHECK ((("max_tool_rounds" >= 0) AND ("max_tool_rounds" <= 10))),
    CONSTRAINT "hotel_ai_settings_rate_limit_per_minute_check" CHECK ((("rate_limit_per_minute" >= 1) AND ("rate_limit_per_minute" <= 500))),
    CONSTRAINT "hotel_ai_settings_temperature_check" CHECK ((("temperature" >= (0)::numeric) AND ("temperature" <= (2)::numeric))),
    CONSTRAINT "hotel_ai_settings_timeout_ms_check" CHECK ((("timeout_ms" >= 5000) AND ("timeout_ms" <= 300000))),
    CONSTRAINT "hotel_ai_settings_tool_choice_check" CHECK (("tool_choice" = ANY (ARRAY['auto'::"text", 'none'::"text", 'required'::"text"]))),
    CONSTRAINT "hotel_ai_settings_top_p_check" CHECK ((("top_p" >= (0)::numeric) AND ("top_p" <= (1)::numeric)))
);


ALTER TABLE "public"."hotel_ai_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hotel_settings" (
    "hotel_id" "text" NOT NULL,
    "hotel_name" "text",
    "assistant_name" "text",
    "language" "text" DEFAULT 'ru'::"text",
    "timezone" "text" DEFAULT 'Europe/Kyiv'::"text",
    "currency" "text" DEFAULT 'USD'::"text",
    "greeting" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "telegram_chat_id" "text",
    "telegram_enabled" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."hotel_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hotel_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text",
    "email" "text" NOT NULL,
    "role" "text" DEFAULT 'admin'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    CONSTRAINT "hotel_users_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'manager'::"text", 'receptionist'::"text", 'viewer'::"text", 'pending_owner'::"text"])))
);


ALTER TABLE "public"."hotel_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hotels" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "city" "text",
    "country" "text",
    "address" "text",
    "phone" "text",
    "email" "text",
    "website" "text",
    "check_in_time" "text",
    "check_out_time" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    CONSTRAINT "hotels_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'suspended'::"text", 'deleted'::"text"])))
);


ALTER TABLE "public"."hotels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "type" "text" NOT NULL,
    "name" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."integrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."knowledge_articles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text",
    "content" "text" DEFAULT ''::"text" NOT NULL,
    "category" "text",
    "is_pinned" boolean DEFAULT false NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "language" "text" DEFAULT 'ru'::"text" NOT NULL,
    "priority" "text" DEFAULT 'normal'::"text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "search_keywords" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    CONSTRAINT "knowledge_articles_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'normal'::"text", 'high'::"text"]))),
    CONSTRAINT "knowledge_articles_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"]))),
    CONSTRAINT "knowledge_articles_version_check" CHECK (("version" >= 1))
);


ALTER TABLE "public"."knowledge_articles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."knowledge_articles"."search_keywords" IS 'Manual keywords for lexical search; future sprints may add embedding column for semantic retrieval.';



CREATE TABLE IF NOT EXISTS "public"."memberships" (
    "user_id" "uuid" NOT NULL,
    "hotel_id" "text" NOT NULL,
    "role" "text" DEFAULT 'staff'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "memberships_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'manager'::"text", 'staff'::"text"])))
);


ALTER TABLE "public"."memberships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "body" "text" NOT NULL,
    "is_internal" boolean DEFAULT false NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "deleted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "messages_role_check" CHECK (("role" = ANY (ARRAY['guest'::"text", 'staff'::"text", 'ai'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "organization_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "owner_email" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_prices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "room_type" "text" NOT NULL,
    "day" "date" NOT NULL,
    "price" numeric NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "room_prices_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."room_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "room_type" "text" NOT NULL,
    "capacity" integer NOT NULL,
    "price" numeric,
    "currency" "text",
    "amenities" "text",
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "rooms_capacity_check" CHECK (("capacity" > 0)),
    CONSTRAINT "rooms_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text",
    "stripe_event_id" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."subscription_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hotel_id" "text" NOT NULL,
    "stripe_customer_id" "text" NOT NULL,
    "stripe_subscription_id" "text",
    "plan" "text" DEFAULT 'starter'::"text" NOT NULL,
    "status" "text" DEFAULT 'none'::"text" NOT NULL,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "cancel_at_period_end" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "subscriptions_plan_check" CHECK (("plan" = ANY (ARRAY['starter'::"text", 'pro'::"text", 'enterprise'::"text"]))),
    CONSTRAINT "subscriptions_status_check" CHECK (("status" = ANY (ARRAY['none'::"text", 'active'::"text", 'trialing'::"text", 'past_due'::"text", 'canceled'::"text", 'unpaid'::"text", 'incomplete'::"text", 'incomplete_expired'::"text", 'paused'::"text"])))
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."activity_logs"
    ADD CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_actions"
    ADD CONSTRAINT "ai_actions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_observability_logs"
    ADD CONSTRAINT "ai_observability_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."availability"
    ADD CONSTRAINT "availability_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."booking_sessions"
    ADD CONSTRAINT "booking_sessions_pkey" PRIMARY KEY ("session_id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_no_overlap" EXCLUDE USING "gist" ("room_id" WITH =, "daterange"("check_in", "check_out", '[)'::"text") WITH &&) WHERE (("status" <> 'cancelled'::"text"));



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversation_assignments"
    ADD CONSTRAINT "conversation_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversation_tags"
    ADD CONSTRAINT "conversation_tags_conversation_id_tag_key" UNIQUE ("conversation_id", "tag");



ALTER TABLE ONLY "public"."conversation_tags"
    ADD CONSTRAINT "conversation_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hotel_ai_settings"
    ADD CONSTRAINT "hotel_ai_settings_pkey" PRIMARY KEY ("hotel_id");



ALTER TABLE ONLY "public"."hotel_settings"
    ADD CONSTRAINT "hotel_settings_pkey" PRIMARY KEY ("hotel_id");



ALTER TABLE ONLY "public"."hotel_users"
    ADD CONSTRAINT "hotel_users_hotel_id_email_unique" UNIQUE ("hotel_id", "email");



ALTER TABLE ONLY "public"."hotel_users"
    ADD CONSTRAINT "hotel_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hotels"
    ADD CONSTRAINT "hotels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_hotel_id_type_key" UNIQUE ("hotel_id", "type");



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."knowledge_articles"
    ADD CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("lead_id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("user_id", "hotel_id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("organization_id");



ALTER TABLE ONLY "public"."room_prices"
    ADD CONSTRAINT "room_prices_hotel_id_room_type_day_key" UNIQUE ("hotel_id", "room_type", "day");



ALTER TABLE ONLY "public"."room_prices"
    ADD CONSTRAINT "room_prices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_events"
    ADD CONSTRAINT "subscription_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_events"
    ADD CONSTRAINT "subscription_events_stripe_event_id_unique" UNIQUE ("stripe_event_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_hotel_id_unique" UNIQUE ("hotel_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_stripe_customer_id_unique" UNIQUE ("stripe_customer_id");



CREATE INDEX "ai_actions_conversation_idx" ON "public"."ai_actions" USING "btree" ("conversation_id", "created_at" DESC) WHERE ("conversation_id" IS NOT NULL);



CREATE INDEX "ai_actions_hotel_created_idx" ON "public"."ai_actions" USING "btree" ("hotel_id", "created_at" DESC);



CREATE INDEX "ai_observability_logs_conversation_idx" ON "public"."ai_observability_logs" USING "btree" ("conversation_id", "created_at" DESC) WHERE ("conversation_id" IS NOT NULL);



CREATE INDEX "ai_observability_logs_hotel_created_idx" ON "public"."ai_observability_logs" USING "btree" ("hotel_id", "created_at" DESC);



CREATE INDEX "bookings_hotel_checkin_idx" ON "public"."bookings" USING "btree" ("hotel_id", "check_in" DESC);



CREATE INDEX "bookings_hotel_status_idx" ON "public"."bookings" USING "btree" ("hotel_id", "status");



CREATE INDEX "bookings_room_dates_idx" ON "public"."bookings" USING "btree" ("room_id", "check_in", "check_out");



CREATE INDEX "conversation_assignments_conversation_idx" ON "public"."conversation_assignments" USING "btree" ("conversation_id", "assigned_at" DESC);



CREATE INDEX "conversation_assignments_user_active_idx" ON "public"."conversation_assignments" USING "btree" ("user_id") WHERE "is_active";



CREATE INDEX "conversation_tags_conversation_idx" ON "public"."conversation_tags" USING "btree" ("conversation_id");



CREATE INDEX "conversation_tags_hotel_idx" ON "public"."conversation_tags" USING "btree" ("hotel_id");



CREATE INDEX "conversations_hotel_active_idx" ON "public"."conversations" USING "btree" ("hotel_id", "last_message_at" DESC NULLS LAST) WHERE ("deleted_at" IS NULL);



CREATE INDEX "conversations_hotel_channel_idx" ON "public"."conversations" USING "btree" ("hotel_id", "channel") WHERE ("deleted_at" IS NULL);



CREATE INDEX "conversations_hotel_priority_idx" ON "public"."conversations" USING "btree" ("hotel_id", "priority") WHERE ("deleted_at" IS NULL);



CREATE INDEX "conversations_hotel_status_idx" ON "public"."conversations" USING "btree" ("hotel_id", "status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "guests_hotel_active_created_idx" ON "public"."guests" USING "btree" ("hotel_id", "created_at" DESC) WHERE ("deleted_at" IS NULL);



CREATE INDEX "guests_hotel_created_idx" ON "public"."guests" USING "btree" ("hotel_id", "created_at" DESC);



CREATE UNIQUE INDEX "guests_hotel_email_unique" ON "public"."guests" USING "btree" ("hotel_id", "lower"("email")) WHERE ("email" IS NOT NULL);



CREATE INDEX "guests_hotel_favorite_idx" ON "public"."guests" USING "btree" ("hotel_id") WHERE ("is_favorite" AND ("deleted_at" IS NULL));



CREATE INDEX "guests_hotel_vip_idx" ON "public"."guests" USING "btree" ("hotel_id") WHERE ("is_vip" AND ("deleted_at" IS NULL));



CREATE INDEX "guests_tags_gin_idx" ON "public"."guests" USING "gin" ("tags");



CREATE INDEX "idx_activity_logs_created_at" ON "public"."activity_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_activity_logs_event_type" ON "public"."activity_logs" USING "btree" ("event_type");



CREATE INDEX "idx_activity_logs_hotel_created" ON "public"."activity_logs" USING "btree" ("hotel_id", "created_at" DESC);



CREATE INDEX "idx_activity_logs_hotel_id" ON "public"."activity_logs" USING "btree" ("hotel_id");



CREATE INDEX "idx_availability_hotel_room_day" ON "public"."availability" USING "btree" ("hotel_id", "room_type", "day");



CREATE INDEX "idx_booking_sessions_hotel_id_updated_at" ON "public"."booking_sessions" USING "btree" ("hotel_id", "updated_at" DESC);



CREATE INDEX "idx_chat_messages_created_at" ON "public"."chat_messages" USING "btree" ("created_at");



CREATE INDEX "idx_chat_messages_hotel_id" ON "public"."chat_messages" USING "btree" ("hotel_id");



CREATE INDEX "idx_chat_messages_hotel_session_created" ON "public"."chat_messages" USING "btree" ("hotel_id", "session_id", "created_at" DESC);



CREATE INDEX "idx_chat_messages_session_id" ON "public"."chat_messages" USING "btree" ("session_id");



CREATE INDEX "idx_hotel_users_email" ON "public"."hotel_users" USING "btree" ("email");



CREATE INDEX "idx_hotel_users_user_id" ON "public"."hotel_users" USING "btree" ("user_id");



CREATE INDEX "idx_leads_hotel_id_created_at" ON "public"."leads" USING "btree" ("hotel_id", "created_at" DESC);



CREATE INDEX "idx_leads_hotel_status_created" ON "public"."leads" USING "btree" ("hotel_id", "status", "created_at" DESC);



CREATE INDEX "idx_rooms_hotel_id_room_type" ON "public"."rooms" USING "btree" ("hotel_id", "room_type");



CREATE INDEX "knowledge_articles_hotel_active_idx" ON "public"."knowledge_articles" USING "btree" ("hotel_id", "updated_at" DESC) WHERE ("deleted_at" IS NULL);



CREATE INDEX "knowledge_articles_hotel_category_idx" ON "public"."knowledge_articles" USING "btree" ("hotel_id", "category") WHERE (("deleted_at" IS NULL) AND ("category" IS NOT NULL));



CREATE INDEX "knowledge_articles_hotel_language_idx" ON "public"."knowledge_articles" USING "btree" ("hotel_id", "language") WHERE ("deleted_at" IS NULL);



CREATE INDEX "knowledge_articles_hotel_pinned_idx" ON "public"."knowledge_articles" USING "btree" ("hotel_id") WHERE ("is_pinned" AND ("deleted_at" IS NULL));



CREATE INDEX "knowledge_articles_hotel_priority_idx" ON "public"."knowledge_articles" USING "btree" ("hotel_id", "priority") WHERE ("deleted_at" IS NULL);



CREATE INDEX "knowledge_articles_hotel_status_idx" ON "public"."knowledge_articles" USING "btree" ("hotel_id", "status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "knowledge_articles_search_keywords_gin_idx" ON "public"."knowledge_articles" USING "gin" ("search_keywords");



CREATE INDEX "knowledge_articles_tags_gin_idx" ON "public"."knowledge_articles" USING "gin" ("tags");



CREATE INDEX "leads_hotel_status_idx" ON "public"."leads" USING "btree" ("hotel_id", "status");



CREATE INDEX "memberships_hotel_id_idx" ON "public"."memberships" USING "btree" ("hotel_id");



CREATE INDEX "memberships_user_id_idx" ON "public"."memberships" USING "btree" ("user_id");



CREATE INDEX "messages_conversation_created_idx" ON "public"."messages" USING "btree" ("conversation_id", "created_at");



CREATE INDEX "messages_hotel_created_idx" ON "public"."messages" USING "btree" ("hotel_id", "created_at" DESC);



CREATE INDEX "subscription_events_hotel_id_idx" ON "public"."subscription_events" USING "btree" ("hotel_id", "created_at" DESC);



CREATE INDEX "subscription_events_type_idx" ON "public"."subscription_events" USING "btree" ("event_type");



CREATE INDEX "subscriptions_hotel_id_idx" ON "public"."subscriptions" USING "btree" ("hotel_id");



CREATE INDEX "subscriptions_status_idx" ON "public"."subscriptions" USING "btree" ("status");



CREATE UNIQUE INDEX "unique_lead_per_session" ON "public"."leads" USING "btree" ("session_id") WHERE ("session_id" IS NOT NULL);



CREATE OR REPLACE TRIGGER "set_booking_sessions_updated_at" BEFORE UPDATE ON "public"."booking_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_bookings_updated_at" BEFORE UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_conversations_updated_at" BEFORE UPDATE ON "public"."conversations" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_guests_updated_at" BEFORE UPDATE ON "public"."guests" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_hotel_ai_settings_updated_at" BEFORE UPDATE ON "public"."hotel_ai_settings" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_integrations_updated_at" BEFORE UPDATE ON "public"."integrations" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_knowledge_articles_updated_at" BEFORE UPDATE ON "public"."knowledge_articles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."activity_logs"
    ADD CONSTRAINT "activity_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_actions"
    ADD CONSTRAINT "ai_actions_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_actions"
    ADD CONSTRAINT "ai_actions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_actions"
    ADD CONSTRAINT "ai_actions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_observability_logs"
    ADD CONSTRAINT "ai_observability_logs_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_observability_logs"
    ADD CONSTRAINT "ai_observability_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."availability"
    ADD CONSTRAINT "availability_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_assignments"
    ADD CONSTRAINT "conversation_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."conversation_assignments"
    ADD CONSTRAINT "conversation_assignments_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_assignments"
    ADD CONSTRAINT "conversation_assignments_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_assignments"
    ADD CONSTRAINT "conversation_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_tags"
    ADD CONSTRAINT "conversation_tags_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_tags"
    ADD CONSTRAINT "conversation_tags_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hotel_ai_settings"
    ADD CONSTRAINT "hotel_ai_settings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hotel_settings"
    ADD CONSTRAINT "hotel_settings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hotel_users"
    ADD CONSTRAINT "hotel_users_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hotel_users"
    ADD CONSTRAINT "hotel_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."integrations"
    ADD CONSTRAINT "integrations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."knowledge_articles"
    ADD CONSTRAINT "knowledge_articles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."knowledge_articles"
    ADD CONSTRAINT "knowledge_articles_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."knowledge_articles"
    ADD CONSTRAINT "knowledge_articles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_prices"
    ADD CONSTRAINT "room_prices_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscription_events"
    ADD CONSTRAINT "subscription_events_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE CASCADE;



ALTER TABLE "public"."ai_actions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ai_actions_tenant_rw" ON "public"."ai_actions" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."ai_observability_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ai_observability_logs_tenant_rw" ON "public"."ai_observability_logs" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "bookings_tenant_rw" ON "public"."bookings" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."conversation_assignments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "conversation_assignments_tenant_rw" ON "public"."conversation_assignments" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."conversation_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "conversation_tags_tenant_rw" ON "public"."conversation_tags" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "conversations_tenant_rw" ON "public"."conversations" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."guests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "guests_tenant_rw" ON "public"."guests" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."hotel_ai_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "hotel_ai_settings_tenant_rw" ON "public"."hotel_ai_settings" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."hotels" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "hotels_member_select" ON "public"."hotels" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."knowledge_articles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "knowledge_articles_tenant_rw" ON "public"."knowledge_articles" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "leads_tenant_rw" ON "public"."leads" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."memberships" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "memberships_self_select" ON "public"."memberships" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_tenant_rw" ON "public"."messages" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "rooms_tenant_rw" ON "public"."rooms" TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."subscription_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "subscription_events_tenant_select" ON "public"."subscription_events" FOR SELECT TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "subscriptions_tenant_select" ON "public"."subscriptions" FOR SELECT TO "authenticated" USING (("hotel_id" IN ( SELECT "m"."hotel_id"
   FROM "public"."memberships" "m"
  WHERE ("m"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_hotel_member"("hid" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_hotel_member"("hid" "text") TO "authenticated";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."leads" TO "service_role";



REVOKE ALL ON FUNCTION "public"."list_hotel_leads"("p_hotel_id" "text", "p_limit" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."list_hotel_leads"("p_hotel_id" "text", "p_limit" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."update_lead_status"("p_lead_id" "uuid", "p_status" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_lead_status"("p_lead_id" "uuid", "p_status" "text") TO "authenticated";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."activity_logs" TO "anon";
GRANT ALL ON TABLE "public"."activity_logs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."activity_logs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."ai_actions" TO "anon";
GRANT ALL ON TABLE "public"."ai_actions" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."ai_actions" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."ai_observability_logs" TO "anon";
GRANT ALL ON TABLE "public"."ai_observability_logs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."ai_observability_logs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."availability" TO "anon";
GRANT ALL ON TABLE "public"."availability" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."availability" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."booking_sessions" TO "anon";
GRANT ALL ON TABLE "public"."booking_sessions" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."booking_sessions" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."bookings" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."chat_messages" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."conversation_assignments" TO "anon";
GRANT ALL ON TABLE "public"."conversation_assignments" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."conversation_assignments" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."conversation_tags" TO "anon";
GRANT ALL ON TABLE "public"."conversation_tags" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."conversation_tags" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."conversations" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."guests" TO "anon";
GRANT ALL ON TABLE "public"."guests" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."guests" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotel_ai_settings" TO "anon";
GRANT ALL ON TABLE "public"."hotel_ai_settings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotel_ai_settings" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotel_settings" TO "anon";
GRANT ALL ON TABLE "public"."hotel_settings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotel_settings" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotel_users" TO "anon";
GRANT ALL ON TABLE "public"."hotel_users" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotel_users" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotels" TO "anon";
GRANT ALL ON TABLE "public"."hotels" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."hotels" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."integrations" TO "anon";
GRANT ALL ON TABLE "public"."integrations" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."integrations" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."knowledge_articles" TO "anon";
GRANT ALL ON TABLE "public"."knowledge_articles" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."knowledge_articles" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."memberships" TO "anon";
GRANT ALL ON TABLE "public"."memberships" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."memberships" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."messages" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."organizations" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."room_prices" TO "anon";
GRANT ALL ON TABLE "public"."room_prices" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."room_prices" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."rooms" TO "anon";
GRANT ALL ON TABLE "public"."rooms" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."rooms" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."subscription_events" TO "anon";
GRANT ALL ON TABLE "public"."subscription_events" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."subscription_events" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."subscriptions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,USAGE ON SEQUENCES TO "authenticated";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";







