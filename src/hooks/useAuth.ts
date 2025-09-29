import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getProfile } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: 'citizen' | 'municipal_staff' | 'admin' | null;
  department_id?: string | null;
  preferred_language: string | null;
  notifications_email: boolean | null;
  notifications_sms: boolean | null;
  notifications_push: boolean | null;
  is_anonymous_default: boolean | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profileData } = await getProfile(currentUser.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profileData } = await getProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isCitizen: profile?.role === 'citizen',
    isMunicipalStaff: profile?.role === 'municipal_staff',
    isAdmin: profile?.role === 'admin'
  };
};