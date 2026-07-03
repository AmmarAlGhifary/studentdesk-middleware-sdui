import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';
import { SduiTheme } from '../../utils/theme';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET'})
    }

    const context = verifySession(req);
    if (!context) {
        logger.warn('Unauthorized detail profile request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }

    try {
        const items = await fetchUaiApi('/biodata/LihatBiodata', context);
        const profile = items.length > 0 ? items[0] : null;

        const children: any[] = [];

        if (profile) {
            const createCard = (title: string, subtitle: string | undefined | null) => ({
                type: "info_card_profile_detailed",
                title: title,
                subtitle: subtitle || "-",
                modifier: SduiTheme.modifiers.infoCardProfileDetailed
            });

            children.push({
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
            })

            children.push(createCard("NIM", profile.mhs_nim));
            children.push(createCard("Tempat, Tanggal Lahir", `${profile.mhs_tplhr || "-"}, ${profile.mhs_tglhr || "-"}`));
            children.push(createCard("Email", profile.mhs_email));
            children.push(createCard("Program Studi", profile.NamaProgdi));
            children.push(createCard("Fakultas", profile.NamaFakultas));
            children.push(createCard("Angkatan", profile.mhs_ank));
            children.push(createCard("Status Akademik", profile.NamaStatusAkademik));
            children.push(createCard("Jalur Masuk", profile.NamaJalurMasuk));
            children.push(createCard("Nomor HP", profile.mhs_hp));
            children.push(createCard("Nomor Telepon", profile.mhs_telepon));
            children.push(createCard("Alamat", profile.mhs_alm));
        } else {
            children.push({
                type: "empty_state_card",
                message: "Data detail profil tidak ditemukan."
            });
        }

        return res.status(200).json({
            type: "screen",
            screen_id: "detail_profile",
            app_bar: {
                title: "Detail Profile",
            },
            body: {
                type: "column",
                children: children
            }
        });
    } catch (error: any) {
        logger.error('Error constructing detail profile SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data detail profile' });
    }
}