import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';

const app = express();
const port = 3000;

// 静的ファイルの設定
app.use(express.static(path.join(__dirname, "../public")));

// Multerの設定
const upload = multer({ dest: 'uploads/' });

// トップ
app.get('/', (req: Request, res: Response) => {
  //res.send('Hello, TypeScript with Express!');
  res.sendFile(path.join(__dirname, "../public/sample.html"));
});

// ファイルアップロード
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    if (req.file) {
        res.send(`File uploaded: ${req.file.filename}`);
    } else {
        res.send('File upload failed.');
    }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
