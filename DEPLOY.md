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
5. 在 Render 的 **Environment** 手動新增：

```
LINE_CHANNEL_SECRET=（你的）
LINE_CHANNEL_ACCESS_TOKEN=（你的）
OPENAI_API_KEY=（你的）
OPENAI_MODEL=gpt-4o-mini
SUPABASE_URL=（你的）
SUPABASE_SERVICE_ROLE_KEY=（你的）
```

`PORT` 不用填，Render 會自動給。

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

## 二、Dashboard → Vercel（給瀏覽器看紀錄）

1. 登入 https://vercel.com  
2. **Add New → Project** → 匯入 `Yoman666/echomind`  
3. **Root Directory** 設為：`dashboard`  
4. Framework 應自動辨識為 Next.js  
5. **Environment Variables** 新增：

```
NEXT_PUBLIC_SUPABASE_URL=（同 SUPABASE_URL）
SUPABASE_SERVICE_ROLE_KEY=（你的 service role key）
```

6. Deploy  
7. 完成後會有：`https://echomind-xxxx.vercel.app`  

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
