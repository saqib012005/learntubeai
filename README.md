# LearnTubeAI 🎓

**An intelligent educational platform that transforms YouTube videos into comprehensive learning materials using AI.**

Paste a YouTube URL → Get instant summaries, explanations, quizzes, flashcards, and ask questions in 28 languages.

---

## ✨ Features

- ✅ **Auto-Fetch Transcripts** from YouTube videos (2-5 seconds)
- ✅ **AI-Powered Content Generation:**
  - Summary (~1 page with key concepts)
  - Explanation (~2 pages in simple language)
  - Flashcards (15-20 interactive study cards with flip animation)
  - Quiz (10 structured questions with explanations)
  - Timeline (key highlights with timestamps)
- ✅ **Multilingual Q&A** - Ask questions in 28 languages (all Indian languages included!)
- ✅ **Smart Caching** - Fast retrieval for repeated videos
- ✅ **Professional UI** - Dark mode, responsive design, smooth animations

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API Key
- YouTube Transcript API Key

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your API keys
# GEMINI_API_KEY=your_key_here
# YT_TRANSCRIPT_API_KEY=your_key_here

# 3. Run development server
npm run dev

# 4. Open browser to http://localhost:9002
```

**📖 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions**

---

## 🎯 How to Use

1. **Paste YouTube URL** → Transcript auto-fetches
2. **Generate Content** → Click Summary, Flashcards, Quiz, etc.
3. **Ask Questions** → Select language → Get instant answers
4. **Study** → Flip flashcards, take quizzes, review timeline

---

## 🌍 Supported Languages

**Indian:** Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Konkani, Sanskrit, Urdu, Maithili, Dogri, Manipuri

**International:** English, Spanish, French, German, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Italian

---

## 📊 Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI
- **State Management:** Zustand
- **AI:** Google Gemini 2.0 Flash
- **Transcript API:** youtube-transcript.io
- **Build Tool:** Turbopack

---

## 🔧 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm run typecheck    # TypeScript validation
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/transcript/route.ts       # Auto-fetch transcript
│   ├── actions.ts                    # Server actions
│   └── page.tsx                      # Main app
├── ai/
│   ├── genkit.ts                     # AI config
│   └── flows/                        # AI generation flows
├── components/
│   ├── app/                          # App components
│   └── ui/                           # UI components
├── lib/
│   ├── store.ts                      # State (Zustand)
│   ├── types.ts                      # TypeScript types
│   └── utils.ts
└── hooks/                            # Custom hooks
```

---

## 🛑 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 9002 in use | Kill process: `taskkill /PID <PID> /F` |
| API key not found | Restart server after updating `.env.local` |
| Transcript not fetching | Verify video has captions, check API key |
| Browser error | Clear cache, reload page |

**📖 See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for more troubleshooting**

---

## 📈 Performance

- **First Load:** 5-10 seconds
- **Transcript Fetch:** 2-5 seconds
- **AI Generation:** 10-30 seconds (cached: < 1 second)
- **Flashcard Flip:** Smooth 500ms animation

---

## 🎓 Example Workflow

```
1. Paste: https://www.youtube.com/watch?v=...
   ↓
2. Transcript auto-fetches (2-5s)
   ↓
3. Click "Summary" → Get 1-page overview (15s)
   ↓
4. Click "Flashcards" → Get 20 study cards (15s)
   ↓
5. Select Hindi language → Ask questions in Hindi
   ↓
6. Get instant answers with timestamps
```

---

## 🔐 Security

- API keys stored in `.env.local` (never committed)
- Transcripts cached locally (cleared on server restart)
- No user data stored or transmitted
- Stateless application

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and troubleshooting
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference and tips

---

## 🚀 Future Enhancements

- Authentication & user sessions
- Database for persistent storage
- Multiple transcript providers
- Error tracking (Sentry)
- Unit & integration tests
- Deployment to Vercel/Netlify

---

## 📝 License

This project is open source.

---

## 👨‍💻 Built with ❤️

Designed for students and educators to make learning from YouTube more effective.

**Start learning smarter today! 🎓**
