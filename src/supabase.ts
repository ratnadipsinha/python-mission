import { createClient } from '@supabase/supabase-js';

// ─── Supabase Setup ────────────────────────────────────────────────────────
// 1. Go to https://supabase.com → New Project
// 2. Open SQL Editor and run:
//
//   create table if not exists players (
//     id               text primary key,
//     pin              text not null,
//     name             text not null,
//     xp               integer not null default 0,
//     current_level_id integer not null default 1,
//     completed_levels integer[] not null default '{}',
//     streak           integer not null default 0,
//     updated_at       timestamptz default now()
//   );
//   create index if not exists players_pin_idx on players (pin);
//   alter table players disable row level security;
//
//   -- If table already exists, just add the pin column:
//   alter table players add column if not exists pin text not null default '';
//   create index if not exists players_pin_idx on players (pin);
//
// 3. Go to Settings → API and copy your Project URL + anon key into .env.local
// ──────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isConfigured = SUPABASE_URL !== '' && SUPABASE_URL !== 'https://your-project-id.supabase.co';
