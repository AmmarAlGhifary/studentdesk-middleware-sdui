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
            screen_id: "form_uet",
            app_bar: {
                title: "Daftar UET",
                show_profile_icon: false,
                show_notification_icon: false,
                show_logout_icon: false,
            },
            body: {
                type: "form_container",
                form_id: "form_daftar_uet",
                children: [
                    {
                        type: "section_header",
                        title: "Formulir Pendaftaran UET"
                    },
                    {
                        type: "info_card",
                        title: "Jadwal Pilihan",
                        description: `Anda mendaftar untuk jadwal: ${jadwal}`
                    },
                    {
                        type: "spacer",
                        size: "medium"
                    },
                    {
                        type: "image_upload_input",
                        name: "bukti_bayar",
                        label: "Upload Bukti Pembayaran",
                        hint: "Max 2MB (JPG/PNG)"
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
                            form_id: "form_daftar_uet",
                            endpoint: "submit_uet"
                        }
                    }
                ]
            }
        };
        
        logger.info('Successfully generated Form UET SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing form UET SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses form UET' });
    }
}
