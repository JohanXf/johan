import { useHallOfFame, useDeleteHallOfFameItem } from '@/hooks/useHallOfFame';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface HallOfFameCarouselProps {
  selectedCategory: string;
  onContentSelect: (item: any) => void;
  isAdmin?: boolean;
  onEdit?: (item: any) => void;
}

const HallOfFameCarousel = ({ 
  selectedCategory, 
  onContentSelect, 
  isAdmin, 
  onEdit 
}: HallOfFameCarouselProps) => {
  const { data: hallOfFame = [], isLoading } = useHallOfFame();
  const deleteHallOfFameItem = useDeleteHallOfFameItem();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Hall of Fame item?')) {
      try {
        await deleteHallOfFameItem.mutateAsync(id);
        toast({
          title: "Success",
          description: "Hall of Fame item deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete Hall of Fame item",
          variant: "destructive",
        });
      }
    }
  };

  // Filter by category
  const filteredContent = selectedCategory === 'All' 
    ? hallOfFame 
    : hallOfFame.filter((item) => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="w-full">
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-80">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured content found for the selected category.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel 
        className="w-full max-w-6xl mx-auto"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
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
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-2">
                  <Card 
                    className="h-96 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50"
                    onClick={() => onContentSelect(cardItem)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.category}
                        </Badge>
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            {onEdit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(item);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {item.image_url && (
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                        <span>{cardItem.date}</span>
                        <span>{item.read_time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default HallOfFameCarousel;