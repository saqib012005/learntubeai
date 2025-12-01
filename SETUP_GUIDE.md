# LearnTubeAI - Setup & Run Guide

**A professional educational AI tool that auto-fetches YouTube transcripts and generates summaries, explanations, flashcards, quizzes, timelines, and multilingual support for Q&A.**

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v18+ recommended) - Download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)
- **API Keys:**
  - **Google Gemini API Key** (for AI generation)
  - **YouTube Transcript API Key** (for transcript fetching)

---

## 🔑 Get Your API Keys

### 1. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API Key"** in a new project
3. Copy your API key

### 2. YouTube Transcript API Key
1. Visit [youtube-transcript.io](https://www.youtube-transcript.io)
2. Sign up or login
3. Get your API key from your account/dashboard
4. This key allows fetching transcripts from YouTube videos

---

## 📦 Installation Steps

### Step 1: Clone or Navigate to Project
```bash
# If cloning:
git clone <repo-url>
cd learntubeai

# Or navigate to existing project folder
cd c:\learntubeai
```

### Step 2: Install Dependencies
```bash
npm install
```
This will download all required packages (Next.js, React, Genkit, UI components, etc.)

**Expected time:** 2-5 minutes

### Step 3: Configure Environment Variables
1. Create or edit `.env.local` file in the project root:
```bash
# .env.local

# Google Gemini API Key (required for AI generation)
GEMINI_API_KEY=your_google_gemini_api_key_here

# YouTube Transcript API Key (required for transcript fetching)
YT_TRANSCRIPT_API_KEY=your_youtube_transcript_api_key_here

# Optional: Override YouTube Transcript API URL (default: https://www.youtube-transcript.io/api)
# YT_TRANSCRIPT_API_URL=https://www.youtube-transcript.io/api
```

**Replace with your actual keys!**

### Step 4: Verify Environment Setup
```bash
# Check Node version
node --version
# Should be v18 or higher

# Check npm version
npm --version
```

---

## 🚀 Running the Development Server

### Start the Server
```bash
npm run dev
```

**What you should see:**
```
> nextn@0.1.0 dev
> next dev --turbopack -p 9002

   ▲ Next.js 15.3.3 (Turbopack)
   - Local:        http://localhost:9002
   - Network:      http://10.133.187.187:9002
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1117ms
```

### Access the Application
Open your browser and go to:
- **Local:** `http://localhost:9002`
- **Network:** `http://10.133.187.187:9002` (if on same network)

---

## ✨ Features Overview

Once running, you can:

### 1. **Auto-Fetch YouTube Transcript**
   - Paste a YouTube URL in the input field
   - Transcript auto-fetches in 2-3 seconds
   - Manual paste fallback available

### 2. **Ask a Doubt (Multilingual Q&A)**
   - Select language (28 languages including all Indian languages)
   - Ask questions about the video
   - Get instant AI-powered answers in selected language
   - Includes relevant timestamps

### 3. **Generate Content**
   - **Summary** (~1 page with key concepts)
   - **Explanation** (~2 pages in simple language)
   - **Flashcards** (15-20 study cards with flip animation)
   - **Quiz** (10 structured questions with explanations)
   - **Timeline** (key highlights with timestamps)

### 4. **Supported Languages**
   - **Indian:** Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Konkani, Sanskrit, Urdu, Maithili, Dogri, Manipuri
   - **International:** English, Spanish, French, German, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Italian

---

## 🛑 Troubleshooting

### Issue: "Port 9002 already in use"
```bash
# Kill the process using port 9002
# Windows:
netstat -ano | findstr :9002
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :9002
kill -9 <PID>

# Then restart
npm run dev
```

### Issue: "API Key is not configured"
- Check `.env.local` exists in project root
- Verify `GEMINI_API_KEY` and `YT_TRANSCRIPT_API_KEY` are set
- Restart the dev server after updating `.env.local`

### Issue: "Transcript fetch failed"
- Verify YouTube video has available captions
- Check your `YT_TRANSCRIPT_API_KEY` is valid
- Try with a different YouTube video

### Issue: "AI generation timeout or error"
- Check your `GEMINI_API_KEY` is valid
- Verify internet connection
- Try again after a few seconds (API might be throttled)

### Issue: "Objects are not valid as a React child"
- Clear browser cache: `Ctrl+Shift+Delete`
- Restart dev server: `npm run dev`
- Reload page in browser

---

## 📁 Project Structure

```
learntubeai/
├── src/
│   ├── app/
│   │   ├── api/transcript/route.ts       # Auto-fetch transcript endpoint
│   │   ├── actions.ts                    # Server actions for AI flows
│   │   ├── page.tsx                      # Main app page
│   │   └── layout.tsx
│   ├── ai/
│   │   ├── genkit.ts                     # AI configuration (Gemini 2.0)
│   │   └── flows/
│   │       ├── ai-chat-tutor.ts          # Q&A with language support
│   │       ├── summarize-lecture.ts      # 1-page summaries
│   │       ├── explain-simply.ts         # 2-page explanations
│   │       ├── create-flashcards.ts      # Study cards
│   │       ├── generate-quiz.ts          # Structured questions
│   │       └── timeline-highlights.ts    # Key moments
│   ├── components/
│   │   ├── app/
│   │   │   ├── chat-panel.tsx            # Q&A UI with language selector
│   │   │   ├── transcript-editor-autofetch.tsx  # Auto-fetch logic
│   │   │   └── output-section.tsx        # Display results (Summary, Quiz, Flashcards, etc)
│   │   └── ui/                           # Radix UI components
│   ├── lib/
│   │   ├── store.ts                      # Zustand state management
│   │   ├── types.ts                      # TypeScript types
│   │   └── utils.ts
│   └── hooks/
├── .env.local                            # Environment variables (not in git)
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🔧 Available Commands

```bash
# Development server (Turbopack, faster rebuilds)
npm run dev

# Production build
npm run build

# Start production server
npm start

# TypeScript type checking
npm run typecheck

# Linting
npm run lint
```

---

## ⚡ Performance Tips

1. **First Load:** 5-10 seconds (depends on internet)
2. **Transcript Fetch:** 2-5 seconds per video
3. **AI Generation:** 10-30 seconds per feature (summary, quiz, etc.)
4. **Flashcard Flip:** Smooth 3D animation (500ms)

**Cached requests** (same video/language) will be much faster (< 1 second)

---

## 🎯 Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] Project cloned/navigated
- [ ] `npm install` completed
- [ ] `.env.local` created with both API keys
- [ ] `npm run dev` running (server on 9002)
- [ ] Browser opens to `http://localhost:9002`
- [ ] Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=...)
- [ ] Transcript auto-fetches ✓
- [ ] Try "Ask a doubt" with different languages ✓
- [ ] Generate Summary/Quiz/Flashcards ✓

---

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Check browser console** for detailed error messages (`F12` > Console tab)
3. **Check terminal output** where `npm run dev` is running
4. **Verify API keys** are correct and have sufficient quota
5. **Restart the server** and clear browser cache

---

## 🚀 Next Steps (Optional Enhancements)

- Add authentication to track user sessions
- Deploy to Vercel/Netlify for online access
- Setup error tracking (Sentry)
- Add unit tests
- Implement persistent storage (database)
- Add more transcript providers (Deepgram, AssemblyAI)

---

**Enjoy learning! 🎓**
