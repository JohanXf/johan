
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useCreateArticle, useUpdateArticle } from '@/hooks/useArticles';
import { useCreateHallOfFameItem, useUpdateHallOfFameItem } from '@/hooks/useHallOfFame';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import type { Article } from '@/hooks/useArticles';
import type { HallOfFameItem } from '@/hooks/useHallOfFame';

interface ContentFormProps {
  editContent?: any;
  onCancel?: () => void;
}

const ContentForm = ({ editContent, onCancel }: ContentFormProps) => {
  const [formData, setFormData] = useState({
    title: editContent?.title || '',
    description: editContent?.description || '',
    content: editContent?.content || '',
    category: editContent?.category || '',
    readTime: editContent?.read_time || editContent?.readTime || '5 min read',
    type: (editContent ? (editContent.featured !== undefined ? 'hall_of_fame' : 'article') : 'article') as 'article' | 'hall_of_fame'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>(editContent?.image_url || '');

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const createHallOfFameItem = useCreateHallOfFameItem();
  const updateHallOfFameItem = useUpdateHallOfFameItem();
  const uploadImage = useImageUpload();

  const isEditing = !!editContent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl = existingImageUrl;
      
      if (imageFile) {
        toast.info('Uploading image...');
        imageUrl = await uploadImage.mutateAsync(imageFile);
      }

      if (formData.type === 'article') {
        const articleData = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category || 'General',
          read_time: formData.readTime,
          image_url: imageUrl || undefined,
        };

        if (isEditing) {
          await updateArticle.mutateAsync({ id: editContent.id, ...articleData });
          toast.success('Article updated successfully!');
        } else {
          await createArticle.mutateAsync(articleData);
          toast.success('Article created successfully!');
        }
      } else {
        const hofData = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category || 'Featured',
          read_time: formData.readTime,
          image_url: imageUrl || undefined,
          featured: true,
        };

        if (isEditing) {
          await updateHallOfFameItem.mutateAsync({ id: editContent.id, ...hofData });
          toast.success('Hall of Fame item updated successfully!');
        } else {
          await createHallOfFameItem.mutateAsync(hofData);
          toast.success('Hall of Fame item created successfully!');
        }
      }

      if (!isEditing) {
        // Reset form only when creating new content
        setFormData({
          title: '',
          description: '',
          content: '',
          category: '',
          readTime: '5 min read',
          type: 'article'
        });
        setImageFile(null);
        setExistingImageUrl('');
      } else {
        // Close edit form
        onCancel?.();
      }
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

  const isLoading = createArticle.isPending || createHallOfFameItem.isPending || 
                   updateArticle.isPending || updateHallOfFameItem.isPending || 
                   uploadImage.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Content' : 'Create New Content'}</CardTitle>
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
              disabled={isEditing}
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
            <Label htmlFor="image">Thumbnail Image</Label>
            {existingImageUrl && (
              <div className="mb-2">
                <img 
                  src={existingImageUrl} 
                  alt="Current thumbnail" 
                  className="w-32 h-20 object-cover rounded border"
                />
                <p className="text-xs text-muted-foreground mt-1">Current image</p>
              </div>
            )}
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
                {imageFile ? imageFile.name : existingImageUrl ? 'Change Image' : 'Choose Image'}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : `Create ${formData.type === 'article' ? 'Article' : 'Hall of Fame Item'}`)}
            </Button>
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentForm;
