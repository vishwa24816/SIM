'use client';

import React, { useRef, useEffect, useCallback } from 'react';
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
  const brickRowCount = Math.ceil(brokerage / brickColumnCount);
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  let x: number, y: number;
  let dx = 4;
  let dy = -4;
  const ballRadius = 10;

  const paddleHeight = 10;
  const paddleWidth = 100;
  let paddleX: number;

  let bricks: { x: number; y: number; status: number }[][] = [];

  const setupBricks = useCallback(() => {
    bricks = [];
    let brickCount = 0;
    for (let c = 0; c < brickRowCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickColumnCount; r++) {
        if (brickCount < brokerage) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
          brickCount++;
        } else {
          bricks[c][r] = { x: 0, y: 0, status: 0 };
        }
      }
    }
  }, [brokerage, brickRowCount]);

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(paddleX, ctx.canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawBricks = (ctx: CanvasRenderingContext2D) => {
    for (let c = 0; c < brickRowCount; c++) {
      for (let r = 0; r < brickColumnCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
          const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };
  
  const collisionDetection = useCallback(() => {
    for (let c = 0; c < brickRowCount; c++) {
      for (let r = 0; r < brickColumnCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            dy = -dy;
            b.status = 0;
          }
        }
      }
    }
  }, [x, y, brickRowCount]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        onClose(); // Game over
      }
    }

    x += dx;
    y += dy;

    animationFrameId.current = requestAnimationFrame(draw);
  }, [collisionDetection, drawBricks, drawPaddle, drawBall, onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    
    setupBricks();
    
    const mouseMoveHandler = (e: MouseEvent) => {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);

    draw();

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
