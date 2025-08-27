
import { useArticles } from '@/hooks/useArticles';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import ContentCard from './ContentCard';
import { Skeleton } from './ui/skeleton';

interface ContentGridProps {
  selectedCategory: string;
}

const ContentGrid = ({ selectedCategory }: ContentGridProps) => {
  const { data: articles = [], isLoading: articlesLoading } = useArticles();
  const { data: hallOfFame = [], isLoading: hallOfFameLoading } = useHallOfFame();

  const isLoading = articlesLoading || hallOfFameLoading;

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

  // Combine articles and hall of fame items
  const allContent = [
    ...articles.map(article => ({ ...article, type: 'article' as const })),
    ...hallOfFame.map(item => ({ ...item, type: 'hall_of_fame' as const }))
  ];

  // Filter by category
  const filteredContent = selectedCategory === 'All' 
    ? allContent 
    : allContent.filter(item => item.category === selectedCategory);

  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No content found for the selected category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map((item) => (
        <ContentCard
          key={`${item.type}-${item.id}`}
          id={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.image_url}
          category={item.category}
          readTime={item.read_time}
          content={item.content}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
