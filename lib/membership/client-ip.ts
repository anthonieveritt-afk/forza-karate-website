export const clientIp = (req: Request) =>
  (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'anon'
