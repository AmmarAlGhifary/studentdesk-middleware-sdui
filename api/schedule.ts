import type { VercelRequest, VercelResponse } from '@vercel/node';
import jadwalHandler from '../handlers/schedule/jadwal';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const endpoint = (req.url || '').split('?')[0].split('/').pop();
    const screen = req.query.screen || endpoint;
    
    switch(screen) {
        case 'jadwal': return jadwalHandler(req, res);
        default: return res.status(404).json({ error: 'Not found', requested: req.url });
    }
}
