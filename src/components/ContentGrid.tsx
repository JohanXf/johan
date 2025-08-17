import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentCard from './ContentCard';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

interface ContentGridProps {
  title: string;
  items: ContentItem[];
  onSelectItem: (item: ContentItem) => void;
  onCreateNew?: () => void;
  onDeleteItem?: (id: string) => void;
  isAdmin?: boolean;
  emptyMessage: string;
}

const ContentGrid = ({ 
  title, 
  items, 
  onSelectItem, 
  onCreateNew, 
  onDeleteItem, 
  isAdmin, 
  emptyMessage 
}: ContentGridProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {title === 'Guides' 
              ? 'Technical guides and tutorials for blockchain development'
              : 'Thoughts, insights, and experiences from the Web3 space'
            }
          </p>
        </div>
        
        {isAdmin && onCreateNew && (
          <Button
            variant="neon"
            onClick={onCreateNew}
            className="gap-2"
          >
            <Plus size={18} />
            Create New
          </Button>
        )}
      </div>

      {/* Content Grid */}
      {items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onDelete={onDeleteItem}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glass-card p-12 rounded-xl border border-border/50 max-w-md mx-auto">
            <p className="text-muted-foreground text-lg mb-6">
              {emptyMessage}
            </p>
            {isAdmin && onCreateNew && (
              <Button
                variant="glow"
                onClick={onCreateNew}
                className="gap-2"
              >
                <Plus size={18} />
                Create First {title.slice(0, -1)}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGrid;