
import { supabase } from './base';

export const listServices = async () => {
  return await supabase.from('services').select().eq('open_level', 1);
};
