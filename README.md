# NovelCraft — AI-Powered Web Novel Creation Assistant
### AI 기반 웹 소설 창작 도우미

---

## Overview / 개요

**NovelCraft** is a full-stack AI-powered web novel creation assistant built with Next.js 16 (App Router), Tailwind CSS, and GPT-4o. It helps writers build immersive worlds, develop complex characters, generate story chapters, polish their writing, and export their finished novel.

**NovelCraft**는 Next.js 16, Tailwind CSS, GPT-4o를 기반으로 한 풀스택 AI 웹 소설 창작 도우미입니다.

---

## Features / 주요 기능

- 🌍 **World Builder** — Generate detailed world settings from genre, tone, and background
- 👥 **Character Sheet** — Create and manage characters with AI-assisted profile generation
- 📖 **Chapter Generator** — AI-powered chapter writing with story continuity
- ✏️ **Editing Tools** — Rewrite and Expand your content with AI
- 📤 **Export** — Save your novel as PDF or Markdown

---

## Tech Stack / 기술 스택

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| State Management | Zustand |
| AI | OpenAI GPT-4o |
| Icons | Lucide React |
| Export | jsPDF (PDF), Native Blob API (Markdown) |

---

## Installation / 설치

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your API keys

# 3. Run the development server
npm run dev
```

---

## Environment Variables / 환경 변수

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note:** The app works without API keys in demo mode. Add your OpenAI key to enable real AI generation.

---

## Project Structure / 프로젝트 구조

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── generate/route.ts
│       ├── character/route.ts
│       └── edit/route.ts
├── components/
│   ├── Sidebar.tsx
│   ├── WorldBuilder.tsx
│   ├── CharacterSheet.tsx
│   ├── ChapterGenerator.tsx
│   ├── EditingTools.tsx
│   └── ExportPanel.tsx
├── store/
│   └── novelStore.ts
└── lib/
    ├── openai.ts
    └── export.ts
```

---

## License / 라이선스

MIT License
