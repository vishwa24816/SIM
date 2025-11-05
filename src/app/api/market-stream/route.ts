
import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';
import WebSocket from 'ws';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source') || 'binance';

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  let ws: WebSocket;

  if (source === 'coinbase') {
    ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    ws.on('open', () => {
      const productIds = INITIAL_CRYPTO_DATA
        .filter(crypto => crypto.assetType === 'Spot')
        .map(crypto => `${crypto.symbol.toUpperCase()}-USD`);
      
      ws.send(JSON.stringify({
        type: 'subscribe',
        product_ids: productIds,
        channels: ['ticker'],
      }));
    });

    ws.on('message', (data: WebSocket.Data) => {
      const message = data.toString();
      try {
        const parsedData = JSON.parse(message);
        if (parsedData.type === 'ticker' && parsedData.price) {
          const cryptoId = parsedData.product_id.toLowerCase().replace('-usd', '');
          const price = parseFloat(parsedData.price);
          const update = { id: cryptoId, price: price, source: 'coinbase' };
          writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
        }
      } catch (e) {
        console.error('Error parsing Coinbase WebSocket message:', e);
      }
    });

    ws.on('error', (error) => {
      console.error('Coinbase WebSocket error:', error);
      writer.close();
    });

    ws.on('close', () => {
      console.log('Coinbase WebSocket connection closed.');
      writer.close();
    });

  } else { // Default to Binance
    const streamNames = INITIAL_CRYPTO_DATA
      .filter(crypto => crypto.assetType === 'Spot')
      .map(crypto => `${crypto.symbol.toLowerCase()}usdt@trade`)
      .join('/');
    
    const wsUrl = `wss://stream.binance.com:9443/ws/${streamNames}`;
    ws = new WebSocket(wsUrl);

    ws.on('message', (data: WebSocket.Data) => {
      const message = data.toString();
      try {
        const parsedData = JSON.parse(message);
        if (parsedData.e === 'trade') {
          const cryptoId = parsedData.s.toLowerCase().replace('usdt', '');
          const price = parseFloat(parsedData.p);
          const update = { id: cryptoId, price: price, source: 'binance' };
          writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
        }
      } catch (e) {
        console.error('Error parsing Binance WebSocket message:', e);
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
  }

  // The client will close the connection when it's done.
  // The server-side cleanup is handled by the 'close' and 'error' events.
  
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
