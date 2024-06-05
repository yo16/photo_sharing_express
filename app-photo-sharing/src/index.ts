import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { google } from 'googleapis';
import { authorize } from './googleAuth';

const app = express();
const port = 3000;
const folderId = "1HLOy0NptbpJ77MqLdRTnfMLBfvTPNaFK";

// 静的ファイルの設定
app.use(express.static(path.join(__dirname, "../public")));

// Multerの設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// トップ
app.get('/', (req: Request, res: Response) => {
  //res.send('Hello, TypeScript with Express!');
  res.sendFile(path.join(__dirname, "../public/sample.html"));
});

// ファイルアップロード
app.post('/upload', upload.any(), (req: Request, res: Response) => {
    if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          console.log(`File uploaded: ${file.filename}`);
          // Google Driveにアップロードする
          authorize((auth) => {
            uploadFileToDrive(auth, file.path, file.filename);
          });
        });
        res.redirect('/');
    } else {
        res.send('File upload failed.');
    }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



// Google Driveにファイルをアップロードする関数
function uploadFileToDrive(auth: any, filePath: string, fileName: string) {
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: fileName,
        parents: [folderId] // 特定のフォルダに格納するためのフォルダIDを指定
    };
    const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(filePath)
    };
    drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id'
    }, (err: any, file: any) => {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id:', file.data.id);
        }
    });
  }
