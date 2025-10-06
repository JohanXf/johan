import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import dinoCharacter from '@/assets/dino-character.jpg';

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; type: 'cactus' | 'bird' }[]>([]);
  const [gameSpeed, setGameSpeed] = useState(6);
  const [clouds, setClouds] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const dinoBottom = isJumping ? 100 : isDucking ? 0 : 0;
  const nextObstacleId = useRef(0);

  const resetGame = useCallback(() => {
    setIsJumping(false);
    setIsDucking(false);
    setIsGameOver(false);
    setScore(0);
    setObstacles([]);
    setClouds([]);
    setGameSpeed(6);
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

  // Cloud animation
  useEffect(() => {
    if (!isPlaying) return;

    const cloudInterval = setInterval(() => {
      setClouds(prev => {
        const updated = prev
          .map(cloud => ({ ...cloud, x: cloud.x - 1 }))
          .filter(cloud => cloud.x > -100);

        if (updated.length < 3 && Math.random() < 0.01) {
          updated.push({
            id: Math.random(),
            x: 600,
            y: Math.random() * 60 + 20
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(cloudInterval);
  }, [isPlaying]);

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
        if (updated.length === 0 || updated[updated.length - 1].x < 350) {
          if (Math.random() < 0.015) {
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
        setGameSpeed(prev => Math.min(prev + 1, 12));
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
    const dinoHeight = isDucking ? 35 : 50;

    for (const obstacle of obstacles) {
      const obsLeft = obstacle.x;
      const obsRight = obstacle.x + (obstacle.type === 'cactus' ? 20 : 46);
      const obsBottom = obstacle.type === 'cactus' ? 0 : 60;
      const obsHeight = obstacle.type === 'cactus' ? 40 : 40;

      // Check collision
      if (
        dinoRight > obsLeft + 5 &&
        dinoLeft < obsRight - 5 &&
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
        <h2 className="text-2xl font-bold">Chrome Dino Game</h2>
        <div className="flex justify-center gap-8 text-sm font-mono">
          <div className="text-gray-600">
            HI <span className="text-gray-800 font-bold">{String(highScore).padStart(5, '0')}</span>
          </div>
          <div className="text-gray-600">
            <span className="text-gray-800 font-bold">{String(score).padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-[600px] h-[200px] bg-white border-2 border-gray-300 overflow-hidden">
        {/* Clouds */}
        {clouds.map(cloud => (
          <div
            key={cloud.id}
            className="absolute"
            style={{
              left: `${cloud.x}px`,
              top: `${cloud.y}px`,
            }}
          >
            <div className="flex gap-2">
              <div className="w-8 h-5 bg-gray-200 rounded-full"></div>
              <div className="w-6 h-4 bg-gray-200 rounded-full -ml-4 mt-1"></div>
              <div className="w-7 h-5 bg-gray-200 rounded-full -ml-3"></div>
            </div>
          </div>
        ))}

        {/* Ground with dashes */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-400"></div>
        <div className="absolute bottom-0 left-0 right-0 flex">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-[2px] border-t-2 border-gray-300 border-dashed"
              style={{ marginLeft: i === 0 ? '0' : '15px' }}
            ></div>
          ))}
        </div>

        {/* Character (Dino) */}
        <div
          className={`absolute left-[50px] transition-all ${
            isJumping ? 'duration-500 ease-out' : 'duration-300'
          }`}
          style={{ 
            bottom: `${dinoBottom}px`,
            width: isDucking ? '50px' : '44px',
            height: isDucking ? '35px' : '50px'
          }}
        >
          <img
            src={dinoCharacter}
            alt="Character"
            className="w-full h-full object-cover rounded-lg"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute"
            style={{
              left: `${obstacle.x}px`,
              bottom: obstacle.type === 'cactus' ? '0px' : '60px',
            }}
          >
            {obstacle.type === 'cactus' ? (
              // Cactus - Pixel art style
              <div className="relative" style={{ width: '20px', height: '40px' }}>
                {/* Main stem */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gray-700"></div>
                {/* Left arm */}
                <div className="absolute top-2 left-0 w-1.5 h-3 bg-gray-700"></div>
                <div className="absolute top-2 left-0 w-3 h-1.5 bg-gray-700"></div>
                {/* Right arm */}
                <div className="absolute top-4 right-0 w-1.5 h-3 bg-gray-700"></div>
                <div className="absolute top-4 right-0 w-3 h-1.5 bg-gray-700"></div>
              </div>
            ) : (
              // Pterodactyl - Pixel art style
              <div className="relative" style={{ width: '46px', height: '40px' }}>
                {/* Body */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-700"></div>
                {/* Head */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 bg-gray-700"></div>
                {/* Beak */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-1 bg-gray-700" style={{ transform: 'translateX(100%) translateY(-50%)' }}></div>
                {/* Wings */}
                <div className={`absolute top-0 left-2 w-10 h-2 bg-gray-700 origin-left ${isPlaying ? 'animate-pulse' : ''}`}></div>
                <div className={`absolute bottom-0 left-2 w-10 h-2 bg-gray-700 origin-left ${isPlaying ? 'animate-pulse' : ''}`}></div>
              </div>
            )}
          </div>
        ))}

        {/* Game Over Message */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 font-mono">G A M E  O V E R</h3>
              <Button onClick={toggleGame} variant="outline" className="bg-white">
                ↻ Restart
              </Button>
            </div>
          </div>
        )}

        {/* Start Message */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-sm font-mono">Press SPACE or click START to play</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={toggleGame}
          disabled={isGameOver}
          variant={isPlaying ? "outline" : "default"}
          className="bg-gray-800 hover:bg-gray-700 text-white"
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
      <div className="text-center text-sm text-gray-600 space-y-1 font-mono">
        <p>Press SPACE or ↑ to jump</p>
        <p>Press ↓ to duck</p>
        <p className="md:hidden">(Or use the buttons above)</p>
      </div>
    </div>
  );
};

export default DinoGame;
