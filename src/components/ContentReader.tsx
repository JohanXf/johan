import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  image_url?: string;
}

interface ContentReaderProps {
  item: ContentItem;
  onBack: () => void;
}

const ContentReader = ({ item, onBack }: ContentReaderProps) => {
  // Simple markdown-like parser for basic formatting
  const parseContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold text-foreground mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-foreground mb-4 mt-6">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-foreground mb-3 mt-5">{line.slice(4)}</h3>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return <div key={index} className="my-4"></div>; // Handle in a more sophisticated way
        }
        
        // Bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>');
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-4"></div>;
        }
        
        // Regular paragraphs
        return (
          <p 
            key={index} 
            className="text-muted-foreground leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: boldText }}
          />
        );
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        {/* Article Header */}
        <div className="glass-card p-8 rounded-xl border border-border/50 mb-8">
          <div className="space-y-4">
            {/* Thumbnail Image */}
            {item.image_url && (
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-muted">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Category */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {item.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {item.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center space-x-6 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>{item.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-8 rounded-xl border border-border/50">
        <div className="prose prose-invert max-w-none">
          {parseContent(item.content)}
        </div>
      </div>
    </div>
  );
};

export default ContentReader;