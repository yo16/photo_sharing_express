import { google } from 'googleapis';
import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const keyFile = process.env.NODE_ENV === 'development'
    ? process.env.KEY_FILE_DEV
    : process.env.KEY_FILE_PROD;
if (!keyFile) {
    throw new Error('KEY_FILE environment variable is not set(1)');
}

export function authorize(callback: (auth: any) => void) {
    if (!keyFile) {
        throw new Error('KEY_FILE environment variable is not set(2)');
    }

    const credentials = JSON.parse(fs.readFileSync(keyFile as string, 'utf8'));
    const { client_email, private_key } = credentials;
    const scopes = ['https://www.googleapis.com/auth/drive.file'];

    const auth = new google.auth.JWT(client_email, undefined, private_key, scopes);
    callback(auth);
}
