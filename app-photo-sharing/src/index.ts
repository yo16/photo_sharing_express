import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { google } from 'googleapis';
import { authorize } from './googleAuth';
import { PassThrough } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;


// テンプレートエンジンの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Multerの設定
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ユーザー数
const strUserCount: string|undefined = process.env.USER_COUNT;
const userCount: number = (strUserCount)? Number(strUserCount): 4;

// ユーザー名（カンマ区切りで名前を指定）
const strUserNames: string|undefined = process.env.USER_NAMES;
const userNames: string[] = (strUserNames)? strUserNames.split(','): [];


// トップ
app.get('/', (req: Request, res: Response) => {
    const message = req.query.m as string;
    const user = req.query.u as string;

    //const dynamicValue = "This is a dynamic value!";
    res.render('upload', { dynamicValue: message, currentUser: user, userCount, userNames });
});


// ファイルアップロード
app.post('/upload', upload.any(), (req: Request, res: Response) => {
    function getUserName(optUser: string|undefined, userNames: string[]) {
        if (!optUser) {
            return "unknown";
        }

        const numOptUser = Number(optUser);
        if (numOptUser < userNames.length) {
            return userNames[numOptUser];
        }

        return `user${numOptUser+1}`;
    }
    const uploader: string = getUserName(req.body.optUser, userNames);

    if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
            console.log(`File uploaded: ${file.filename}`);
            // Google Driveにアップロードする
            //authorize((auth) => {
            //  uploadFileToDrive(auth, file.path, file.filename);
            //});
            authorize((auth) => {
                uploadFileToDrive(auth, file, uploader);
            });
        });
        const message = `${files.length}個のファイルを登録しました`;
        res.redirect(`/?m=${message}&u=${req.body.optUser}`);
    } else {
        res.send('File upload failed.');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


// Google Driveにファイルをアップロードする関数
function uploadFileToDrive(auth: any, file: Express.Multer.File, uploader: string) {
    const drive = google.drive({ version: 'v3', auth });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID? process.env.GOOGLE_DRIVE_FOLDER_ID: '';
    const fileMetadata = {
        name: `${uploader}_${file.originalname}`,
        parents: [folderId]
    };
    const bufferStream = new PassThrough();
    bufferStream.end(file.buffer);

    drive.files.create({
        requestBody: fileMetadata,
        media: {
            mimeType: file.mimetype,
            body: bufferStream
        },
        fields: 'id'
    }, (err: any, file: any) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File Id:', file.data.id);
        }
    });
}
