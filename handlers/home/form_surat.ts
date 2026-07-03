import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../utils/logger';
import { verifySession, fetchUaiApi } from '../../utils/uai_api';
import { SduiTheme} from '../../utils/theme';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    const context = verifySession(req);
    if (!context) {
        logger.warn('Unauthorized form_surat request');
        return res.status(401).json({ error: 'Unauthorized session' });
    }
    
    try {
        const items = await fetchUaiApi('/biodata/LihatBiodata', context);
        const profile = items.length > 0 ? items[0] : null;
        
        return res.status(200).json({
            type: "screen",
            screen_id: "form_surat",
            app_bar: {
                title: "Formulir Surat",
                show_profile_icon: false,
                show_logout_icon: false,
                actions: [
                    {
                        type: "icon_button",
                        icon: "info",
                        action: {
                            type: "show_dialog_action",
                            dialog: {
                                title: "Prosedur Umum Pembuatan Surat",
                                message: "1. Isi formulir Permintaan di halaman ini.\n2. Permintaan divalidasi Prodi (kecuali SKL & SKM)\n3. Permintaan divalidasi Akademik.\n4. Akademik mencetak surat, melengkapi tanda tangan & stempel.\n5. Status Permintaan yang sudah jadi dapat dilihat di kolom Tanggal Siap Diambil\n6. Proses pembuatan maksimal 3 hari kerja.\n7. Mahasiswa dapat mengunduh file surat pada kolom unduh (kecuali Surat Keterangan Lulus diambil di loket Akademik)\n8. Dokumen yang tidak diambil dalam waktu 1 bulan setelah Tanggal Siap Diambil bukan tanggung jawab Akademik.\n9. Maksimal 2 surat yang dapat diajukan, Anda dapat mengajukan lagi jika permintaan surat sebelumnya sudah selesai.\n10. Permintaan Surat Keterangan Lulus hanya dapat diminta 1 kali.\n\nPERHATIAN: SKL yang sudah siap diambil dapat diambil di loket Akademik lantai 2. Silahkan menyebutkan Nama, NIM, dan Program Studi. Batas waktu pengambilan SKL maksimal 2 minggu dari Tanggal Siap Diambil. Akademik tidak bertanggung jawab untuk surat yang tidak diambil melebihi batas waktu tersebut.",
                                confirm_text: "Mengerti",
                                confirm_action: { type: "none" }
                            }
                        }
                    }
                ]
            },
            body: {
                type: "form_container",
                form_id: "form_surat",
                children: [
                    {
                        type: "accordion",
                        title: "Data Pemohon",
                        is_expanded: false,
                        modifier: SduiTheme.modifiers.accordion,
                        header_modifier: SduiTheme.modifiers.accordionHeader,
                        content_modifier: SduiTheme.modifiers.accordionContent,
                        children: [
                            {
                                type: "info_card_profile_detailed",
                                title: "NIM / Program Studi",
                                subtitle: profile ? `${profile.mhs_nim} - ${profile.NamaProgdi}` : "-",
                                modifier: SduiTheme.modifiers.infoCardProfileDetailed
                            },
                            {
                                type: "info_card_profile_detailed",
                                title: "Nama Lengkap",
                                subtitle: profile ? profile.mhs_nm : "-",
                                modifier: SduiTheme.modifiers.infoCardProfileDetailed
                            },
                            {
                                type: "info_card_profile_detailed",
                                title: "Tempat, Tgl Lahir",
                                subtitle: profile ? `${profile.mhs_tplhr}, ${profile.mhs_tglhr}` : "-",
                                modifier: SduiTheme.modifiers.infoCardProfileDetailed
                            },
                            {
                                type: "info_card_profile_detailed",
                                title: "No. Handphone",
                                subtitle: profile ? profile.mhs_hp : "-",
                                modifier: SduiTheme.modifiers.infoCardProfileDetailed
                            },
                            {
                                type: "info_card_profile_detailed",
                                title: "Email",
                                subtitle: profile ? profile.mhs_email : "-",
                                modifier: SduiTheme.modifiers.infoCardProfileDetailed
                            },
                            {
                                type: "info_card_profile_detailed",
                                title: "Alamat Rumah",
                                subtitle: profile ? profile.mhs_alm : "-",
                                modifier: SduiTheme.modifiers.infoCardProfileDetailed
                            }
                        ]
                    },
                    {
                        type: "spacer",
                        size: "small"
                    },
                    {
                        type: "section_header",
                        title: "Detail Permintaan",
                        modifier: SduiTheme.modifiers.sectionHeader
                    },
                    {
                        type: "dropdown_input",
                        id: "jenis_permintaan",
                        label: "Jenis Permintaan",
                        options: [
                            "Surat Keterangan Mahasiswa",
                            "Surat Penelitian - Keperluan Mata Kuliah",
                            "Surat Penelitian - Keperluan Skripsi",
                            "Surat Keterangan Lulus",
                            "Surat PKL/Magang"
                        ],
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 } 
                    }
                    },
                    {
                        type: "dropdown_input",
                        id: "bahasa",
                        label: "Bahasa",
                        options: [
                            "Bahasa Indonesia",
                            "English"
                        ],
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 } }
                    },
                    {
                        type: "text_area_input",
                        id: "keterangan",
                        label: "Keterangan Tambahan",
                        placeholder: "Tuliskan keterangan (opsional)",
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 } }
                    },
                    {
                        type: "spacer",
                        size: "large"
                    },
                    {
                        type: "button",
                        text: "Simpan Permintaan",
                        style: "primary",
                        action: {
                            type: "submit_form_action",
                            form_id: "form_surat",
                            endpoint: "/api/home/submit_surat"
                        },
                        modifier: { width: { type: "fill" }, margin: { horizontal: 16, vertical: 8 } }
                    }
                ]
            }
        });
    } catch (error: any) {
        logger.error('Error constructing form_surat SDUI', { message: error.message });
        return res.status(500).json({ error: 'Server gagal memproses data form surat' });
    }
}
