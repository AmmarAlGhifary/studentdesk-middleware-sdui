// api/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import FormData from 'form-data';
import { XMLParser } from 'fast-xml-parser';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'thesis-studentdesk-secret-2026'; 

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    const { nim, password } = req.body;

    if (!nim || !password) {
        logger.warn('Login attempt missing NIM or password');
        return res.status(400).json({ error: 'NIM and password are required' });
    }

try {
        logger.info(`Attempting UAI login for NIM: ${nim}`);

        const form = new FormData();
        form.append('nim', nim);
        form.append('pwd', password);
        form.append('token', '$2y$10LuJK13J9zIMWfsy/qeNOJu20EEti4gQZ6euX3LjSfu.OdcgxwyMeO');
        form.append('token_device', 'c5XBQwbfTB2GubcHIOrdT3:APA91bEvLHc2B4S-Bgjz_4ZXqHvv9Bb8CvAYfaNXH5mgwovnBK3q5n6MGqyftjc9C8D0MBO9bi04V1wub9lJ6aA7oWu2XQXhKgOMpqmi7IiyX-N0Xovez9Y'); 

        const uaiResponse = await axios.post('https://api.uai.ac.id/index.php/mobile/login/validasi', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': 'Basic YWRtaW46MTIzNA=='
            }
        });

        logger.info('Raw UAI Response Data:', uaiResponse.data);

        let status;
        let pesan = '';

        if (typeof uaiResponse.data === 'object') {
            logger.info('UAI returned JSON natively.');
            status = uaiResponse.data.status;
            pesan = uaiResponse.data.pesan || '';
        } else {
            logger.info('UAI returned a string (XML). Parsing...');
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseTagValue: true
            });
            const jsonObj = parser.parse(uaiResponse.data);
            
            logger.info('Parsed XML Object:', jsonObj);
            
            status = jsonObj.xml?.status;
            pesan = jsonObj.xml?.pesan || '';
        }

        const isSuccess = status === 'TRUE' || status === true || status === 'true';

        if (isSuccess) {
            logger.info(`Login successful for NIM: ${nim}`);

            const bffToken = jwt.sign({ nim, password }, JWT_SECRET, { expiresIn: '30d' });

            return res.status(200).json({
                message: "Login successful",
                token: bffToken,
                user: {
                    nim: nim
                }
            });
        } else {
            logger.warn(`Server rejected login for NIM: ${nim}`, { status, pesan });
            return res.status(401).json({ error: pesan || 'Invalid NIM or password' });
        }

    } catch (error: any) {
        logger.error('UAI Login API connection failed', {
            message: error.message,
            response: error.response?.data
        });
        return res.status(500).json({ error: 'Failed to connect to UAI academic server' });   
    }
}