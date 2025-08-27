
-- Create tables for articles and hall of fame content
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  read_time TEXT DEFAULT '5 min read',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.hall_of_fame (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Featured',
  read_time TEXT DEFAULT '5 min read',
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-images', 'content-images', true);

-- Enable Row Level Security (making content publicly readable)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_of_fame ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Articles are publicly readable" 
  ON public.articles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Hall of fame is publicly readable" 
  ON public.hall_of_fame 
  FOR SELECT 
  USING (true);

-- Admin policies for content management (you can modify these later for proper admin auth)
CREATE POLICY "Allow all operations for now on articles" 
  ON public.articles 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations for now on hall of fame" 
  ON public.hall_of_fame 
  FOR ALL 
  USING (true);

-- Storage policies for images
CREATE POLICY "Images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images');

CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'content-images');

CREATE POLICY "Anyone can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'content-images');

CREATE POLICY "Anyone can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'content-images');
