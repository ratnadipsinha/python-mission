import { supabase } from './supabase';

export interface CloudSave {
  name: string;
  xp: number;
  currentLevelId: number;
  completedLevels: number[];
  streak: number;
}

// PIN is the sole identity key — name doesn't matter for lookup
export async function loadPlayer(_name: string, pin: string): Promise<CloudSave | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('pin', pin)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return {
    name: data.name,
    xp: data.xp,
    currentLevelId: data.current_level_id,
    completedLevels: data.completed_levels ?? [],
    streak: data.streak ?? 0,
  };
}

export async function savePlayer(name: string, pin: string, save: CloudSave): Promise<void> {
  // Check if a record with this PIN already exists
  const { data: existing } = await supabase
    .from('players')
    .select('id')
    .eq('pin', pin)
    .single();

  const id = existing?.id ?? `player_${pin}_${Date.now()}`;

  await supabase.from('players').upsert({
    id,
    pin,
    name: save.name,
    xp: save.xp,
    current_level_id: save.currentLevelId,
    completed_levels: save.completedLevels,
    streak: save.streak,
    updated_at: new Date().toISOString(),
  });
}

export async function playerExists(_name: string, pin: string): Promise<boolean> {
  const { data } = await supabase
    .from('players')
    .select('id')
    .eq('pin', pin)
    .single();
  return !!data;
}
