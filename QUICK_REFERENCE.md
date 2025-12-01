# LearnTubeAI - Quick Reference & Troubleshooting

## 🚀 5-Minute Quick Start

```bash
# 1. Navigate to project
cd c:\learntubeai

# 2. Install packages (one time only)
npm install

# 3. Start the dev server
npm run dev

# 4. Open browser to http://localhost:9002
```

**Done!** Now you can:
- Paste YouTube URLs → Auto-fetch transcript
- Ask questions in 28 languages
- Generate summaries, quizzes, flashcards

---

## 📋 Environment Setup

**File:** `.env.local` (in project root)

```env
GEMINI_API_KEY=your_key_here
YT_TRANSCRIPT_API_KEY=your_key_here
```

**Get Keys:**
- Gemini: https://aistudio.google.com/apikey
- YouTube Transcript: https://www.youtube-transcript.io

---

## 🛑 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **Port 9002 in use** | `netstat -ano \| findstr :9002` then `taskkill /PID <ID> /F` |
| **API Key not found** | Restart server after updating `.env.local` |
| **Transcript not fetching** | Check video has captions, verify API key |
| **AI timeout** | Internet issue or API overloaded, retry in 10s |
| **Browser shows error** | Clear cache (Ctrl+Shift+Delete), reload |
| **Flashcards not displaying** | Refresh browser, check console (F12) |
| **Language selector not working** | Regenerate content with new language |

---

## ✨ Features at a Glance

| Feature | Time | Languages |
|---------|------|-----------|
| **Transcript Auto-Fetch** | 2-5s | N/A |
| **Q&A (Ask a Doubt)** | 5-15s | 28 (all Indian + major) |
| **Summary** | 10-20s | English (AI responds in selected language) |
| **Explanation** | 15-30s | English (AI responds in selected language) |
| **Flashcards** | 10-20s | English (AI responds in selected language) |
| **Quiz (10 Qs)** | 15-25s | English (AI responds in selected language) |
| **Timeline** | 10-15s | English (AI responds in selected language) |

---

## 🎯 Step-by-Step Usage

### 1. Load a YouTube Video
- Copy YouTube URL (e.g., `https://www.youtube.com/watch?v=...`)
- Paste in URL field
- Transcript auto-fetches ✓

### 2. Ask Questions (Multilingual)
- Select language from dropdown (bottom left)
- Type question in chat
- Click send or press Enter
- AI responds in selected language with timestamp

### 3. Generate Study Materials
- Click **Summary** → 1-page overview with key points
- Click **Explanation** → 2-page detailed explanation
- Click **Flashcards** → 15-20 interactive study cards (click to flip)
- Click **Quiz** → 10 structured questions with answers
- Click **Timeline** → Key moments with timestamps

### 4. Copy to Clipboard
- Click copy icon in top-right of each tab
- Paste anywhere (docs, notes, etc.)

---

## 🌍 Supported Languages

**Indian Languages (18):**
Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Konkani, Sanskrit, Urdu, Maithili, Dogri, Manipuri, + English

**International (10):**
Spanish, French, German, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Italian

---

## 💾 File Structure

**Important Files:**

- `.env.local` ← **Your API keys** (keep secret!)
- `src/app/api/transcript/route.ts` ← Transcript fetching
- `src/components/app/chat-panel.tsx` ← Q&A UI
- `src/ai/flows/*.ts` ← AI generation logic
- `src/lib/store.ts` ← App state management

---

## 🔄 Workflow Examples

### Example 1: Linear Algebra Tutorial
```
1. Paste YouTube URL of tutorial
2. Wait for transcript (2-5s)
3. Click "Summary" for quick overview
4. Click "Quiz" to test knowledge
5. Generate "Flashcards" for memorization
6. Ask questions in Hindi using Q&A feature
```

### Example 2: Multi-Language Learning
```
1. Load tutorial video
2. Ask questions in Hindi → Get Hindi answer
3. Switch to Bengali → Ask same question
4. Get same answer in Bengali (great for practice!)
```

---

## 📊 Data Flow

```
YouTube URL
    ↓
Auto-Fetch Transcript (API call)
    ↓
Store in Memory + State
    ↓
User selects feature
    ↓
AI Generation (Genkit + Gemini)
    ↓
Display Results (Summary/Quiz/Flashcards)
    ↓
User can copy or ask follow-up questions
```

---

## ⚙️ Technical Stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **State:** Zustand
- **UI Components:** Radix UI + Shadcn
- **AI:** Google Gemini 2.0 Flash
- **Transcript API:** youtube-transcript.io
- **Icons:** Lucide React
- **Build:** Turbopack (Next.js turbo)

---

## 🔐 Security Notes

- **Never commit `.env.local`** (it's in .gitignore)
- **Keep API keys secret** - they're in your environment
- **Transcripts are cached locally** (in-memory, cleared on server restart)
- **No user data stored** - stateless app

---

## 📈 Performance

- **Cold Start:** 5-10s (first load)
- **Warm Cache:** < 1s (same video again)
- **Transcript Fetch:** 2-5s
- **AI Generation:** 10-30s (depends on feature)
- **Flashcard Flip:** Smooth 500ms animation

---

## ✅ Verification Checklist

Run this to verify everything is working:

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if .env.local exists and has keys
type .env.local

# Start server
npm run dev

# In browser: http://localhost:9002
# Try pasting a YouTube URL
```

---

## 🎓 Sample YouTube Videos to Test

Try these educational videos:

1. **Mathematics:** Linear Algebra, Calculus, Statistics
2. **Physics:** Quantum Mechanics, Thermodynamics
3. **Programming:** Python, JavaScript, Web Development
4. **Languages:** Any tutorial, lecture, or educational content

**Requirement:** Video must have YouTube captions available

---

## 💡 Tips & Tricks

- **Keyboard Shortcut:** Press Enter to send Q&A question
- **Dark Mode:** Automatically matches your system preference
- **Mobile Friendly:** Responsive design for tablets (experimental)
- **Offline:** Once loaded, UI works offline (but API calls won't)
- **Export Flashcards:** Copy button exports to JSON format

---

## 🆘 Get Help

1. **Check SETUP_GUIDE.md** (detailed troubleshooting)
2. **Check browser console** (F12 → Console)
3. **Check server logs** (terminal where `npm run dev` runs)
4. **Verify API keys** are correct and have quota
5. **Restart everything** (kill server, clear cache, npm run dev)

---

**Last Updated:** November 17, 2025
**App Status:** ✅ Production Ready (Local Use)
