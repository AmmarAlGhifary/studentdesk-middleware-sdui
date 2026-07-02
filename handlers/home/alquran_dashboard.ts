import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { fetchUaiApi, verifySession } from '../../utils/uai_api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    try {
        const context = verifySession(req);
        if (!context) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        logger.info(`Fetching Tilawah scores for NIM: ${context.nim}`);

        const items = await fetchUaiApi('/akademik/Tilawah', context);

        const historyCards: any[] = items.map((item: any) => {
            return {
                type: "score_card",
                title: `Tes Tanggal: ${item.Tanggal || "-"}`,
                date: item.created_on || "-",
                score: item.NilaiTest || "0",
                status: item.Kelulusan || "-",
                status_color: item.Kelulusan === "LULUS" ? "#4CAF50" : "#F44336"
            };
        });

        if (historyCards.length === 0) {
            historyCards.push({
                type: "empty_state_card",
                message: "Belum ada histori Test Baca Al-Quran."
            });
        }

        const sduiResponse = {
            type: "screen",
            screen_id: "alquran_dashboard",
            app_bar: {
                title: "Test Baca Al-Quran",
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
                        description: "Lakukan pembayaran Rp. 30.001 ke BSI 7229 7229 93 a/n RBB. Upload bukti bayar saat mendaftar."
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
                                        title: "Ujian Tilawah Gelombang 2",
                                        description: "Rabu, 15 Juli 2026 (13:00 - 15:00)",
                                        action: {
                                            type: "navigation_action",
                                            destination: "form_alquran?jadwal=15_juli_2026"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };
        
        logger.info('Successfully generated Al-Quran Dashboard SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing Al-Quran dashboard SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses dashboard Al-Quran' });
    }
}
