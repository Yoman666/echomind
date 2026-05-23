
# 🧠 LifeFlow AI - Project Spec (Source of Truth)

This file defines the entire system behavior. Cursor must follow this strictly.

---

# 📌 1. Project Goal

Build a LINE-based AI personal life logging system.

Users send messages in LINE, and AI automatically:
- classifies the message
- structures the data
- stores it into a database
- displays it in a web dashboard

This is NOT a chatbot.
This is a personal life memory system.

---

# 🧩 2. Core Concept

User does ONLY ONE THING:
→ Send free-text message in LINE

Example:
- "今天花120買咖啡"
- "今天心情很差"
- "看完原子習慣"
- "今天開會很累"

System handles everything else automatically.

---

# ⚙️ 3. Tech Stack (MVP)

- Backend: Node.js + Express
- Frontend: Next.js (simple dashboard)
- Database: Supabase (PostgreSQL)
- AI: OpenAI API
- Integration: LINE Messaging API

---

# 🔁 4. System Flow

LINE User
→ Webhook (Express)
→ OpenAI Classification
→ Structured JSON Output
→ Save to Supabase
→ Web Dashboard Display

---

# 🤖 5. AI Classification Rules (CRITICAL)

Every input MUST be classified into ONE of:

- expense (money spending)
- mood (emotion / feeling)
- journal (daily life event)
- learning (knowledge / study)

No other types are allowed.

---

# 📤 6. AI Output Format (STRICT JSON ONLY)

AI MUST return ONLY this format:

{
  "type": "expense | mood | journal | learning",
  "title": "short title (max 10 chars)",
  "content": "cleaned version of input",
  "tags": ["tag1", "tag2"],
  "amount": number or null
}

---

# ⚠️ 7. Rules (VERY IMPORTANT)

- AI must NEVER return explanation text
- AI must ONLY return valid JSON
- type must always be one of the 4 types
- expense MUST include amount
- non-expense must have amount = null
- tags must have at least 1 item
- system must be deterministic and consistent

---

# 🗂 8. Database Schema (Supabase)

Table: records

Fields:
- id (uuid)
- user_id (text)
- type (text)
- title (text)
- content (text)
- raw_input (text)
- tags (json array)
- amount (number nullable)
- created_at (timestamp)

---

# 📊 9. MVP Features

Must implement:

- LINE message receiving
- AI classification
- Store data into database
- Web dashboard list view
- Filter by type (expense/mood/journal/learning)

---

# 🎯 10. Product Philosophy

This is NOT:
- Not a chatbot
- Not a LINE bot demo
- Not a CRUD app

This IS:
- AI personal memory system
- Life data structuring tool
- Second brain for everyday life

---

# 🚨 11. Development Rule for Cursor

Always:
- read this file before generating code
- follow strict JSON format
- do not invent new features
- keep MVP minimal and working first
