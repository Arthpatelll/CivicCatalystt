import { useState, useEffect } from 'react';
import { getIssues, createIssue, updateIssue, toggleUpvote } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useIssues = (filters: any = {}) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await getIssues(filters);
      
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setIssues(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [JSON.stringify(filters)]);

  const submitIssue = async (issueData: any) => {
    try {
      const { data, error: submitError } = await createIssue({
        ...issueData,
        reported_by: user?.id
      });
      
      if (submitError) {
        throw new Error(submitError.message);
      }
      
      // Refresh issues list
      await fetchIssues();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateIssueStatus = async (issueId: string, updates: any) => {
    try {
      const { data, error: updateError } = await updateIssue(issueId, updates);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Update local state
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, ...updates } : issue
      ));
      
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const handleUpvote = async (issueId: string) => {
    if (!user) return { data: null, error: 'Must be logged in to upvote' };
    
    try {
      const { data, error: upvoteError } = await toggleUpvote(issueId, user.id);
      
      if (upvoteError) {
        throw new Error(upvoteError.message);
      }
      
      // Update local state
      setIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          const increment = data?.action === 'added' ? 1 : -1;
          return {
            ...issue,
            upvotes_count: (issue.upvotes_count || 0) + increment
          };
        }
        return issue;
      }));
      
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  return {
    issues,
    loading,
    error,
    submitIssue,
    updateIssueStatus,
    handleUpvote,
    refetch: fetchIssues
  };
};