import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    const context = verifySession(req);
    if (!context) {
        logger.warn('Unauthorized pengumuman_detail request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }
    
    const idpengumuman = req.query.id as string;
    
    if (!idpengumuman) {
        return res.status(400).json({ error: 'idpengumuman is required' });
    }
    
    try {
        logger.info(`Fetching pengumuman detail for NIM: ${context.nim}, ID: ${idpengumuman}`);
        
        const listDetail = await fetchUaiApi('/notifikasi/getDetailPengumuman', context, {
            idpengumuman: idpengumuman
        });
        
        const pengumuman = listDetail.length > 0 ? listDetail[0] : null;
        
        let bodyComponent: any;
        
        if (pengumuman) {
            bodyComponent = {
                type: "column",
                children: [
                    {
                        type: "html_text",
                        html: pengumuman.IsiNotifikasi || "<i>Tidak ada konten</i>"
                    }
                ]
            };
        } else {
            bodyComponent = {
                type: "empty_state_card",
                message: "Pengumuman tidak ditemukan."
            };
        }
        
        const sduiResponse = {
            type: "screen",
            screen_id: "pengumuman_detail",
            app_bar: {
                title: pengumuman?.JudulNotifikasi || "Detail Pengumuman",
                show_profile_icon: false,
                show_notification_icon: false,
                show_logout_icon: false,
            },
            body: bodyComponent
        };
        
        logger.info('Successfully generated Pengumuman Detail SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing pengumuman detail SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses detail pengumuman' });
    }
}
