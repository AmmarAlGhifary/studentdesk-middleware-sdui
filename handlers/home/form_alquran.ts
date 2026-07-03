import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    try {
        const jadwal = req.query.jadwal || "TBD";
        
        const sduiResponse = {
            type: "screen",
            screen_id: "form_alquran",
            app_bar: {
                title: "Daftar Test Al-Quran",
                show_profile_icon: false,
                show_notification_icon: false,
                show_logout_icon: false,
            },
            body: {
                type: "form_container",
                form_id: "form_daftar_alquran",
                children: [
                    {
                        type: "section_header",
                        title: "Formulir Pendaftaran Test Al-Quran",
                        modifier: { margin: { horizontal: 16, top: 16, bottom: 8 } }
                    },
                    {
                        type: "info_card",
                        title: "Jadwal Pilihan",
                        description: `Anda mendaftar untuk jadwal: ${jadwal}`,
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 }, padding: { all: 16 }, corner_radius: 12, border_width: 1, border_color: "#E0E0E0", background_color: "#F8F9FA" }
                    },
                    {
                        type: "spacer",
                        size: "medium"
                    },
                    {
                        type: "image_upload_input",
                        name: "bukti_bayar",
                        label: "Upload Bukti Pembayaran",
                        hint: "Max 2MB (JPG/PNG)",
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 } }
                    },
                    {
                        type: "spacer",
                        size: "large"
                    },
                    {
                        type: "button",
                        text: "Daftar & Upload Bukti",
                        action: {
                            type: "submit_form_action",
                            form_id: "form_daftar_alquran",
                            endpoint: "submit_alquran"
                        },
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 } }
                    }
                ]
            }
        };
        
        logger.info('Successfully generated Form Al-Quran SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing form Al-Quran SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses form Al-Quran' });
    }
}
