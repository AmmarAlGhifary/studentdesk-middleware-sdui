import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    const context = verifySession(req);
    if (!context) {
        logger.warn('Unauthorized pengumuman request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }
    
    try {
        logger.info(`Fetching pengumuman list for NIM: ${context.nim}`);
        
        const listPengumuman = await fetchUaiApi('/notifikasi/getPengumumanByNIM', context);
        
        let sortedList = Array.isArray(listPengumuman) ? [...listPengumuman] : [];
        
        // Sort by date descending (same as flutter legacy app)
        sortedList.sort((a, b) => {
            if (!a.TanggalBuat && !b.TanggalBuat) return 0;
            if (!a.TanggalBuat) return 1;
            if (!b.TanggalBuat) return -1;
            
            const dateA = new Date(a.TanggalBuat).getTime();
            const dateB = new Date(b.TanggalBuat).getTime();
            return dateB - dateA;
        });

        const infoCards = sortedList.map((item: any) => {
            // formatDateWithTimeToIndonesia equivalent
            let formattedDate = item.TanggalBuat || '';
            if (formattedDate) {
                const dateObj = new Date(formattedDate);
                if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }
            
            return {
                type: "info_card",
                title: item.JudulNotifikasi || "Pengumuman",
                description: formattedDate,
                action: {
                    type: "navigation_action",
                    destination: `pengumuman_detail?id=${item.IDNotifikasi}`
                }
            };
        });
        
        const sduiResponse = {
            type: "screen",
            screen_id: "pengumuman",
            app_bar: {
                title: "Pengumuman",
                show_profile_icon: false,
                show_notification_icon: false,
                show_logout_icon: false,
            },
            body: {
                type: "column",
                children: infoCards.length > 0 ? infoCards : [
                    {
                        type: "empty_state_card",
                        message: "Tidak ada pengumuman saat ini."
                    }
                ]
            }
        };
        
        logger.info('Successfully generated Pengumuman SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing pengumuman SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data pengumuman' });
    }
}
