
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useImageUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    },
  });
};
