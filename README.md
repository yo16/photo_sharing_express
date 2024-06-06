# photo_sharing_express
写真共有システム。Expressで、Google Driveへアップロード。

## 環境変数
- NODE_ENV
  - development | production
  - 開発環境 or デプロイ環境
- KEY_FILE_DEV
  - 開発環境時のSAのキーファイル(json)のパス
  - 例）./confidentials/gcp_cond.json
- KEY_FILE_PROD
  - デプロイ環境時のSAのキーファイル(json)のパス
  - 例）/etc/secrets/gcp_cond.json
- GOOGLE_DRIVE_FOLDER_ID
  - Google DriveのフォルダID
  - 該当のGoogle Driveをブラウザで開いたとき、URLの一部になっている
  - 例）1MLBfLvTqTPNnf7My0NOLdRaFKptbpJ7H
- USER_COUNT
  - 登録者の数
  - 登録者のボタンの数となる
  - 例）2
- USER_NAMES
  - 登録者のボタンに表示する名前をカンマ区切り
  - Google Driveへ保存する際のファイル名の一部にもなる
  - USER_COUNTと一致していない場合、USER_COUNTが優先される
  - 任意
  - 例）太郎,次郎
