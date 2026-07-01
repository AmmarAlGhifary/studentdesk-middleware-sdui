import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }

    try {
        return res.status(200).json({
            type: "screen",
            screen_id: "permintaan_surat",
            app_bar: {
                title: "Formulir Permintaan Surat",
                show_profile_icon: false,
                show_logout_icon: false
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "section_header",
                        title: "Layanan Permintaan Surat"
                    },
                    {
                        type: "info_card",
                        title: "Nomor Induk Mahasiswa (NIM)",
                        description: "Permintaan surat keterangan mahasiswa aktif untuk keperluan administrasi.",
                    },
                    {
                        type: "info_card",
                        title: "Surat Pengantar Magang",
                        description: "Permintaan surat pengantar untuk keperluan magang / kerja praktik.",
                    },
                    {
                        type: "info_card",
                        title: "Surat Rekomendasi",
                        description: "Permintaan surat rekomendasi dari pihak universitas.",
                    }
                ]
            }
        });
    } catch (error: any) {
        logger.error('Error constructing permintaan_surat SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data permintaan surat' });
    }
}
