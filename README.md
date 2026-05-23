# EchoMind (LifeFlow AI)

LINE 生活紀錄 bot：訊息分類 → Supabase → Web Dashboard。

## 專案結構

- `/` — Express 後端（LINE webhook）
- `/dashboard` — Next.js 儀表板
- `/supabase/schema.sql` — 資料庫 schema

## 本機開發

見根目錄 `.env.example` 與 `dashboard/.env.local.example`。

**上傳 GitHub 前請先讀 [GITHUB.md](./GITHUB.md)**（哪些檔案絕對不能 push）。

## 指令

```bash
# 後端
npm install
npm run dev

# Dashboard
cd dashboard
npm install
npm run dev
```
