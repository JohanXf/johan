
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HallOfFameItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  read_time: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useHallOfFame = () => {
  return useQuery({
    queryKey: ['hall_of_fame'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HallOfFameItem[];
    },
  });
};

export const useCreateHallOfFameItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<HallOfFameItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hall_of_fame'] });
    },
  });
};
