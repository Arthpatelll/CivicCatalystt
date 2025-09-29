import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Issue helpers
export const createIssue = async (issueData: any) => {
  const { data, error } = await supabase
    .from('issues')
    .insert(issueData)
    .select(`
      *,
      profiles:reported_by(full_name, email),
      departments(name),
      issue_photos(photo_url, caption)
    `)
    .single();
  return { data, error };
};

export const getIssues = async (filters: any = {}) => {
  let query = supabase
    .from('issues')
    .select(`
      *,
      profiles:reported_by(full_name, email, is_anonymous_default),
      departments(name),
      issue_photos(photo_url, caption),
      assigned_profile:assigned_to(full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.userId) {
    query = query.eq('reported_by', filters.userId);
  }
  if (filters.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getIssue = async (issueId: string) => {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      profiles:reported_by(full_name, email),
      departments(name, contact_email, contact_phone),
      issue_photos(id, photo_url, caption),
      assigned_profile:assigned_to(full_name, email),
      issue_comments(
        id,
        content,
        is_internal,
        is_status_update,
        old_status,
        new_status,
        created_at,
        profiles:user_id(full_name, email)
      )
    `)
    .eq('id', issueId)
    .single();
  return { data, error };
};

export const updateIssue = async (issueId: string, updates: any) => {
  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', issueId)
    .select()
    .single();
  return { data, error };
};

// Upvote helpers
export const toggleUpvote = async (issueId: string, userId: string) => {
  // Check if upvote exists
  const { data: existingUpvote } = await supabase
    .from('issue_upvotes')
    .select('id')
    .eq('issue_id', issueId)
    .eq('user_id', userId)
    .single();

  if (existingUpvote) {
    // Remove upvote
    const { error } = await supabase
      .from('issue_upvotes')
      .delete()
      .eq('id', existingUpvote.id);
    return { data: { action: 'removed' }, error };
  } else {
    // Add upvote
    const { data, error } = await supabase
      .from('issue_upvotes')
      .insert({ issue_id: issueId, user_id: userId })
      .select()
      .single();
    return { data: { action: 'added', ...data }, error };
  }
};

// Comment helpers
export const addComment = async (commentData: any) => {
  const { data, error } = await supabase
    .from('issue_comments')
    .insert(commentData)
    .select(`
      *,
      profiles:user_id(full_name, email)
    `)
    .single();
  return { data, error };
};

// File upload helpers
export const uploadIssuePhoto = async (file: File, issueId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${issueId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('issue-photos')
    .upload(fileName, file);

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('issue-photos')
    .getPublicUrl(fileName);

  // Save photo record
  const { data, error } = await supabase
    .from('issue_photos')
    .insert({
      issue_id: issueId,
      photo_url: publicUrl,
      uploaded_by: (await getCurrentUser()).user?.id
    })
    .select()
    .single();

  return { data: { ...data, publicUrl }, error };
};

// Analytics helpers
export const getAnalytics = async () => {
  // Check cache first
  const { data: cached } = await supabase
    .from('analytics_cache')
    .select('data')
    .eq('cache_key', 'dashboard_analytics')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    return { data: cached.data, error: null };
  }

  // Generate fresh analytics
  const [
    { count: totalIssues },
    { count: resolvedIssues },
    { data: categoryStats },
    { data: departmentStats }
  ] = await Promise.all([
    supabase.from('issues').select('*', { count: 'exact', head: true }),
    supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    supabase.from('issues').select('category').then(({ data }) => {
      const counts = data?.reduce((acc: any, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      return { data: Object.entries(counts || {}).map(([category, count]) => ({ category, count })) };
    }),
    supabase
      .from('issues')
      .select(`
        department_id,
        departments(name),
        created_at,
        resolved_at
      `)
      .not('department_id', 'is', null)
      .then(({ data }) => {
        const deptStats = data?.reduce((acc: any, item) => {
          const deptName = item.departments?.name || 'Unknown';
          if (!acc[deptName]) {
            acc[deptName] = { total: 0, resolved: 0, totalResponseTime: 0 };
          }
          acc[deptName].total++;
          if (item.resolved_at) {
            acc[deptName].resolved++;
            const responseTime = new Date(item.resolved_at).getTime() - new Date(item.created_at || '').getTime();
            acc[deptName].totalResponseTime += responseTime / (1000 * 60 * 60); // Convert to hours
          }
          return acc;
        }, {});

        return {
          data: Object.entries(deptStats || {}).map(([department, stats]: [string, any]) => ({
            department,
            score: stats.resolved > 0 ? Math.min(5, (stats.resolved / stats.total) * 5) : 0,
            responseTime: stats.resolved > 0 ? stats.totalResponseTime / stats.resolved : 0
          }))
        };
      })
  ]);

  const analytics = {
    totalIssues: totalIssues || 0,
    resolvedIssues: resolvedIssues || 0,
    averageResponseTime: 18.5, // Calculate from actual data
    topCategories: categoryStats?.slice(0, 5) || [],
    departmentPerformance: departmentStats || [],
    trendData: [] // Would need time-series query
  };

  // Cache the results
  await supabase
    .from('analytics_cache')
    .upsert({
      cache_key: 'dashboard_analytics',
      data: analytics as any, // Type assertion for JSON compatibility
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    });

  return { data: analytics, error: null };
};

// Real-time subscriptions
export const subscribeToIssueUpdates = (issueId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`issue-${issueId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'issues',
      filter: `id=eq.${issueId}`
    }, callback)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'issue_comments',
      filter: `issue_id=eq.${issueId}`
    }, callback)
    .subscribe();
};

export const subscribeToUserNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications-${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
};