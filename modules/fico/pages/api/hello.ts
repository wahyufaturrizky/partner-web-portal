import type { NowRequest, NowResponse } from '@vercel/node';

export default function hello(_req: NowRequest, res: NowResponse): void {
  res.status(200).json({ name: 'John Doe' });
}
