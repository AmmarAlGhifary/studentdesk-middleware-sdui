import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }

    try {
        return res.status(200).json({
            type: "screen",
            screen_id: "pendaftaran_tes",
            app_bar: {
                title: "Pendaftaran Tes",
                show_profile_icon: false,
                show_logout_icon: false
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "section_header",
                        title: "Pilih Tes yang Ingin Didaftarkan"
                    },
                    {
                        type: "info_card",
                        title: "TOEFL ITP",
                        description: "Pendaftaran tes TOEFL ITP untuk memenuhi syarat kelulusan.",
                    },
                    {
                        type: "info_card",
                        title: "Test Baca Al-Quran",
                        description: "Pendaftaran tes baca Al-Quran sebagai salah satu syarat kelulusan.",
                    }
                ]
            }
        });
    } catch (error: any) {
        logger.error('Error constructing pendaftaran_tes SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data pendaftaran tes' });
    }
}
