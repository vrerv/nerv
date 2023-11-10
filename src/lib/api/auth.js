
import { supabase } from './base';

export const login = async ({email, password}) => {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
};

export const signup = async ({email, password}) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
  })
};

export const session = async () => {
  return await supabase.auth.getSession()
}

export const signout = async () => {
  return await supabase.auth.signOut()
}

export const onAuthChange = (listener) => {
  supabase.auth.onAuthStateChange((event, session) => {
    listener(event, session)
  })
}
