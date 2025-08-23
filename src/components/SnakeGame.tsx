import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  const handleDirectionChange = (newDirection: Position) => {
    if (!isPlaying) return;
    
    // Prevent reversing into itself
    if (newDirection.x !== 0 && direction.x === -newDirection.x) return;
    if (newDirection.y !== 0 && direction.y === -newDirection.y) return;
    
    setDirection(newDirection);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          handleDirectionChange({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          handleDirectionChange({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          handleDirectionChange({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          handleDirectionChange({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  const getCellClass = (x: number, y: number) => {
    const isSnakeCell = snake.some(segment => segment.x === x && segment.y === y);
    const isFoodCell = food.x === x && food.y === y;
    const isHead = snake[0]?.x === x && snake[0]?.y === y;

    if (isHead) return 'bg-neon-cyan shadow-neon';
    if (isSnakeCell) return 'bg-primary/80';
    if (isFoodCell) return 'bg-neon-pink animate-pulse';
    return 'bg-secondary/20 border border-border/30';
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
        Snake Game
      </h1>
      
      <div className="glass-card p-8 rounded-xl border border-border/50 inline-block">
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold text-neon-cyan">
            Score: {score}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="neon"
              size="sm"
              onClick={toggleGame}
              className="gap-2"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetGame}
              className="gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </Button>
          </div>
        </div>

        <div 
          className="grid gap-1 p-4 bg-darker-glass rounded-lg border border-border/50 mx-auto mb-6"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'fit-content'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-sm transition-all duration-100 ${getCellClass(x, y)}`}
              />
            );
          })}
        </div>

        {/* Mobile Controls */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">Mobile Controls:</p>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDirectionChange({ x: 0, y: -1 })}
              className="w-12 h-12 p-0"
              disabled={!isPlaying}
            >
              <ArrowUp size={20} />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDirectionChange({ x: -1, y: 0 })}
                className="w-12 h-12 p-0"
                disabled={!isPlaying}
              >
                <ArrowLeft size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDirectionChange({ x: 1, y: 0 })}
                className="w-12 h-12 p-0"
                disabled={!isPlaying}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDirectionChange({ x: 0, y: 1 })}
              className="w-12 h-12 p-0"
              disabled={!isPlaying}
            >
              <ArrowDown size={20} />
            </Button>
          </div>
        </div>

        {gameOver && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h3 className="text-xl font-bold text-destructive mb-2">Game Over!</h3>
            <p className="text-muted-foreground mb-4">Final Score: {score}</p>
            <Button variant="neon" onClick={resetGame}>
              Play Again
            </Button>
          </div>
        )}

        <div className="mt-6 text-sm text-muted-foreground">
          <p>Use arrow keys or mobile controls to move the snake</p>
          <p>Eat the pink food to grow and score points!</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
