import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }

    const context = verifySession(req);
    if (!context) {
        logger.warn('Unauthorized permintaan_surat request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }

    try {
        return res.status(200).json({
            type: "screen",
            screen_id: "permintaan_surat",
            app_bar: {
                title: "Histori Permintaan Surat",
                show_profile_icon: false,
                show_logout_icon: false
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "info_card",
                        title: "Ajukan Surat Baru",
                        description: "Klik di sini untuk membuat permintaan surat baru.",
                        action: {
                            type: "navigation_action",
                            destination: "form_surat"
                        }
                    },
                    {
                        type: "spacer",
                        size: "medium"
                    },
                    {
                        type: "tab_layout",
                        tabs: [
                            {
                                title: "Dalam Proses (1)",
                                children: [
                                    {
                                        type: "history_card",
                                        title: "Surat Keterangan Mahasiswa",
                                        date: "01 Juli 2026",
                                        status_ka_prodi: "Disetujui",
                                        status_akademik: "Menunggu",
                                        ready_date: "-",
                                        can_cancel: true,
                                        can_download: false
                                    }
                                ]
                            },
                            {
                                title: "Selesai (1)",
                                children: [
                                    {
                                        type: "history_card",
                                        title: "Surat PKL / Magang",
                                        date: "15 Juni 2026",
                                        status_ka_prodi: "Disetujui",
                                        status_akademik: "Disetujui",
                                        ready_date: "18 Juni 2026",
                                        can_cancel: false,
                                        can_download: true
                                    }
                                ]
                            },
                            {
                                title: "Dibatalkan (0)",
                                children: [
                                    {
                                        type: "empty_state_card",
                                        message: "Belum ada permintaan yang dibatalkan."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    } catch (error: any) {
        logger.error('Error constructing permintaan_surat SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data permintaan surat' });
    }
}
