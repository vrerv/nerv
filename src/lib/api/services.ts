
import { supabase } from './base';

export const listServices = async () => {
  return supabase.from('services').select();
};
