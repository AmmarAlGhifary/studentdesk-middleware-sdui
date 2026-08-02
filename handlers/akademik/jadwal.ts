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
            logger.warn('Unauthorized jadwal request');
            return res.status(401).json({ error: 'Unauthorized session' });
        }    
        
        logger.info(`Fetching Akademik Data for NIM: ${context.nim}`);

         
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') || host.includes('10.0.2.2') ? 'http' : 'https');
        const baseUrl = `${protocol}://${host}`;
        
        const [itemsJadwal, itemsNilai, itemsPengganti] = await Promise.all([
            fetchUaiApi('/jadwal/JadwalKuliah', context),
            fetchUaiApi('/jadwal/JadwalUjian', context),
            fetchUaiApi('/jadwal/JadwalKuliahPengganti', context)
        ]);

        const scheduleCards = itemsJadwal.length > 0 ? itemsJadwal.map(mapToScheduleCard) : [];
        const examCards = itemsNilai.length > 0 ? itemsNilai.map(mapToScheduleCard) : [];
        const replacementCards = itemsPengganti.length > 0 ? itemsPengganti.map(mapToScheduleCard) : [];

        return res.status(200).json({
            type: "screen",
            screen_id: "jadwal_dashboard",
            app_bar: {
                title: "Jadwal",
                show_profile_icon: false,
                show_notification_icon: true,
                notification_count : 0
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "tab_layout",
                        tabs: [
                            {
                                title: "Jadwal Kuliah",
                                children: scheduleCards.length > 0 ? scheduleCards : [
                                    {
                                        type: "empty_state_card",
                                        message: "Tidak ada jadwal perkuliahan",
                                        modifier: {
                                            width: { type: "fill" },
                                            margin: { horizontal: 16, vertical: 16 },
                                            padding: { all: 16 },
                                            corner_radius: SduiTheme.dimensions.cardRadius,
                                            border_width: SduiTheme.dimensions.borderWidth,
                                            border_color: SduiTheme.colors.cardBorder,
                                            background_color: SduiTheme.colors.cardBackground
                                        }
                                    }
                                ]
                            },
                            {
                                title: "Pengganti",
                                children: replacementCards.length > 0 ? replacementCards : [
                                    {
                                        type: "empty_state_card",
                                        message: "Tidak ada jadwal pengganti",
                                        modifier: {
                                            width: { type: "fill" },
                                            margin: { horizontal: 16, vertical: 16 },
                                            padding: { all: 16 },
                                            corner_radius: SduiTheme.dimensions.cardRadius,
                                            border_width: SduiTheme.dimensions.borderWidth,
                                            border_color: SduiTheme.colors.cardBorder,
                                            background_color: SduiTheme.colors.cardBackground
                                        }
                                    }
                                ]
                            },
                            {
                                title: "Ujian",
                                children: examCards.length > 0 ? examCards : [
                                    {
                                        type: "empty_state_card",
                                        message: "Tidak ada jadwal ujian saat ini",
                                        modifier: {
                                            width: { type: "fill" },
                                            margin: { horizontal: 16, vertical: 16 },
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
        logger.error('Error constructing jadwal SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data jadwal' });
    }

    function mapToScheduleCard(item: any) {
        const jadwalRaw = item.JadwalKuliah || "";
        let time = "Waktu tidak tersedia";
        let room = "Online / TBD";

        if (jadwalRaw){
            const parts = jadwalRaw.split(', ');
            if (parts.length >= 2) {
                const firstSchedule = `${parts[0]}, ${parts[1]}`;
                const timeRoomParts = firstSchedule.split(' / ');
                time = timeRoomParts[0] || time;
                room = timeRoomParts[1] || room;
            } else {
                time = jadwalRaw;
            }
        }

        return {
            type : "schedule_card",
            course_name: item.NamaMK || "Mata Kuliah",
            time: time,
            room: room,
            lecturer: item.NamaDosen || "Dosen tidak tersedia",
            modifier: SduiTheme.modifiers.scheduleCard,
            // TODO add action to detail after endpoint received
            // action: {
            //     type: "navigation_action",
            //     destination: "jadwal_detail",
            // }
        }
    }
}
