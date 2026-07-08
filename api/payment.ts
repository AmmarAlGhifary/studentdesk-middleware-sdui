import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../utils/logger';
import keuanganHandler from '../handlers/payment/keuangan';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const endpoint = (req.url || '').split('?')[0].split('/').pop();
    const screen = req.query.screen || endpoint;

    switch (screen){
        case 'keuangan': return keuanganHandler(req, res);
        default: return res.status(404).json({ error: 'Not found', requested: req.url });
}
}