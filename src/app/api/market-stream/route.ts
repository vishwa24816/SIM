import { NextResponse } from 'next/server';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';
import WebSocket from 'ws';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const streamNames = INITIAL_CRYPTO_DATA
    .filter(crypto => crypto.assetType === 'Spot')
    .map(crypto => `${crypto.symbol.toLowerCase()}usdt@trade`)
    .join('/');
  
  const wsUrl = `wss://stream.binance.com:9443/ws/${streamNames}`;
  
  try {
    const ws = new WebSocket(wsUrl);

    ws.on('message', (data: WebSocket.Data) => {
      const message = data.toString();
      try {
        const parsedData = JSON.parse(message);
        if (parsedData.e === 'trade') {
          const cryptoId = parsedData.s.toLowerCase().replace('usdt', '');
          const price = parseFloat(parsedData.p);
          const update = { id: cryptoId, price: price };
          writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    });

    ws.on('error', (error) => {
      console.error('Binance WebSocket error:', error);
      writer.close();
    });

    ws.on('close', () => {
      console.log('Binance WebSocket connection closed.');
      writer.close();
    });

    // The client will close the connection when it's done.
    // The server-side cleanup is handled by the 'close' and 'error' events.

  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
    writer.close();
  }

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
