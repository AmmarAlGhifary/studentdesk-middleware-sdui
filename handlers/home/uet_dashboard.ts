import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { fetchUaiApi, verifySession } from '../../utils/uai_api';
import { SduiTheme } from '../../utils/theme';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    try {
        const context = verifySession(req);
        if (!context) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        logger.info(`Fetching UET scores for NIM: ${context.nim}`);
        
        const items = await fetchUaiApi('/akademik/UET', context);
        
        const historyCards: any[] = items.map((item: any) => {
            return {
                type: "score_card",
                title: `Sesi: ${item.sesi || "-"}`,
                date_text: `Tanggal: ${item.TglTest || "-"}`,
                score_text: item.nilai || "0",
                status_color: "#4CAF50",
                modifier: SduiTheme.modifiers.scoreCard
            };
        });
        
        if (historyCards.length === 0) {
            historyCards.push({
                type: "empty_state_card",
                message: "Belum ada histori UET.",
                modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 }, padding: { all: 16 }, corner_radius: 12, border_width: 1, border_color: "#E0E0E0", background_color: "#F8F9FA" }
            });
        }
        
        const sduiResponse = {
            type: "screen",
            screen_id: "uet_dashboard",
            app_bar: {
                title: "UAI English Test (UET)",
                show_profile_icon: false,
                show_notification_icon: false,
                show_logout_icon: false,
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "warning_banner",
                        title: "Tata Cara Pendaftaran",
                        description: "Lakukan pembayaran Rp. 50.001 ke BSI 7229 7229 93 a/n RBB. Upload bukti bayar saat mendaftar jadwal.",
                        modifier: SduiTheme.modifiers.warningBanner
                    },
                    {
                        type: "tab_layout",
                        tabs: [
                            {
                                title: "Histori Skor",
                                children: historyCards
                            },
                            {
                                title: "Jadwal Tersedia",
                                children: [
                                    {
                                        type: "info_card",
                                        title: "UET Semester Genap",
                                        description: "Sabtu, 11 Juli 2026 (19:00 - 21:30)",
                                        action: {
                                            type: "navigation_action",
                                            destination: "form_uet?jadwal=11_juli_2026"
                                        },
                                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 }, padding: { all: 16 }, corner_radius: 12, border_width: 1, border_color: "#E0E0E0", background_color: "#F8F9FA" }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
        
        logger.info('Successfully generated UET Dashboard SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing UET dashboard SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses dashboard UET' });
    }
}
