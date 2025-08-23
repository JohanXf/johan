
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, BookOpen, Gamepad2 } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

const Hero = ({ setActiveSection }: HeroProps) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
          Johan Vandenberghe
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Welcome to my digital space where I share insights, guides, and experiences 
          in technology and beyond.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            variant="neon"
            onClick={() => setActiveSection('articles')}
            className="gap-2 text-lg px-8 py-4"
          >
            <FileText size={20} />
            Read Articles
            <ArrowRight size={20} />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setActiveSection('guides')}
            className="gap-2 text-lg px-8 py-4"
          >
            <BookOpen size={20} />
            Browse Hall of Fame
          </Button>

          <Button
            size="lg"
            variant="ghost"
            onClick={() => setActiveSection('snake')}
            className="gap-2 text-lg px-8 py-4 text-neon-pink hover:text-neon-pink hover:bg-neon-pink/10"
          >
            <Gamepad2 size={20} />
            Play Game
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl">
            <FileText className="w-12 h-12 text-neon-cyan mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-3">Articles</h3>
            <p className="text-muted-foreground">
              In-depth thoughts and analysis on various topics
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <BookOpen className="w-12 h-12 text-neon-purple mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-3">Hall of Fame</h3>
            <p className="text-muted-foreground">
              Step-by-step guides and tutorials
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <Gamepad2 className="w-12 h-12 text-neon-pink mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-3">Snake Game</h3>
            <p className="text-muted-foreground">
              Classic Snake game with a cyberpunk twist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
