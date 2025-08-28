
import { Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

interface ContentCardProps {
  item: ContentItem;
  onSelect: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const ContentCard = ({ item, onSelect, onDelete, isAdmin }: ContentCardProps) => {
  return (
    <div
      className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:shadow-card cursor-pointer"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(item);
      }}
    >
      <div className="space-y-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {item.category}
          </span>
          {isAdmin && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{item.readTime}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="group/btn text-primary hover:text-primary hover:bg-primary/10"
          >
            Read More
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
