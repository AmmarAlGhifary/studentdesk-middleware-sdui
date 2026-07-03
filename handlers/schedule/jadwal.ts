import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }

    try {
        return res.status(200).json({
            type: "screen",
            screen_id: "jadwal_dashboard",
            app_bar: {
                title: "Jadwal",
                show_profile_icon: false
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "empty_state_card",
                        message: "Jadwal feature is under construction.",
                        modifier: {
                            width: { type: "fill" },
                            padding: { vertical: 48, horizontal: 16 }
                        }
                    }
                ]
            }
        });
    } catch (error: any) {
        logger.error('Error constructing jadwal SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data jadwal' });
    }
}
