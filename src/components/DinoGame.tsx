import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; type: 'cactus' | 'bird' }[]>([]);
  const [gameSpeed, setGameSpeed] = useState(8);
  
  const dinoBottom = isJumping ? 120 : isDucking ? 0 : 40;
  const nextObstacleId = useRef(0);

  const resetGame = useCallback(() => {
    setIsJumping(false);
    setIsDucking(false);
    setIsGameOver(false);
    setScore(0);
    setObstacles([]);
    setGameSpeed(8);
    nextObstacleId.current = 0;
  }, []);

  const jump = useCallback(() => {
    if (!isJumping && !isGameOver && isPlaying && !isDucking) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [isJumping, isGameOver, isPlaying, isDucking]);

  const duck = useCallback((shouldDuck: boolean) => {
    if (!isJumping && !isGameOver && isPlaying) {
      setIsDucking(shouldDuck);
    }
  }, [isJumping, isGameOver, isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, duck]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameLoop = setInterval(() => {
      // Move obstacles
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
          .filter(obs => obs.x > -60);

        // Add new obstacle randomly
        if (updated.length === 0 || updated[updated.length - 1].x < 400) {
          if (Math.random() < 0.02) {
            const obstacleType = Math.random() < 0.7 ? 'cactus' : 'bird';
            updated.push({
              id: nextObstacleId.current++,
              x: 600,
              type: obstacleType
            });
          }
        }

        return updated;
      });

      // Increase score
      setScore(prev => prev + 1);

      // Increase speed gradually
      if (score % 500 === 0 && score > 0) {
        setGameSpeed(prev => Math.min(prev + 0.5, 15));
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, gameSpeed, score]);

  // Collision detection
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const dinoLeft = 50;
    const dinoRight = 90;
    const dinoTop = dinoBottom;
    const dinoHeight = isDucking ? 30 : 50;

    for (const obstacle of obstacles) {
      const obsLeft = obstacle.x;
      const obsRight = obstacle.x + (obstacle.type === 'cactus' ? 30 : 40);
      const obsBottom = obstacle.type === 'cactus' ? 40 : 80;
      const obsHeight = obstacle.type === 'cactus' ? 50 : 30;

      // Check collision
      if (
        dinoRight > obsLeft &&
        dinoLeft < obsRight &&
        dinoTop < obsBottom + obsHeight &&
        dinoTop + dinoHeight > obsBottom
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        if (score > highScore) {
          setHighScore(score);
        }
        break;
      }
    }
  }, [obstacles, dinoBottom, isDucking, isPlaying, isGameOver, score, highScore]);

  const toggleGame = () => {
    if (isGameOver) {
      resetGame();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-text">Chrome Dino Game</h2>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-muted-foreground">
            Score: <span className="text-foreground font-bold">{score}</span>
          </div>
          <div className="text-muted-foreground">
            HI: <span className="text-foreground font-bold">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-[600px] h-[200px] bg-background border-2 border-border rounded-lg overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-border"></div>

        {/* Dino */}
        <div
          className={`absolute left-[50px] w-[40px] transition-all duration-100 ${
            isDucking ? 'h-[30px]' : 'h-[50px]'
          }`}
          style={{ bottom: `${dinoBottom}px` }}
        >
          <div className={`w-full h-full bg-foreground rounded ${isJumping ? 'animate-pulse' : ''}`}>
            {/* Dino body */}
            <div className="relative w-full h-full">
              {/* Head */}
              <div className="absolute top-0 right-0 w-5 h-5 bg-foreground rounded-sm"></div>
              {/* Eye */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-background rounded-full"></div>
              {/* Body */}
              <div className="absolute bottom-0 left-0 w-full h-3/4 bg-foreground"></div>
              {/* Legs */}
              {!isDucking && (
                <>
                  <div className="absolute bottom-0 left-2 w-1.5 h-3 bg-foreground"></div>
                  <div className="absolute bottom-0 right-2 w-1.5 h-3 bg-foreground"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute"
            style={{
              left: `${obstacle.x}px`,
              bottom: obstacle.type === 'cactus' ? '40px' : '80px',
            }}
          >
            {obstacle.type === 'cactus' ? (
              // Cactus
              <div className="w-[30px] h-[50px] bg-foreground">
                <div className="w-full h-full relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-full bg-foreground"></div>
                  <div className="absolute top-3 left-0 w-2 h-3 bg-foreground"></div>
                  <div className="absolute top-5 right-0 w-2 h-3 bg-foreground"></div>
                </div>
              </div>
            ) : (
              // Bird
              <div className="w-[40px] h-[30px] bg-foreground rounded-full relative animate-pulse">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-1 bg-foreground"></div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-1 bg-foreground"></div>
              </div>
            )}
          </div>
        ))}

        {/* Game Over Message */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-destructive">GAME OVER</h3>
              <p className="text-muted-foreground">Score: {score}</p>
              <Button onClick={toggleGame} variant="neon">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={toggleGame}
          disabled={isGameOver}
          variant={isPlaying ? "outline" : "neon"}
        >
          {isPlaying ? 'Pause' : 'Start'}
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
        >
          Reset
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className="flex gap-4 md:hidden">
        <Button
          onTouchStart={jump}
          variant="outline"
          className="flex-1"
        >
          Jump
        </Button>
        <Button
          onTouchStart={() => duck(true)}
          onTouchEnd={() => duck(false)}
          variant="outline"
          className="flex-1"
        >
          Duck
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>Press SPACE or ↑ to jump</p>
        <p>Press ↓ to duck</p>
        <p className="md:hidden">(Or use the buttons above)</p>
      </div>
    </div>
  );
};

export default DinoGame;
