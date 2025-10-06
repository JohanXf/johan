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
        <h2 className="text-2xl font-bold text-[#535353]">Chrome Dino Game</h2>
        <div className="flex justify-center gap-4 text-xs font-mono text-[#535353] tracking-wider">
          <div>
            HI <span className="font-bold">{String(highScore).padStart(5, '0')}</span>
          </div>
          <div>
            <span className="font-bold">{String(score).padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-[600px] h-[200px] bg-[#f7f7f7] overflow-hidden">
        {/* Clouds */}
        {clouds.map(cloud => (
          <div
            key={cloud.id}
            className="absolute opacity-30"
            style={{
              left: `${cloud.x}px`,
              top: `${cloud.y}px`,
            }}
          >
            <svg width="46" height="14" viewBox="0 0 46 14" fill="none">
              <rect x="10" y="7" width="2" height="2" fill="#535353"/>
              <rect x="12" y="9" width="2" height="2" fill="#535353"/>
              <rect x="14" y="11" width="4" height="2" fill="#535353"/>
              <rect x="18" y="13" width="8" height="1" fill="#535353"/>
              <rect x="26" y="11" width="6" height="2" fill="#535353"/>
              <rect x="32" y="9" width="2" height="2" fill="#535353"/>
              <rect x="10" y="5" width="2" height="2" fill="#535353"/>
              <rect x="12" y="3" width="8" height="2" fill="#535353"/>
              <rect x="20" y="1" width="10" height="2" fill="#535353"/>
              <rect x="30" y="3" width="6" height="2" fill="#535353"/>
              <rect x="36" y="5" width="2" height="2" fill="#535353"/>
            </svg>
          </div>
        ))}

        {/* Ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#535353]"></div>

        {/* Character (Dino) */}
        <div
          className={`absolute left-[50px] transition-all ${
            isJumping ? 'duration-500 ease-out' : 'duration-300'
          }`}
          style={{ 
            bottom: `${dinoBottom}px`,
            width: isDucking ? '59px' : '44px',
            height: isDucking ? '26px' : '47px'
          }}
        >
          <img
            src={dinoCharacter}
            alt="Dino"
            className="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated', filter: 'contrast(1.2)' }}
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
              // Cactus - Chrome style pixel art
              <svg width="25" height="45" viewBox="0 0 25 45" fill="none">
                {/* Small cactus */}
                <rect x="11" y="25" width="3" height="20" fill="#535353"/>
                <rect x="8" y="30" width="3" height="8" fill="#535353"/>
                <rect x="8" y="32" width="6" height="2" fill="#535353"/>
                <rect x="14" y="28" width="3" height="10" fill="#535353"/>
                <rect x="11" y="30" width="6" height="2" fill="#535353"/>
              </svg>
            ) : (
              // Pterodactyl - Chrome style pixel art
              <svg width="46" height="40" viewBox="0 0 46 40" fill="none" className={isPlaying ? 'animate-pulse' : ''}>
                <rect x="4" y="15" width="2" height="2" fill="#535353"/>
                <rect x="6" y="13" width="2" height="6" fill="#535353"/>
                <rect x="8" y="11" width="2" height="10" fill="#535353"/>
                <rect x="10" y="9" width="2" height="14" fill="#535353"/>
                <rect x="12" y="7" width="4" height="2" fill="#535353"/>
                <rect x="12" y="21" width="4" height="2" fill="#535353"/>
                <rect x="16" y="9" width="6" height="2" fill="#535353"/>
                <rect x="16" y="19" width="6" height="2" fill="#535353"/>
                <rect x="22" y="11" width="8" height="8" fill="#535353"/>
                <rect x="30" y="13" width="4" height="4" fill="#535353"/>
                <rect x="34" y="15" width="4" height="2" fill="#535353"/>
                <rect x="38" y="15" width="2" height="2" fill="#535353"/>
                <rect x="32" y="15" width="2" height="2" fill="#fff"/>
              </svg>
            )}
          </div>
        ))}

        {/* Game Over Message */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#535353] font-mono tracking-wider">G A M E  O V E R</h3>
            </div>
          </div>
        )}

        {/* Start Message */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#535353] text-xs font-mono">Press SPACE to play</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={toggleGame}
          disabled={isGameOver}
          variant="outline"
          className="border-[#535353] text-[#535353] hover:bg-[#535353] hover:text-white"
        >
          {isPlaying ? 'Pause' : 'Start'}
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          className="border-[#535353] text-[#535353] hover:bg-[#535353] hover:text-white"
        >
          Reset
        </Button>
      </div>

      {/* Mobile Controls */}
      <div className="flex gap-4 md:hidden">
        <Button
          onTouchStart={jump}
          variant="outline"
          className="flex-1 border-[#535353] text-[#535353]"
        >
          Jump
        </Button>
        <Button
          onTouchStart={() => duck(true)}
          onTouchEnd={() => duck(false)}
          variant="outline"
          className="flex-1 border-[#535353] text-[#535353]"
        >
          Duck
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-[#535353] space-y-1 font-mono">
        <p>Press SPACE or ↑ to jump</p>
        <p>Press ↓ to duck</p>
        <p className="md:hidden">(Or use the buttons above)</p>
      </div>
    </div>
  );
};

export default DinoGame;
