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
        logger.warn('Unauthorized profile request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }

    try {
        logger.info(`Fetching live academic data for NIM: ${context.nim}`);
        const items = await fetchUaiApi('/biodata/LihatBiodata', context);
        const profile = items.length > 0 ? items[0] : null;

        const children: any[] = [];

        if (profile) {
            children.push ({
                type: "info_card_profile_circular_round_image",
                image_url: profile.NamaFileFoto,
                title: profile.mhs_nm || "Nama Tidak Tersedia",
                modifier: {
                    width: { type: "fill" },
                    padding: { "all": 16 }
                },
                image_modifier: {
                    width: { type: "exact", value: 200 },
                    height: { type: "exact", value: 200 },
                    corner_radius: 1000, 
                    border_width: 2,
                    border_color: "#808080" 
                },
                title_modifier: {
                    margin: { top: 10 } 
                }
            });
            children.push ({
                type: "section_header",
                title: "Biodata",
                modifier: SduiTheme.modifiers.sectionHeader
            });
            children.push({
                type: "info_card_profile",
                description: "Lihat Biodata Mahasiswa",
                modifier: {
                    width: { type: "fill" },
                    padding: { all: 16 },
                    margin: { horizontal: 16, bottom: 16 },
                    corner_radius: 12,
                    border_width: 1,
                    border_color: "#E0E0E0",
                    background_color: "#4c5059"
                },
                action: {
                    type: "navigation_action",
                    destination: "detail_profile"
                }
            });
        } else {
            children.push({
                type: "empty_state_card",
                message: "Data profil tidak ditemukan."
            });
        }
        
        return res.status(200).json({
            type: "screen",
            screen_id: "profile_dashboard",
            app_bar: {
                title: "Profile",
                show_profile_icon: false,
                show_logout_icon: true 
            },
            body: {
                type: "column",
                children: children
            }
        });
    } catch (error: any) {
        logger.error('Error constructing profile SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data profil' });
    }
}
