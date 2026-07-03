import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET!;
const UAI_API_BASE = process.env.UAI_API_BASE || 'https://api.uai.ac.id/index.php/mobile';
const BASIC_AUTH = process.env.UAI_BASIC_AUTH || process.env.BASIC_AUTH!;
const STATIC_TOKEN = process.env.UAI_STATIC_TOKEN || process.env.STATIC_TOKEN!;

export interface UaiAuthContext {
    nim: string;
    password: string;
}

/**
 * Extract JWT token from header
 */
export function verifySession(req: VercelRequest): UaiAuthContext | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    
    try {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET) as UaiAuthContext;
    } catch (error) {
        logger.error('JWT verification failed', error);
        return null;
    }
}

/**
 * An authenticated POST request to the UAI Mobile API.
 * Automatically handles URL form encoding and XML parsing, returning the array of data items.
 */
export async function fetchUaiApi(endpointPath: string, context: UaiAuthContext, extraParams?: Record<string, string>): Promise<any[]> {
    const form = new URLSearchParams();
    form.append('nim', context.nim);
    form.append('pwd', context.password);
    form.append('token', STATIC_TOKEN);
    
    if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
            form.append(key, value);
        }
    }

    try {
        const response = await axios.post(`${UAI_API_BASE}${endpointPath}`, form, {
            headers: { 'Authorization': BASIC_AUTH }
        });

        const responseData = response.data;
        let parsed: any;
        
        if (typeof responseData === 'object') {
            parsed = responseData;
        } else {
            const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });
            const parsedXml = parser.parse(responseData);
            parsed = parsedXml.xml || parsedXml;
        }

        const dataNode = parsed?.data;
        if (!dataNode) return [];
        if (Array.isArray(dataNode)) return dataNode;
        if (dataNode.item) {
            return Array.isArray(dataNode.item) ? dataNode.item : [dataNode.item];
        }
        return [];
    } catch (error) {
        logger.error(`Error fetching UAI API at ${endpointPath}`, error);
        throw error;
    }
}
