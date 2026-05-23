# 上傳 GitHub 前必讀

GitHub 只放**程式碼**，不放密鑰。部署到 Render 等平台時，在該平台後台填環境變數。

---

## 絕對不要上傳（已在 `.gitignore`）

| 檔案 | 內容 | 若外洩會怎樣 |
|------|------|----------------|
| `.env` | LINE、OpenAI、Supabase 密鑰 | 別人可操控 bot、刷 API、讀寫你的資料庫 |
| `dashboard/.env.local` | Dashboard 的 Supabase 金鑰 | 同上 |
| `node_modules/` | 套件（體積大，可 `npm install` 重建） | 不必上傳 |
| `dashboard/.next/` | Next.js 建置快取 | 不必上傳 |

---

## 可以上傳的範本（僅占位符，無真實密鑰）

- `.env.example` → 複製成 `.env` 後在本機填真值
- `dashboard/.env.local.example` → 複製成 `dashboard/.env.local`

**不要把真實 key 寫進 `.env.example` 再 push。**

---

## 環境變數清單（填在 Render / 本機 `.env`，不要進 Git）

### 後端（專案根目錄）

```
PORT=3000
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### Dashboard（`dashboard/.env.local`）

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 若曾不小心 push 過密鑰

1. 立刻到 LINE / OpenAI / Supabase **撤銷並重新產生**金鑰  
2. 不要只刪檔案再 commit（Git 歷史仍可能留有舊內容）  
3. 必要時使用 [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning) 或 `git filter-repo` 清除歷史  

---

## 第一次 push 到 GitHub

```powershell
cd C:\dev\EchoMind
git init
git add .
git status
# 確認沒有 .env、.env.local、node_modules
git commit -m "Initial commit: EchoMind LINE bot and dashboard"
```

在 GitHub 建立新 repository（**不要**勾選 Add README 若本地已有檔案），然後：

```powershell
git remote add origin https://github.com/你的帳號/EchoMind.git
git branch -M main
git push -u origin main
```

---

## 上傳前自檢

```powershell
git status
git check-ignore -v .env
git check-ignore -v dashboard/.env.local
```

應顯示這些檔案被 `.gitignore` 忽略。
