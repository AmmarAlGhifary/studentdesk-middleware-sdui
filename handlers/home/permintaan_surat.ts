import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';
import { SduiTheme } from '../../utils/theme';

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
                        },
                        modifier: { 
                            width: { type: "fill" }, 
                            margin: { horizontal: 16, vertical: 8 }, 
                            padding: { all: 16 }, 
                            corner_radius: SduiTheme.dimensions.cardRadius, 
                            border_width: SduiTheme.dimensions.borderWidth, 
                            border_color: SduiTheme.colors.cardBorder, 
                            background_color: SduiTheme.colors.cardBackground 
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
                                        date_text: "Tanggal: 01 Juli 2026",
                                        prodi_text: "Ka.Prodi: Disetujui",
                                        akademik_text: "Akademik: Menunggu",
                                        ready_text: "Siap Diambil: -",
                                        can_cancel: true,
                                        cancel_action: {
                                            type: "api_action",
                                            endpoint: "/api/surat/cancel/123",
                                            method: "POST"
                                        },
                                        can_download: false,
                                        modifier: SduiTheme.modifiers.historyCard
                                }
                            ]
                        },
                        {
                            title: "Selesai (1)",
                            children: [
                                {
                                    type: "history_card",
                                    title: "Surat PKL / Magang",
                                    date_text: "Tanggal: 15 Juni 2026",
                                    prodi_text: "Ka.Prodi: Disetujui",
                                    akademik_text: "Akademik: Disetujui",
                                    ready_text: "Siap Diambil: 18 Juni 2026",
                                    can_cancel: false,
                                    can_download: true,
                                    download_action: {
                                        type: "api_action",
                                        endpoint: "/api/surat/download/456",
                                        method: "POST"
                                    },
                                    modifier: SduiTheme.modifiers.historyCard
                            }
                        ]
                    },
                    {
                        title: "Dibatalkan (0)",
                        children: [
                            {
                                type: "empty_state_card",
                                message: "Belum ada permintaan yang dibatalkan.",
                                modifier: { width: { type: "fill" }, 
                                margin: { horizontal: 16, vertical: 8 }, 
                                padding: { all: 16 }, 
                                corner_radius: SduiTheme.dimensions.cardRadius, 
                                border_width: SduiTheme.dimensions.borderWidth, 
                                border_color: SduiTheme.colors.cardBorder, 
                                background_color: SduiTheme.colors.cardBackground 
                            }
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
