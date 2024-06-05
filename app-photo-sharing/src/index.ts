import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { google } from 'googleapis';
import { authorize } from './googleAuth';
import { PassThrough } from 'stream';

const app = express();
const port = 3000;
const FOLDER_ID = "1HLOy0NptbpJ77MqLdRTnfMLBfvTPNaFK";


// テンプレートエンジンの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Multerの設定
const storage = multer.memoryStorage();
const upload = multer({ storage });

// トップ
app.get('/', (req: Request, res: Response) => {
    const message = req.query.message as string;

    //const dynamicValue = "This is a dynamic value!";
    res.render('upload', { dynamicValue: message });
});


// ファイルアップロード
app.post('/upload', upload.any(), (req: Request, res: Response) => {
    if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
            console.log(`File uploaded: ${file.filename}`);
            // Google Driveにアップロードする
            //authorize((auth) => {
            //  uploadFileToDrive(auth, file.path, file.filename);
            //});
            authorize((auth) => {
                uploadFileToDrive(auth, file);
            });
        });
        const message = `${files.length}個のファイルを登録しました`;
        res.redirect(`/?message=${message}`);
    } else {
        res.send('File upload failed.');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


// Google Driveにファイルをアップロードする関数
function uploadFileToDrive(auth: any, file: Express.Multer.File) {
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: file.originalname,
        parents: [FOLDER_ID]
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
