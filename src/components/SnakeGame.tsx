
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 16; // Reduced for better mobile experience
const INITIAL_SNAKE = [{ x: 8, y: 8 }, { x: 8, y: 9 }]; // Start with 2 segments
const INITIAL_FOOD = { x: 12, y: 6 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback((currentSnake: Position[] = snake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

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
      const head = currentSnake[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      const willEat = newHead.x === food.x && newHead.y === food.y;

      // Build next snake
      const nextSnake = [newHead, ...currentSnake];
      if (!willEat) {
        nextSnake.pop(); // move tail forward when not eating (prevents false self-collisions)
      } else {
        setScore(prev => prev + 10);
        setFood(generateFood(nextSnake));
      }

      // Check self collision (ignore the new head at index 0)
      const collided = nextSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y);
      if (collided) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      return nextSnake;
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
    const gameInterval = setInterval(moveSnake, 140); // Faster for smoother movement
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  const getCellClass = (x: number, y: number) => {
    const isSnakeCell = snake.some(segment => segment.x === x && segment.y === y);
    const isFoodCell = food.x === x && food.y === y;
    const isHead = snake[0]?.x === x && snake[0]?.y === y;

    if (isHead) return 'bg-primary shadow-glow';
    if (isSnakeCell) return 'bg-primary/60';
    if (isFoodCell) return 'bg-accent';
    return 'bg-muted border border-border';
  };

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Snake Game
        </h1>

        <div className="glass-card rounded-lg border border-border p-3 sm:p-6">
          {/* Score and controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg sm:text-xl font-bold text-primary">
              Score: {score}
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={toggleGame}
                className="bg-primary hover:bg-primary/80 text-primary-foreground gap-1"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span className="hidden sm:inline">
                  {isPlaying ? 'Pause' : 'Play'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetGame}
                className="border-border hover:bg-secondary"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline ml-1">Reset</span>
              </Button>
            </div>
          </div>

          {/* Game Grid - Responsive square */}
          <div className="flex justify-center mb-6">
            <div 
              className="grid gap-px bg-background p-2 rounded border border-border"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: 'min(90vw, 360px)',
                height: 'min(90vw, 360px)'
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-sm transition-colors duration-75 ${getCellClass(x, y)}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Large Mobile Controls */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* Up Button */}
            <Button
              variant="default"
              onClick={() => handleDirectionChange({ x: 0, y: -1 })}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-30 shadow-lg text-primary-foreground"
              disabled={!isPlaying}
            >
              <ArrowUp size={24} />
            </Button>

            {/* Left, Center, Right Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                onClick={() => handleDirectionChange({ x: -1, y: 0 })}
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-30 shadow-lg text-primary-foreground"
                disabled={!isPlaying}
              >
                <ArrowLeft size={24} />
              </Button>

              <Button
                variant="outline"
                onClick={toggleGame}
                className="w-16 h-16 rounded-full border-border hover:bg-secondary"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button
                variant="default"
                onClick={() => handleDirectionChange({ x: 1, y: 0 })}
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-30 shadow-lg text-primary-foreground"
                disabled={!isPlaying}
              >
                <ArrowRight size={24} />
              </Button>
            </div>

            {/* Down Button */}
            <Button
              variant="default"
              onClick={() => handleDirectionChange({ x: 0, y: 1 })}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-30 shadow-lg text-primary-foreground"
              disabled={!isPlaying}
            >
              <ArrowDown size={24} />
            </Button>
          </div>

          {gameOver && (
            <div className="mt-4 p-4 bg-destructive/20 border border-destructive rounded-lg text-center">
              <h3 className="text-lg font-bold text-destructive mb-2">Game Over!</h3>
              <p className="text-muted-foreground mb-3">Final Score: {score}</p>
              <Button 
                variant="default"
                onClick={resetGame}
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                Play Again
              </Button>
            </div>
          )}

          <div className="mt-4 text-xs sm:text-sm text-muted-foreground text-center">
            <p>Use arrow keys or touch controls to move</p>
            <p>Eat the food to grow and score!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
