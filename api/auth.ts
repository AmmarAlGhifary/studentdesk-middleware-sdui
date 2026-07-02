import type { VercelRequest, VercelResponse } from '@vercel/node';
import loginHandler from '../handlers/auth/login';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const endpoint = (req.url || '').split('?')[0].split('/').pop();
    const action = req.query.action || endpoint;
    
    if (action === 'login') return loginHandler(req, res);
    
    return res.status(404).json({ error: 'Not found', requested: req.url });
}
