
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useCreateArticle } from '@/hooks/useArticles';
import { useCreateHallOfFameItem } from '@/hooks/useHallOfFame';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import type { Article } from '@/hooks/useArticles';
import type { HallOfFameItem } from '@/hooks/useHallOfFame';

const ContentForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    readTime: '5 min read',
    type: 'article' as 'article' | 'hall_of_fame'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createArticle = useCreateArticle();
  const createHallOfFameItem = useCreateHallOfFameItem();
  const uploadImage = useImageUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = '';
      
      if (imageFile) {
        toast.info('Uploading image...');
        imageUrl = await uploadImage.mutateAsync(imageFile);
      }

      if (formData.type === 'article') {
        const articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'> = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category || 'General',
          read_time: formData.readTime,
          image_url: imageUrl || undefined,
        };
        await createArticle.mutateAsync(articleData);
        toast.success('Article created successfully!');
      } else {
        const hofData: Omit<HallOfFameItem, 'id' | 'created_at' | 'updated_at'> = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category || 'Featured',
          read_time: formData.readTime,
          image_url: imageUrl || undefined,
          featured: true,
        };
        await createHallOfFameItem.mutateAsync(hofData);
        toast.success('Hall of Fame item created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        readTime: '5 min read',
        type: 'article'
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const isLoading = createArticle.isPending || createHallOfFameItem.isPending || uploadImage.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'article' | 'hall_of_fame') =>
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="hall_of_fame">Hall of Fame</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter full content"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                placeholder="e.g., 5 min read"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : 'Choose Image'}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : `Create ${formData.type === 'article' ? 'Article' : 'Hall of Fame Item'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentForm;
