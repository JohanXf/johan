
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
        setFood(generateFood(newSnake));
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
    const gameInterval = setInterval(moveSnake, 250); // Slower speed (was 150ms)
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  const getCellClass = (x: number, y: number) => {
    const isSnakeCell = snake.some(segment => segment.x === x && segment.y === y);
    const isFoodCell = food.x === x && food.y === y;
    const isHead = snake[0]?.x === x && snake[0]?.y === y;

    if (isHead) return 'bg-cyan-400 shadow-lg shadow-cyan-400/50';
    if (isSnakeCell) return 'bg-green-500';
    if (isFoodCell) return 'bg-pink-500'; // Removed animate-pulse to stop flickering
    return 'bg-gray-800 border border-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="max-w-sm mx-auto"> {/* Made narrower for mobile */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Snake Game
        </h1>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 sm:p-6">
          {/* Score and controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg sm:text-xl font-bold text-cyan-400">
              Score: {score}
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={toggleGame}
                className="bg-cyan-600 hover:bg-cyan-700 text-white gap-1"
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
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline ml-1">Reset</span>
              </Button>
            </div>
          </div>

          {/* Game Grid - Perfect mobile size */}
          <div className="flex justify-center mb-6">
            <div 
              className="grid gap-px bg-gray-900 p-2 rounded border border-gray-600"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: '280px', // Fixed size perfect for mobile
                height: '280px'
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
              className="w-16 h-16 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 shadow-lg text-white"
              disabled={!isPlaying}
            >
              <ArrowUp size={24} />
            </Button>

            {/* Left, Center, Right Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                onClick={() => handleDirectionChange({ x: -1, y: 0 })}
                className="w-16 h-16 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 shadow-lg text-white"
                disabled={!isPlaying}
              >
                <ArrowLeft size={24} />
              </Button>

              <Button
                variant="outline"
                onClick={toggleGame}
                className="w-16 h-16 rounded-full border-gray-600 hover:bg-gray-700"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button
                variant="default"
                onClick={() => handleDirectionChange({ x: 1, y: 0 })}
                className="w-16 h-16 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 shadow-lg text-white"
                disabled={!isPlaying}
              >
                <ArrowRight size={24} />
              </Button>
            </div>

            {/* Down Button */}
            <Button
              variant="default"
              onClick={() => handleDirectionChange({ x: 0, y: 1 })}
              className="w-16 h-16 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-30 shadow-lg text-white"
              disabled={!isPlaying}
            >
              <ArrowDown size={24} />
            </Button>
          </div>

          {gameOver && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-center">
              <h3 className="text-lg font-bold text-red-400 mb-2">Game Over!</h3>
              <p className="text-gray-300 mb-3">Final Score: {score}</p>
              <Button 
                variant="default"
                onClick={resetGame}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Play Again
              </Button>
            </div>
          )}

          <div className="mt-4 text-xs sm:text-sm text-gray-400 text-center">
            <p>Use arrow keys or touch controls to move</p>
            <p>Eat the pink food to grow and score!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
