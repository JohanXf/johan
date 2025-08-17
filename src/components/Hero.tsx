import { ArrowRight, Code, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

const Hero = ({ setActiveSection }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border/50 rounded-full text-sm text-muted-foreground mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Available for collaboration
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Building the
            <span className="block bg-gradient-primary bg-clip-text text-transparent animate-glow">
              Future of Web3
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            I'm a blockchain developer passionate about creating scalable, secure, and innovative 
            decentralized applications that push the boundaries of what's possible.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              variant="hero"
              size="xl"
              onClick={() => setActiveSection('guides')}
              className="group"
            >
              <BookOpen size={20} />
              Explore Guides
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="glow"
              size="xl"
              onClick={() => setActiveSection('articles')}
              className="group"
            >
              <Code size={20} />
              Read Articles
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Projects Built</div>
            </div>
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-primary mb-2">3+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-primary mb-2">10k+</div>
              <div className="text-sm text-muted-foreground">Lines of Code</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;