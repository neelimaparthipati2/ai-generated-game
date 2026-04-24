import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, GAME_SPEED } from '../constants';
import { Point, Direction } from '../types';
import { Trophy, RefreshCw, Play } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Responsive Canvas Setup
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width - 48, height - 120); // Account for padding/headers
      setDimensions({ width: size, height: size });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const spawnFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    setNextDirection('UP');
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    spawnFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      const head = { ...snake[0] };
      
      switch (nextDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [head, ...snake];
      
      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        spawnFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [snake, food, direction, nextDirection, gameOver, gameStarted, score, highScore, spawnFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0); ctx.lineTo(pos, canvas.height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos); ctx.lineTo(canvas.width, pos); ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#f472b6' : '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.shadowColor = isHead ? '#f472b6' : '#22d3ee';
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const padding = 2;
      
      ctx.fillRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2);
    });

    // Draw food
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffffff';
    const fx = food.x * cellSize;
    const fy = food.y * cellSize;
    const fPadding = dimensions.width / 100;
    
    ctx.beginPath();
    ctx.arc(fx + cellSize / 2, fy + cellSize / 2, (cellSize / 2) - fPadding, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food, dimensions]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 w-full h-full relative overflow-hidden game-grid">
      <div className="absolute top-4 left-4 flex gap-2 items-center z-20">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        <span className="text-[10px] font-mono tracking-tighter text-cyan-400/80 uppercase">Engine Active / V-Sync On</span>
      </div>

      <div className="flex justify-between w-full px-6 pt-12 z-10 font-mono text-xs tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <span className="neon-text-cyan">SCORE:</span>
          <span className="text-white text-lg font-bold underline decoration-cyan-500/30 underline-offset-4">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-slate-500" />
          <span className="neon-text-pink">BEST:</span>
          <span className="text-white text-lg font-bold">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center w-full px-4 pb-8">
        <div className="relative bg-black/40 p-1 border border-cyan-500/10 rounded-lg shadow-2xl">
          <canvas 
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="rounded bg-black/60 shadow-[0_0_50px_rgba(34,211,238,0.05)] transition-all duration-300"
          />

          <AnimatePresence>
            {!gameStarted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-30"
              >
                <div className="text-center p-6 border border-slate-800 rounded-xl bg-slate-900/80 neon-border">
                   <h2 className="text-2xl font-bold mb-1 tracking-tighter italic neon-text-cyan">NEON SLITHER</h2>
                   <p className="text-slate-500 font-mono text-[10px] mb-6 uppercase">Syncing Neural Pathway...</p>
                   <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:scale-105 transition-transform text-xs"
                   >
                     <Play className="w-4 h-4 fill-current" />
                     INITIALIZE
                   </button>
                </div>
              </motion.div>
            )}

            {gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-30"
              >
                <div className="text-center p-8 border border-slate-800 rounded-xl bg-slate-900/80 neon-border">
                  <h2 className="text-3xl font-black mb-4 tracking-tighter italic neon-text-pink uppercase">FATAL ERROR</h2>
                  <div className="mb-6">
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Data Points Recovered</p>
                    <p className="text-white text-3xl font-bold font-mono">{score}</p>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-black font-bold rounded-lg hover:scale-105 transition-transform text-xs"
                   >
                    <RefreshCw className="w-4 h-4" />
                    REBOOT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 flex gap-4 text-slate-500 font-mono text-[9px] opacity-40">
           <span className="border border-slate-800 px-2 rounded">ARROWS TO MOVE</span>
           <span className="border border-slate-800 px-2 rounded">ESC TO PAUSE</span>
        </div>
      </div>
    </div>
  );
};
