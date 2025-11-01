# **App Name**: LearnTube AI

## Core Features:

- YouTube Transcript Fetch: Fetches and displays the transcript from a YouTube video based on the provided URL.
- Transcript Editing: Allows users to edit the fetched transcript before generating AI notes, with options to download.
- AI Summarization: Generates a concise summary of the transcript using the `gemini-2.0-flash` model. The LLM tool decides if any parts of the information can be omitted in order to create a summary.
- Simplified Explanation (ELI5): Provides a simplified, easy-to-understand explanation of the transcript using the `gemini-2.0-flash` model.
- Flashcard Generation: Creates flashcards from the transcript, with the `gemini-2.0-flash` model determining key terms and concepts.
- Quiz Generation: Generates multiple-choice and short answer questions from the transcript using `gemini-2.0-flash` to assess understanding.
- Timeline Highlights: Identifies and generates a timeline of key moments or events from the transcript using `gemini-2.0-flash` model. The LLM uses reasoning as a tool to make this determination.
- AI Chat Tutor: Allows users to ask questions about the content and receive answers powered by the `gemini-2.0-flash` model.
- Data Storage: Stores user video transcripts in Firestore, indexed under unique session IDs (no login required), as well as locally in browser.

## Style Guidelines:

- Primary color: Indigo (#4F46E5) for a modern and intellectual feel.
- Background color: Light gray (#F9FAFB), providing a clean and unobtrusive backdrop.
- Accent color: Teal (#008080) to highlight interactive elements and call-to-action buttons.
- Body and headline font: 'Inter', a grotesque-style sans-serif font for a modern, machined, objective, neutral look.
- Use a consistent set of icons from a library like Lucide or FontAwesome for a clean, modern look.
- Follow a clean, minimalist layout inspired by Notion and YouTubeStudyKit, with a focus on readability and ease of use.
- Subtle animations and transitions for a smooth, engaging user experience, such as skeleton loading and streaming AI results.