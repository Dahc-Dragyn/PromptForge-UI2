// src/app/api-proxy/[...path]/route.ts
import { NextRequest } from 'next/server';

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api-proxy', '');
  const backendUrl = `${process.env.BACKEND_API_URL}${path}`;

  const response = await fetch(backendUrl, {
    method: req.method,
    headers: {
      'Content-Type': req.headers.get('Content-Type') || 'application/json',
      'Authorization': req.headers.get('Authorization') || '',
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    // The 'duplex' property has been removed to fix the TypeScript error.
  });

  return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };