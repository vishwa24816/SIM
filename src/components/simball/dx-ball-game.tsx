
'use client';

import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Trophy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DxBallGameProps {
  brokerage: number;
  onClose: () => void;
}

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
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

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
              setGameState('won');
              if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            }
          }
        }
      }
    }
  }, [brokerage]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
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
        setGameState('lost');
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      }
    }

    x.current += dx.current;
    y.current += dy.current;
    
    if (gameState === 'playing') {
      animationFrameId.current = requestAnimationFrame(draw);
    }
  }, [collisionDetection, drawBricks, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = Math.min(window.innerWidth * 0.9, 960);
    canvas.height = window.innerHeight * 0.9;
    
    resetGame();
    
    const updatePaddlePosition = (clientX: number) => {
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
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        updatePaddlePosition(e.clientX);
    };

    const touchMoveHandler = (e: TouchEvent) => {
        if (e.touches[0]) {
            updatePaddlePosition(e.touches[0].clientX);
        }
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('touchmove', touchMoveHandler, { passive: true });

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw, setupBricks, resetGame]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={onClose}>
        <X className="h-8 w-8" />
      </Button>
      <canvas ref={canvasRef} style={{ display: gameState !== 'playing' ? 'none' : 'block' }}></canvas>
      
      {gameState !== 'playing' && (
        <Card className="w-full max-w-sm text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    {gameState === 'won' ? 'Congratulations!' : 'Game Over'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>You hit {score.current} blocks.</p>
                <p className="text-2xl font-bold">You've earned <span className="text-primary">₹{score.current}</span> cashback!</p>
                <div className="flex gap-4">
                    <Button variant="outline" className="w-full" onClick={resetGame}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </Button>
                    <Button className="w-full" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </CardContent>
        </Card>
      )}

    </div>
  );
};
