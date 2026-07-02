import type { VercelRequest, VercelResponse } from '@vercel/node';
import homeHandler from '../handlers/home/home';
import permintaanSuratHandler from '../handlers/home/permintaan_surat';
import pendaftaranTesHandler from '../handlers/home/pendaftaran_tes';
import formSuratHandler from '../handlers/home/form_surat';
import pengumumanHandler from '../handlers/home/pengumuman';
import pengumumanDetailHandler from '../handlers/home/pengumuman_detail';
import pendaftaranMenuHandler from '../handlers/home/pendaftaran_menu';
import uetDashboardHandler from '../handlers/home/uet_dashboard';
import alquranDashboardHandler from '../handlers/home/alquran_dashboard';
import formUetHandler from '../handlers/home/form_uet';
import formAlquranHandler from '../handlers/home/form_alquran';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const endpoint = (req.url || '').split('?')[0].split('/').pop();
    const screen = req.query.screen || endpoint;

    switch(screen) {
        case 'home': return homeHandler(req, res);
        case 'permintaan_surat': return permintaanSuratHandler(req, res);
        case 'pendaftaran_tes': return pendaftaranTesHandler(req, res);
        case 'form_surat': return formSuratHandler(req, res);
        case 'pengumuman': return pengumumanHandler(req, res);
        case 'pengumuman_detail': return pengumumanDetailHandler(req, res);
        case 'pendaftaran_menu': return pendaftaranMenuHandler(req, res);
        case 'uet_dashboard': return uetDashboardHandler(req, res);
        case 'alquran_dashboard': return alquranDashboardHandler(req, res);
        case 'form_uet': return formUetHandler(req, res);
        case 'form_alquran': return formAlquranHandler(req, res);
        default: return res.status(404).json({ error: 'Not found', requested: req.url });
    }
}
