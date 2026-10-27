/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route: Musinsa product search via ReefAPI
  app.post('/api/musinsa/search', async (req, res) => {
    try {
      const { query } = req.body;
      const apiKey = process.env.REEF_API_KEY;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: '검색어가 필요합니다.',
          products: [],
        });
      }

      if (!apiKey) {
        return res.status(200).json({
          success: false,
          error: 'REEF_API_KEY가 설정되지 않았습니다.',
          products: [],
        });
      }

      const reefResponse = await fetch('https://api.reefapi.com/musinsa/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ query }),
      });

      if (!reefResponse.ok) {
        const errorText = await reefResponse.text();
        console.error('ReefAPI error response status:', reefResponse.status, errorText);
        return res.status(200).json({
          success: false,
          error: `ReefAPI 호출 실패 (상태 코드: ${reefResponse.status})`,
          products: [],
        });
      }

      const data = await reefResponse.json();

      // Safely parse items from response
      let rawList: any[] = [];
      if (Array.isArray(data)) {
        rawList = data;
      } else if (Array.isArray(data.data?.results)) {
        rawList = data.data.results;
      } else if (Array.isArray(data.results)) {
        rawList = data.results;
      } else if (Array.isArray(data.data?.items)) {
        rawList = data.data.items;
      } else if (Array.isArray(data.items)) {
        rawList = data.items;
      } else if (Array.isArray(data.data?.products)) {
        rawList = data.data.products;
      } else if (Array.isArray(data.products)) {
        rawList = data.products;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      }

      // STRICT ACCURACY RULE:
      // Title, image, price, and URL must come from the SAME object.
      // Do not mix fields between different items.
      const products = rawList
        .slice(0, 3)
        .map((raw: any) => {
          const title = raw.title || raw.name || raw.product_name || raw.productName || '';
          const image = raw.image || raw.imageUrl || raw.image_url || raw.thumbnail || raw.thumbnailUrl || '';
          
          const rawPrice =
            raw.final_price ??
            raw.sale_price ??
            raw.normal_price ??
            raw.price;

          let priceFormatted = '';
          if (typeof rawPrice === 'number') {
            priceFormatted = `${rawPrice.toLocaleString('ko-KR')}원`;
          } else if (typeof rawPrice === 'string' && rawPrice.trim()) {
            priceFormatted = rawPrice.includes('원') ? rawPrice : `${rawPrice}원`;
          }

          const brand = raw.brand_name || raw.brand || raw.brandName || '';
          const url =
            raw.url ||
            raw.link ||
            raw.productUrl ||
            (raw.product_id ? `https://www.musinsa.com/products/${raw.product_id}` : '');

          return {
            title,
            image,
            price: priceFormatted,
            brand,
            url,
          };
        })
        .filter((p: any) => p.title && p.url);

      return res.status(200).json({
        success: true,
        products,
      });
    } catch (err: any) {
      console.error('Error handling /api/musinsa/search:', err);
      return res.status(200).json({
        success: false,
        error: err.message || '서버 처리 중 오류가 발생했습니다.',
        products: [],
      });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
