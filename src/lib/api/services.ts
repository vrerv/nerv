
import { supabase } from './base';

export const listServices = async () => {
  return supabase.from('services').select();
};

export const getServiceByName = async (name: string) => {
  // @ts-ignore
  return supabase.from('services').select('*').eq('name', name).single();
};
