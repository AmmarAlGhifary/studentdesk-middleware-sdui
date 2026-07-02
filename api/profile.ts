import type { VercelRequest, VercelResponse } from '@vercel/node';
import profileHandler from '../handlers/profile/profile';
import detailProfileHandler from '../handlers/profile/detail_profile';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const endpoint = (req.url || '').split('?')[0].split('/').pop();
    const screen = req.query.screen || endpoint;

    switch(screen) {
        case 'profile': return profileHandler(req, res);
        case 'detail_profile': return detailProfileHandler(req, res);
        default: return res.status(404).json({ error: 'Not found', requested: req.url });
    }
}
