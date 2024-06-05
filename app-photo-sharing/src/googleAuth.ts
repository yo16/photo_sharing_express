import { google } from 'googleapis';
import * as fs from 'fs';

const KEY_FILE = './confidentials/gcp_cond.json';

export function authorize(callback: (auth: any) => void) {
    const credentials = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
    const { client_email, private_key } = credentials;
    const scopes = ['https://www.googleapis.com/auth/drive.file'];

    const auth = new google.auth.JWT(client_email, undefined, private_key, scopes);
    callback(auth);
}
