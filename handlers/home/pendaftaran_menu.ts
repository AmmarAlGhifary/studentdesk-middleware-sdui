import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { SduiTheme } from '../../utils/theme';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    try {
        const sduiResponse = {
            type: "screen",
            screen_id: "pendaftaran_menu",
            app_bar: {
                title: "Pendaftaran Tes",
                show_profile_icon: false,
                show_notification_icon: false,
                show_logout_icon: false,
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "spacer",
                        size: "medium"
                    },
                    {
                        type: "section_header",
                        title: "Pilih Jenis Tes",
                        modifier: SduiTheme.modifiers.sectionHeader
                    },
                    {
                        type: "info_card",
                        title: "UAI English Test (UET)",
                        description: "Pendaftaran TOEFL/UET untuk mahasiswa Universitas Al Azhar Indonesia.",
                        action: {
                            type: "navigation_action",
                            destination: "uet_dashboard"
                        },
                        modifier: SduiTheme.modifiers.infoCard
                    },
                     {
                        type: "spacer",
                        size: "large"
                    },
                    {
                        type: "info_card",
                        title: "Test Baca Al-Quran",
                        description: "Pendaftaran Test Baca Al-Quran.",
                        action: {
                            type: "navigation_action",
                            destination: "alquran_dashboard"
                        },
                        modifier: SduiTheme.modifiers.infoCard
                    }
                ]
            }
        };
        
        logger.info('Successfully generated Pendaftaran Menu SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing pendaftaran menu SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses menu pendaftaran' });
    }
}
