
'use client';

import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Trophy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface DxBallGameProps {
  brokerage: number;
  onClose: () => void;
}

const ConfettiPiece = ({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        backgroundColor: color,
        width: '8px',
        height: '8px',
      }}
      initial={{ opacity: 1, y: 0, rotate: 0 }}
      animate={{ opacity: 0, y: 100, rotate: rotate + 180 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
  );
};

const ConfettiExplosion = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFA1", "#F1C40F"];
    const pieces = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -50,
        rotate: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)]
    })), [colors]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
                {pieces.map(p => <ConfettiPiece key={p.id} {...p} />)}
            </AnimatePresence>
        </div>
    );
};


export const DxBallGame: React.FC<DxBallGameProps> = ({ brokerage, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const brickColumnCount = 10;
  const brickRowCount = useMemo(() => Math.ceil(brokerage / brickColumnCount), [brokerage]);
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  // Game state refs
  const x = useRef<number>(0);
  const y = useRef<number>(0);
  const dx = useRef(4);
  const dy = useRef(-4);
  const ballRadius = 10;

  const paddleHeight = 10;
  const paddleWidth = 140;
  const paddleX = useRef<number>(0);

  const bricks = useRef<{ x: number; y: number; status: number }[][]>([]);
  const score = useRef(0);
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing');

  const brickColors = useMemo(() => ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFA1"], []);

  const resetGame = useCallback(() => {
    score.current = 0;
    setGameState('playing');
    const canvas = canvasRef.current;
    if (canvas) {
        x.current = canvas.width / 2;
        y.current = canvas.height - 30;
        dx.current = 4;
        dy.current = -4;
        paddleX.current = (canvas.width - paddleWidth) / 2;
    }
    setupBricks();
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(draw);
  }, []);

  const setupBricks = useCallback(() => {
    const newBricks = [];
    let brickCount = 0;
    for (let c = 0; c < brickRowCount; c++) {
      newBricks[c] = [];
      for (let r = 0; r < brickColumnCount; r++) {
        const status = brickCount < brokerage ? 1 : 0;
        newBricks[c][r] = { x: 0, y: 0, status: status };
        if (status === 1) {
            brickCount++;
        }
      }
    }
    bricks.current = newBricks;
  }, [brokerage, brickRowCount]);

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(x.current, y.current, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(paddleX.current, ctx.canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };
  
  const drawBricks = useCallback((ctx: CanvasRenderingContext2D, brickWidth: number, brickHeight: number) => {
    for (let c = 0; c < brickRowCount; c++) {
      for (let r = 0; r < brickColumnCount; r++) {
        if (bricks.current[c]?.[r]?.status === 1) {
          const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
          const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks.current[c][r].x = brickX;
          bricks.current[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = brickColors[(c + r) % brickColors.length];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }, [brickRowCount, brickColors]);
  
  const collisionDetection = useCallback((brickWidth: number, brickHeight: number) => {
    for (let c = 0; c < brickRowCount; c++) {
      for (let r = 0; r < brickColumnCount; r++) {
        const b = bricks.current[c]?.[r];
        if (b && b.status === 1) {
          if (x.current > b.x && x.current < b.x + brickWidth && y.current > b.y && y.current < b.y + brickHeight) {
            dy.current = -dy.current;
            b.status = 0;
            score.current += 1;
            // Increase ball speed by 20%
            dx.current *= 1.2;
            dy.current *= 1.2;

            if (score.current === brokerage) {
              setGameState('ended');
            }
          }
        }
      }
    }
  }, [brokerage, brickRowCount]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (gameState === 'ended') {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }
    
    const brickHeight = 20;
    const availableWidth = canvas.width - (brickOffsetLeft * 2);
    const brickWidth = (availableWidth - (brickPadding * (brickColumnCount - 1))) / brickColumnCount;


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks(ctx, brickWidth, brickHeight);
    drawBall(ctx);
    drawPaddle(ctx);
    collisionDetection(brickWidth, brickHeight);

    if (x.current + dx.current > canvas.width - ballRadius || x.current + dx.current < ballRadius) {
      dx.current = -dx.current;
    }
    if (y.current + dy.current < ballRadius) {
      dy.current = -dy.current;
    } else if (y.current + dy.current > canvas.height - ballRadius) {
      if (x.current > paddleX.current && x.current < paddleX.current + paddleWidth) {
        dy.current = -dy.current;
      } else {
        setGameState('ended');
        return; // Stop the draw loop
      }
    }

    x.current += dx.current;
    y.current += dy.current;
    
    animationFrameId.current = requestAnimationFrame(draw);
  }, [collisionDetection, drawBricks, gameState]);

  const updatePaddlePosition = useCallback((clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();
      const relativeX = clientX - canvasRect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
          paddleX.current = relativeX - paddleWidth / 2;
          if (paddleX.current < 0) {
            paddleX.current = 0;
          }
          if (paddleX.current + paddleWidth > canvas.width) {
            paddleX.current = canvas.width - paddleWidth;
          }
      }
    }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = Math.min(window.innerWidth * 0.9, 960);
    canvas.height = window.innerHeight * 0.9;
    
    resetGame();

    const mouseMoveHandler = (e: MouseEvent) => {
        updatePaddlePosition(e.clientX);
    };

    const touchMoveHandler = (e: TouchEvent) => {
        if (e.touches[0]) {
            updatePaddlePosition(e.touches[0].clientX);
            e.preventDefault();
        }
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [resetGame, updatePaddlePosition]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={onClose}>
        <X className="h-8 w-8" />
      </Button>
      <canvas ref={canvasRef} style={{ display: gameState === 'ended' ? 'none' : 'block' }}></canvas>
      
      {gameState === 'ended' && (
        <div className="relative">
          <ConfettiExplosion />
          <Card className="w-full max-w-sm text-center">
              <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      Congratulations!
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <p className="text-2xl font-bold">You've earned <span className="text-primary">₹{score.current}</span> cashback!</p>
                  <div className="flex gap-4">
                      <Button className="w-full" onClick={onClose}>
                          Close
                      </Button>
                  </div>
              </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};
