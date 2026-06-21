import type { ActivityCategory, AuthSession, LoginInput, RegisterInput, User } from '@/types';
import { supabase } from './supabase';

function buildUser(
  supabaseUser: { id: string; email?: string; created_at: string },
  profile: { name: string; bio?: string | null; avatar_url?: string | null; interests?: string[] | null } | null
) {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    name: profile?.name ?? '',
    bio: profile?.bio ?? undefined,
    avatarUrl: profile?.avatar_url ?? undefined,
    interests: (profile?.interests ?? []) as import('@/types').ActivityCategory[],
    createdAt: supabaseUser.created_at,
  };
}

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('name, bio, avatar_url, interests')
    .eq('id', userId)
    .single();
  return data;
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: { data: { name: input.name.trim() } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed.');

    const profile = await fetchProfile(data.user.id);

    return {
      user: buildUser(data.user, profile ?? { name: input.name.trim() }),
      token: data.session?.access_token ?? '',
    };
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed.');

    const profile = await fetchProfile(data.user.id);

    return {
      user: buildUser(data.user, profile),
      token: data.session.access_token,
    };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getSession(): Promise<AuthSession | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;

    const { user, access_token } = data.session;
    const profile = await fetchProfile(user.id);

    return {
      user: buildUser(user, profile),
      token: access_token,
    };
  },

  async updateProfile(updates: {
    name?: string;
    bio?: string;
    interests?: ActivityCategory[];
  }): Promise<User> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Not authenticated.');

    const userId = sessionData.session.user.id;

    const { error } = await supabase
      .from('profiles')
      .update({
        ...(updates.name      !== undefined && { name:      updates.name }),
        ...(updates.bio       !== undefined && { bio:       updates.bio }),
        ...(updates.interests !== undefined && { interests: updates.interests }),
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    const profile = await fetchProfile(userId);
    return buildUser(sessionData.session.user, profile);
  },
};
