import { NextResponse } from 'next/server';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

export async function GET() {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Get symbols from initial data and prepare stream names (e.g., 'btcusdt@trade')
  const streamNames = INITIAL_CRYPTO_DATA
    .map(crypto => crypto.symbol.toLowerCase() + 'usdt@trade')
    .join('/');
  
  const wsUrl = `wss://stream.binance.com:9443/ws/${streamNames}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.e === 'trade') {
      const cryptoId = data.s.toLowerCase().replace('usdt', '');
      const price = parseFloat(data.p);
      const update = { id: cryptoId, price: price };
      writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
    }
  };

  ws.onerror = (error) => {
    console.error('Binance WebSocket error:', error);
    writer.close();
  }

  ws.onclose = () => {
    console.log('Binance WebSocket connection closed.');
    writer.close();
  };

  // Keep the connection alive
  const keepAliveInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ method: "PING" }));
    }
  }, 3 * 60 * 1000); // Ping every 3 minutes

  // The client will close the connection when it's done
  // We can also handle server-side cleanup if needed.
  // For this example, we'll rely on the client closing the readable stream.
  
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
