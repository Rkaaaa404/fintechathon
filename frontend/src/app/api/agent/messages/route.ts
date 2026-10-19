import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization) return NextResponse.json({ detail: 'Bearer access token required' }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON request' }, { status: 400 });
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const backendBase = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
    const response = await fetch(`${backendBase}/v1/agent/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authorization },
      body: JSON.stringify(body), signal: controller.signal, cache: 'no-store',
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ code: 'BACKEND_UNAVAILABLE', detail: 'Backend execution could not be confirmed. Check the ledger before sending again.' }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
