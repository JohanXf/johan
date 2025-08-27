
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  read_time: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
