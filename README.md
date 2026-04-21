# 🎓 Portrait AI — Your AI-Powered Canvas Companion

> 🏆 **Track E Winner — HackTheCoast 2026** | 60+ participants

> A smarter way to stay on top of your coursework.

Portrait AI connects directly to your Canvas LMS to give you a unified, intelligent dashboard for managing your academic life. Powered by **Google Gemini 2.5 Flash** and **RAG (Retrieval-Augmented Generation)**, it turns your syllabi, assignments, and announcements into actionable insights — in real time.

---

## ✨ Features

### 📊 Workflow Optimizer Dashboard
- AI-prioritized task list based on assignment weights, due dates, and your major focus
- Grade maintenance tracker with color-coded progress bars per course
- Live AI study suggestions generated from your upcoming deadline load

### 📅 Smart Calendar
- Monthly calendar view with all Canvas assignments synced automatically
- Toggle between **Start Dates** (blue) and **Due Dates** (red) to plan ahead
- Intelligent start-date estimation based on assignment point values

### 📚 Courses Overview
- All enrolled courses at a glance with next upcoming assignment surfaced
- One-click "Ask AI about this class" deep-links to the Portrait AI chatbot with course context pre-filled
- Live grade display pulled directly from Canvas

### 📢 Announcements Feed
- All course announcements in a single scrollable view
- **AI Summarize** button — distills any announcement into 2–3 bullet points via Gemini

### 🤖 Portrait AI Chatbot
- Conversational AI with full RAG context over all your course syllabi
- Automatically extracts and indexes PDF syllabi linked within Canvas
- Ask questions like:
  - *"When is my Calc 2 final?"*
  - *"Who is my English professor?"*
  - *"What should I study tonight?"*

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                  React Frontend                  │
│  (Vite + Tailwind CSS + React Router)            │
│  Dashboard │ Calendar │ Courses │ Chat │ Anncts  │
└────────────────────┬─────────────────────────────┘
                     │ REST API (localhost:8000)
┌────────────────────▼─────────────────────────────┐
│               FastAPI Backend                    │
│                                                  │
│  ┌─────────────┐   ┌──────────────────────────┐  │
│  │  Canvas API │   │   SQLite Database         │  │
│  │  Sync Layer │──▶│  (courses, assignments,   │  │
│  │  (sync.py)  │   │   announcements, meta)    │  │
│  └─────────────┘   └──────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │   RAG Engine (rag.py)                    │    │
│  │   LangChain + Gemini 2.5 Flash           │    │
│  │   Syllabus context from DB + PDF extract │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| **Frontend**| React 18, Vite, Tailwind CSS, Lucide Icons     |
| **Backend** | Python, FastAPI, Uvicorn                       |
| **Database**| SQLite via SQLAlchemy ORM                      |
| **AI / LLM**| Google Gemini 2.5 Flash via LangChain          |
| **Canvas**  | Canvas REST API (`canvasapi`)                  |
| **PDF RAG** | `pypdf` + BeautifulSoup for syllabus extraction|

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Canvas LMS account and API token
- A Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/Tomy2years/HackTheCoast.git
cd HackTheCoast
```

### 2. Configure environment variables
Create a `.env` file in the project root:
```env
CANVAS_API_KEY=your_canvas_api_token
CANVAS_BASE_URL=https://yourschool.instructure.com
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Start the backend
```bash
cd server
pip install -r requirements.txt
python main.py
```
The backend will start at `http://localhost:8000` and automatically sync your Canvas data on startup.

### 4. Start the frontend
```bash
# From the project root
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
HackTheCoast/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx        # Workflow optimizer + AI suggestions
│   │   ├── CalendarView.jsx     # Monthly assignment calendar
│   │   ├── CoursesView.jsx      # Course cards + grade display
│   │   ├── AnnouncementsView.jsx# Announcements + AI summarize
│   │   └── ChatView.jsx         # Portrait AI chatbot
│   ├── components/
│   │   └── Navigation.jsx       # Sidebar navigation
│   └── lib/
│       ├── DataContext.jsx      # Global state + API fetching
│       └── canvas.js            # API client helper
├── server/
│   ├── main.py                  # FastAPI app + all API routes
│   ├── sync.py                  # Canvas data sync (courses, assignments, announcements)
│   ├── rag.py                   # RAG engine — syllabus Q&A via Gemini
│   ├── canvas_api.py            # Canvas API wrapper
│   ├── database.py              # SQLAlchemy models + DB init
│   └── requirements.txt
└── .env                         # API keys (not committed)
```

---

## 🔌 API Endpoints

| Method | Endpoint                     | Description                                |
|--------|------------------------------|--------------------------------------------|
| GET    | `/api/courses`               | All enrolled courses with next assignment  |
| GET    | `/api/assignments`           | Upcoming assignments with smart start dates|
| GET    | `/api/announcements`         | All course announcements                   |
| GET    | `/api/suggestions`           | AI-generated study suggestions (Gemini)    |
| POST   | `/api/announcements/summarize`| Summarize an announcement with Gemini     |
| POST   | `/api/chat`                  | RAG-powered Q&A over all syllabi           |
| POST   | `/api/sync`                  | Manually trigger a Canvas data refresh     |
| GET    | `/api/sync/status`           | View last successful sync time             |

---

## 🧠 How the RAG Works

1. On startup, `sync.py` fetches all courses from Canvas via the API
2. For each course, it downloads the syllabus body and follows any linked PDF or Google Docs files, extracting their full text using `pypdf`
3. All syllabus content is stored in SQLite alongside assignments and announcements
4. When you ask a question in the chatbot, `rag.py` assembles all course context into a single structured XML prompt and sends it to Gemini 2.5 Flash
5. Gemini answers with strict rules about not mixing up information between courses

---

## 🤝 Team

Built at **HackTheCoast 2026**.

---

## 📄 License

MIT License — feel free to fork and adapt for your own school's Canvas instance.
