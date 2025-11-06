
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
  let pingInterval: NodeJS.Timeout;

  const handleCleanup = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    if (pingInterval) {
      clearInterval(pingInterval);
    }
    if (!writable.locked) {
      writer.close().catch(() => {});
    }
  };

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
          const cryptoId = parsedData.product_id.split('-')[0].toLowerCase();
          const price = parseFloat(parsedData.price);
          const update = { id: cryptoId, price: price, source: 'coinbase' };
          writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
        }
      } catch (e) {
        console.error('Error parsing Coinbase WebSocket message:', e);
      }
    });

  } else if (source === 'bybit') {
    ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');

    ws.on('open', () => {
      const args = INITIAL_CRYPTO_DATA
        .filter(crypto => crypto.assetType === 'Spot')
        .map(crypto => `tickers.${crypto.symbol.toUpperCase()}USDT`);
      
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: args,
      }));

      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ op: 'ping' }));
        }
      }, 20000);
    });

    ws.on('message', (data: WebSocket.Data) => {
      const message = data.toString();
      try {
        const parsedData = JSON.parse(message);
        if (parsedData.topic?.startsWith('tickers') && parsedData.data) {
          const trade = parsedData.data;
          
          const crypto = INITIAL_CRYPTO_DATA.find(c => 
            trade.symbol.startsWith(c.symbol.toUpperCase())
          );

          if (crypto) {
            const price = parseFloat(trade.lastPrice);
            const update = { id: crypto.id, price: price, source: 'bybit' };
            writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
          }
        }
      } catch (e) {
        console.error('Error parsing Bybit WebSocket message:', e);
      }
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
  }

  ws.on('error', (error) => {
    console.error(`${source} WebSocket error:`, error);
    handleCleanup();
  });

  ws.on('close', () => {
    console.log(`${source} WebSocket connection closed.`);
    handleCleanup();
  });
  
  // This part is crucial for Next.js to not close the connection prematurely
  req.signal.onabort = () => {
    handleCleanup();
  };

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
