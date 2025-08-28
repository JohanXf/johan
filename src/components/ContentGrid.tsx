
import { useArticles } from '@/hooks/useArticles';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import ContentCard from './ContentCard';
import { Skeleton } from './ui/skeleton';

interface ContentGridProps {
  selectedCategory: string;
  contentType: 'articles' | 'hall_of_fame';
  onContentSelect: (item: any) => void;
}

const ContentGrid = ({ selectedCategory, contentType, onContentSelect }: ContentGridProps) => {
  const { data: articles = [], isLoading: articlesLoading } = useArticles();
  const { data: hallOfFame = [], isLoading: hallOfFameLoading } = useHallOfFame();

  const isLoading = contentType === 'articles' ? articlesLoading : hallOfFameLoading;

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

  // Select the right content based on type
  const content = contentType === 'articles' ? articles : hallOfFame;

  // Filter by category
  const filteredContent =
    selectedCategory === 'All'
      ? content
      : content.filter((item) => item.category === selectedCategory);

  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No content found for the selected category.</p>
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
        };

        return (
          <ContentCard
            key={`${contentType}-${item.id}`}
            item={cardItem}
            onSelect={() => onContentSelect(cardItem)}
          />
        );
      })}
    </div>
  );
};

export default ContentGrid;
