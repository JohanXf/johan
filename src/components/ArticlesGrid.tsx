import { useArticles, useDeleteArticle } from '@/hooks/useArticles';
import ContentCard from './ContentCard';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ArticlesGridProps {
  selectedCategory: string;
  onContentSelect: (item: any) => void;
  isAdmin?: boolean;
  onEdit?: (item: any) => void;
}

const ArticlesGrid = ({ selectedCategory, onContentSelect, isAdmin, onEdit }: ArticlesGridProps) => {
  const { data: articles = [], isLoading } = useArticles();
  const deleteArticle = useDeleteArticle();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle.mutateAsync(id);
        toast({
          title: "Success",
          description: "Article deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Filter by category
  const filteredContent =
    selectedCategory === 'All'
      ? articles
      : articles.filter((item) => item.category === selectedCategory);

  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles found for the selected category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map((item: any) => {
        const cardItem = {
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
          readTime: item.read_time,
          category: item.category,
          content: item.content,
          image_url: item.image_url,
        };

        return (
          <ContentCard
            key={item.id}
            item={cardItem}
            onSelect={() => onContentSelect(cardItem)}
            isAdmin={isAdmin}
            onEdit={onEdit ? () => onEdit(item) : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
          />
        );
      })}
    </div>
  );
};

export default ArticlesGrid;