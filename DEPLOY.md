# 取得對外網址（GitHub 已上傳後）

需要兩個公開網址：

| 用途 | 平台 | 網址範例 |
|------|------|----------|
| LINE Webhook（後端 API） | **Render** | `https://echomind-api.onrender.com` |
| 看紀錄（Dashboard） | **Vercel** | `https://echomind-xxx.vercel.app` |

密鑰只在平台後台填，不要寫進 GitHub。

---

## 一、後端 API → Render（給 LINE 用）

1. 登入 https://dashboard.render.com  
2. **New +** → **Blueprint**（或 Web Service）  
3. 連接 GitHub repo：`Yoman666/echomind`  
4. 若用 Blueprint，會讀取根目錄 `render.yaml`  
5. **Deploy 前**先在 Render 的 **Environment** 新增（缺這些會 deploy 失敗或 webhook 無法運作）：

```
LINE_CHANNEL_SECRET=（你的）
LINE_CHANNEL_ACCESS_TOKEN=（你的）
OPENAI_API_KEY=（你的）
OPENAI_MODEL=gpt-4o-mini
SUPABASE_URL=（你的）
SUPABASE_SERVICE_ROLE_KEY=（你的）
```

`PORT` 不用填，Render 會自動給。

> **Deploy failed？** 到 Render → 你的 service → **Logs**，看紅色錯誤。  
> 常見原因：Environment 沒填完、或 Build 失敗。填好變數後按 **Manual Deploy → Deploy latest commit**。

6. Deploy 完成後，網址像：`https://echomind-api.onrender.com`  
7. 測試：瀏覽器開 `https://你的網址/health` 應看到 `{"status":"ok"}`  

### 更新 LINE Webhook

LINE Developers → Messaging API → Webhook URL：

```
https://你的-render網址.onrender.com/webhook
```

→ **Verify** → 開啟 **Use webhook**  
之後可關掉本機 ngrok 與 `npm run dev`（後端）。

---

## 二、Dashboard → Vercel（對外 Link 看紀錄）

1. 登入 https://vercel.com（可用 GitHub 帳號）  
2. **Add New… → Project**  
3. **Import** Git Repository：`Yoman666/echomind`  
4. **Configure Project**（最重要）  
   - **Root Directory**：點 Edit → 選 **`dashboard`** → Continue  
   - Framework Preset：**Next.js**（自動）  
   - Build Command：`npm run build`（預設即可）  
5. **Environment Variables**（展開後新增，值從本機 `dashboard/.env.local` 複製）：

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

6. 按 **Deploy**  
7. 約 1～2 分鐘後會得到對外網址，例如：  
   `https://echomind-xxxx.vercel.app`  

### Vercel 檢查

- 打開 Vercel 網址，應看到 LifeFlow 紀錄列表  
- 若顯示錯誤：Vercel → Project → **Deployments** → 點最新一筆 → **Building Logs**  
- 常見錯誤：忘記設 Root Directory 為 `dashboard`、或環境變數沒填  

### 不要上傳到 Vercel 的密鑰

只在 Vercel 網頁填環境變數，不要 commit `dashboard/.env.local`。  

---

## 部署後檢查

- [ ] Render `/health` 正常  
- [ ] LINE Webhook Verify 成功  
- [ ] 手機 LINE 發訊息 → 回 `saved successfully`  
- [ ] Vercel 網址打開看得到 records  

---

## 注意

- Render **免費方案** 閒置會休眠，第一則 LINE 可能慢 30～60 秒。  
- 每次改程式 push GitHub，Render / Vercel 可自動重新部署（需在平台開啟 Auto-Deploy）。  
