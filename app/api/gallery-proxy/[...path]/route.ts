import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HONBU = process.env.FORZA_HONBU_URL ?? 'https://forza-club-honbu-production.up.railway.app';
const ADMIN_USER = process.env.FORZA_HONBU_ADMIN_USER ?? 'admin';
const ADMIN_PASS = process.env.FORZA_HONBU_ADMIN_PASS ?? '';

// Module-level session cache (survives across requests in same serverless instance)
let sessionCookie: string | null = null;

async function login(): Promise<string> {
  const res = await fetch(`${HONBU}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  });
  const setCookie = res.headers.get('set-cookie') ?? '';
  const match = setCookie.match(/admin_session=([^;]+)/);
  if (!match) throw new Error('Login failed — check FORZA_HONBU_ADMIN_PASS env var');
  return `admin_session=${match[1]}`;
}

async function ensureSession(): Promise<string> {
  if (!sessionCookie) sessionCookie = await login();
  return sessionCookie;
}

async function proxyRequest(
  req: NextRequest,
  pathSegments: string[],
  method: string,
): Promise<NextResponse> {
  const galleryPath = pathSegments.join('/');
  const targetUrl = `${HONBU}/api/gallery/${galleryPath}`;

  const contentType = req.headers.get('content-type') ?? '';
  let body: BodyInit | undefined;
  const extraHeaders: Record<string, string> = {};

  if (method !== 'GET' && method !== 'DELETE') {
    if (contentType.includes('multipart/form-data')) {
      body = await req.formData();
      // Let fetch set Content-Type with boundary automatically
    } else {
      body = await req.text();
      if (body) extraHeaders['Content-Type'] = 'application/json';
    }
  }

  async function attempt(cookie: string): Promise<Response> {
    return fetch(targetUrl, {
      method,
      headers: { Cookie: cookie, ...extraHeaders },
      body,
    });
  }

  let cookie = await ensureSession();
  let res = await attempt(cookie);

  // Re-login once on 401 (expired session)
  if (res.status === 401) {
    sessionCookie = null;
    cookie = await ensureSession();
    res = await attempt(cookie);
  }

  const responseText = await res.text();
  let responseData: unknown;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = { raw: responseText };
  }

  return NextResponse.json(responseData, { status: res.status });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path, 'GET');
}
export async function POST(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path, 'POST');
}
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path, 'DELETE');
}
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return proxyRequest(req, path, 'PATCH');
}
