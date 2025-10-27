
'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  const paddleWidth = 100;
  const paddleX = useRef<number>(0);

  const bricks = useRef<{ x: number; y: number; status: number }[][]>([]);

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
    ctx.fillStyle = "#0095DD";
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
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }, [brickRowCount]);
  
  const collisionDetection = useCallback((brickWidth: number, brickHeight: number) => {
    for (let c = 0; c < brickRowCount; c++) {
      for (let r = 0; r < brickColumnCount; r++) {
        const b = bricks.current[c]?.[r];
        if (b && b.status === 1) {
          if (x.current > b.x && x.current < b.x + brickWidth && y.current > b.y && y.current < b.y + brickHeight) {
            dy.current = -dy.current;
            b.status = 0;
          }
        }
      }
    }
  }, [brickRowCount]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Dynamic brick sizing
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
        onClose(); // Game over
      }
    }

    x.current += dx.current;
    y.current += dy.current;

    animationFrameId.current = requestAnimationFrame(draw);
  }, [collisionDetection, drawBricks, onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions once
    canvas.width = Math.min(window.innerWidth * 0.9, 960);
    canvas.height = window.innerHeight * 0.9;
    
    x.current = canvas.width / 2;
    y.current = canvas.height - 30;
    paddleX.current = (canvas.width - paddleWidth) / 2;
    
    setupBricks();
    
    const mouseMoveHandler = (e: MouseEvent) => {
        const canvasRect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - canvasRect.left;
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
    
    document.addEventListener('mousemove', mouseMoveHandler);

    animationFrameId.current = requestAnimationFrame(draw);

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw, setupBricks]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={onClose}>
        <X className="h-8 w-8" />
      </Button>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
