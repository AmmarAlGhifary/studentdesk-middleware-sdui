import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../utils/logger';

export default function handler(req: VercelRequest, res: VercelResponse) {
    logger.info('Health check endpoint accessed', { 
        url: req.url, 
        method: req.method,
        client: req.headers['user-agent']
    });
    res.status(200).json({
        status: "ok",
        message: "Middleware is running!",
        version: "1.0.0",
        environment: process.env.VERCEL_ENV || "development",
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: "/api/login",
            home: "/api/home",
            profile: "/api/profile",
            detail_profile: "/api/detail_profile",
            pendaftaran_tes: "/api/pendaftaran_tes",
            permintaan_surat: "/api/permintaan_surat",
            jadwal: "/api/jadwal"
        }
    });
}