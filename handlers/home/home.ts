import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    const context = verifySession(req);
    if (!context) {
        logger.warn('Unauthorized home screen request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }
    
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') || host.includes('10.0.2.2') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;
    
    try {
        logger.info(`Fetching live academic data for NIM: ${context.nim}`);
        
        const [jadwalList, notifList, jadwalPenggantiList] = await Promise.all([
            fetchUaiApi('/jadwal/JadwalKuliah', context),
            fetchUaiApi('/notifikasi/getNotifikasiByNIM', context),
            fetchUaiApi('/jadwal/JadwalKuliahPengganti', context)
        ]);
        
        const scheduleCards = jadwalList.length > 0 ? jadwalList.map(mapToScheduleCard) : [];
        const schedulePenggantiCards = jadwalPenggantiList.length > 0 ? jadwalPenggantiList.map(mapToScheduleCard) : [];
        
        const sduiResponse = {
            type: "screen",
            screen_id: "home_dashboard",
            app_bar: {
                title: "Home",
                show_profile_icon: false,
                show_notification_icon: true, 
                notification_count: notifList ? notifList.length : 0,
                show_logout_icon: true,
            },
            body: {
                type: "column",
                children: [
                    {
                        type: "carousel",
                        items: [
                            { url: `${baseUrl}/images/bg-uai.jpg` },
                            { url: `${baseUrl}/images/back-min.jpg` },
                            { url: `${baseUrl}/images/hero-uai.jpg` },
                            { url: `${baseUrl}/images/bg-uai-2.jpg` }
                        ]
                    },
                    // Jadwal Kuliah Section
                    {
                        type: "section_header",
                        title: "Jadwal Kuliah Hari Ini"
                    },
                    ...(scheduleCards.length > 0 ? [{
                        type: "horizontal_list",
                        children: scheduleCards
                    }] : [{
                        type: "empty_state_card",
                        message: "Tidak ada jadwal perkuliahan untuk hari ini."
                    }]),

                    // Jadwal Pengganti Section
                    {
                        type: "section_header",
                        title: "Jadwal Pengganti"
                    },
                    ...(schedulePenggantiCards.length > 0 ? [{
                        type: "horizontal_list",
                        children: schedulePenggantiCards
                    }] : [{
                        type: "empty_state_card",
                        message: "Tidak ada jadwal pengganti untuk saat ini."
                    }]),

                    // Layanan Akademik Section
                    {
                        type: "section_header",
                        title: "Layanan Akademik",
                    },
                    {
                        type: "info_card",
                        title: "Permintaan Surat",
                        description: "Akses layanan permintaan surat akademik.",
                        action: {
                            type: "navigation_action",
                            destination: "permintaan_surat"
                        }
                    },
                    {
                        type: "info_card",
                        title: "Pendaftaran TOEFL / Test Baca Al-Quran",
                        description: "Silahkan mendaftar untuk mengikuti tes TOEFL atau Test Baca Al-Quran.",
                        action: {
                            type: "navigation_action",
                            destination: "pendaftaran_menu"
                        }
                    },
                ]
            }
        };
        
        logger.info('Successfully generated SDUI blueprint');
        return res.status(200).json(sduiResponse);
        
    } catch (error: any) {
        logger.error('Error constructing dynamic home SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data akademik terbaru' });
    }
    
    function mapToScheduleCard(item: any) {
        const jadwalRaw = item.JadwalKuliah || "";
        let time = "Waktu tidak tersedia";
        let room = "Online / TBD";
        
        if (jadwalRaw) {
            const parts = jadwalRaw.split(', ');
            if (parts.length >= 2) {
                const firstSchedule = `${parts[0]}, ${parts[1]}`; 
                const timeRoom = firstSchedule.split(' / ');
                time = timeRoom[0] || time;
                room = timeRoom[1] || room;
            } else {
                time = jadwalRaw;
            }
        }
        
        return {
            type: "schedule_card",
            course_name: item.NamaMK || "Mata Kuliah",
            time: time,
            room: room,
            lecturer: item.NamaDosen || "Dosen Pengampu"
        };
    }
}