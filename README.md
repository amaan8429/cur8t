# Cur8t

> **Curate your stuff with Cur8t** - AI-powered bookmark manager with smart organization

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🚀 Quick Navigation

**Get Started:**
- [⚡ Quick Start](#quick-start) - Get running in 5 minutes
- [🔧 Installation](#installation) - Step-by-step setup guide
- [📖 API Docs](#api-documentation) - Complete API reference

**Features:**
- [🧠 AI Agents](#core-features) - Smart automation tools
- [🔌 Browser Extension](#core-features) - One-click bookmarking
- [🐙 GitHub Integration](#core-features) - Auto-sync to GitHub

**Tech Stack:**
- [🎨 Frontend](#tech-stack) - Next.js, React, TypeScript
- [🤖 Backend](#tech-stack) - FastAPI, Python, PostgreSQL
- [📦 Integrations](#external-integrations) - OpenAI, GitHub, Social APIs

**Resources:**
- [🏗️ Architecture](#architecture) - System design overview
- [🤝 Contributing](#contributing) - Join the project
- [📦 Deployment](#deployment) - Production setup

---

## What's Cur8t?

Think of Cur8t as your digital librarian that actually knows what you're into. It's a bookmark manager that doesn't just save links - it organizes them intelligently, learns your habits, and makes sharing collections actually fun.

## Quick Features

- 🧠 **AI Organization**: Drop in a bunch of bookmarks, let AI sort them into logical collections
- 🔌 **Browser Extension**: One-click saving with smart collection suggestions
- 👥 **Sharing**: Public, private, or protected collections with invite-only access
- 🐙 **GitHub Sync**: Automatic backup to GitHub repositories
- 📤 **Import/Export**: Multi-browser support (Chrome, Firefox, Safari, Edge)
- 🔑 **API Access**: Full REST API for custom integrations

## Architecture

```
cur8t/
├── cur8t-web/          # 🎨 Main web app (Next.js)
├── agents-api/         # 🤖 AI agents (FastAPI)
├── extension-api/      # 🔌 Browser extension backend
├── bot/                # 🤖 Discord/Telegram bot
├── cli/                # 💻 Command line tools
└── flutter/            # 📱 Mobile app (coming)
```

## Tech Stack

### Frontend (Next.js)
- **Framework**: Next.js 15, React 19, TypeScript 5
- **State**: TanStack Query 5.83, Zustand 5.0
- **UI**: Tailwind CSS 3.4, Radix UI, shadcn/ui, Framer Motion
- **Auth**: Clerk 6.8
- **Database**: Drizzle ORM 0.37, Neon PostgreSQL

### Backend (FastAPI)
- **Framework**: FastAPI 0.104, Python 3.8+
- **AI**: OpenAI GPT-4
- **Data**: BeautifulSoup 4, httpx
- **Server**: Uvicorn 0.24

### Browser Extension
- **Framework**: React 19, TypeScript 5
- **Build**: Vite + CRXJS
- **UI**: Tailwind CSS 4, shadcn/ui
- **APIs**: Chrome Bookmarks API, WebExtension Polyfill

### Infrastructure
- **Database**: PostgreSQL (Neon serverless)
- **Cache**: Redis (Upstash)
- **Rate Limiting**: Upstash Rate Limit
- **Version Control**: GitHub API (Octokit)

## External Integrations

### AI Services
- **OpenAI API 1.12.0**: GPT-4 integration for smart categorization
- **GPT-4 Turbo**: Advanced language model for content analysis
- **Custom AI agents**: Specialized AI features for bookmark organization

### Version Control
- **GitHub API**: Repository management and backup
- **Octokit 4.1.0**: GitHub API client for seamless integration
- **GitHub OAuth**: Account integration and authentication
- **Repository sync**: Two-way synchronization with automatic backups

### Social Platforms
- **Twitter API**: Social media integration for sharing collections
- **LinkedIn API**: Professional networking and profile linking
- **Instagram API**: Photo sharing platform integration
- **Custom social auth**: Platform-specific authentication flows

### Communication
- **Resend**: Transactional email service for notifications
- **Email templates**: Automated messaging system
- **Notification system**: User alerts and updates

### Analytics & Monitoring
- **Custom analytics**: Usage tracking and insights
- **Performance monitoring**: System health and metrics
- **Error tracking**: Bug reporting and debugging
- **User behavior**: Usage analytics and patterns

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- PostgreSQL
- Redis (optional, for rate limiting)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/amaan8429/cur8t.git
cd cur8t
```

2. **Setup web app**
```bash
cd cur8t-web
pnpm install
cp .env.example .env.local
# Edit .env.local with your credentials
pnpm dev
```

3. **Setup AI agents**
```bash
cd agents-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
# Edit .env with your credentials
python run_dev.py
```

4. **Setup extension API**
```bash
cd extension-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp env.example .env
python run_dev.py
```

5. **Setup browser extension**
```bash
cd cur8t-extension
pnpm install
pnpm dev
# Load unpacked extension from dist/ folder in Chrome
```

### Environment Variables

#### Web App (.env.local)
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

#### AI Agents (.env)
```env
OPENAI_API_KEY=sk-...
API_HOST=0.0.0.0
API_PORT=8000
```

#### Extension API (.env)
```env
DATABASE_URL=postgresql://...
API_HOST=0.0.0.0
API_PORT=8001
```

## Core Features

### Collection Management
- Create, organize, and pin collections
- Public/private/protected visibility settings
- Search, filter, and sort collections
- Drag & drop organization
- Rich descriptions with markdown

### AI Agents
**Active:**
- Article Link Extractor - Extract all links from any article
- Bookmark Importer - Import from any browser with AI categorization

**Coming Soon:**
- Collection Generator - Topic-based collection creation
- Smart Export Guide - Custom formatting and templates
- YouTube Extractor - Extract links from video descriptions
- Watch Later Organizer - Auto-sort YouTube playlists

### Browser Extension
- One-click bookmark saving
- Smart collection suggestions
- Favorites management
- AI-powered organization
- Offline support with caching
- Real-time sync with optimistic updates

### GitHub Integration
- OAuth 2.0 authentication
- Automatic 24-hour sync
- Manual sync on-demand
- Two-way synchronization
- Conflict resolution
- Complete backup

### Social & Sharing
- Public user profiles
- Collection discovery
- Like and save collections
- Share via custom URLs
- Protected collections with email invites
- Social media integration (Twitter, GitHub, LinkedIn, Instagram)

## API Documentation

### Authentication
All API requests require authentication via Clerk or API key.

```bash
# Using Clerk token
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  https://api.cur8t.com/api/v1/collections

# Using API key
curl -H "X-API-Key: YOUR_API_KEY" \
  https://api.cur8t.com/api/v1/collections
```

### Collections API
```bash
# List collections
GET /api/v1/collections

# Get collection
GET /api/v1/collections/{id}

# Create collection
POST /api/v1/collections
{
  "title": "My Collection",
  "description": "Collection description",
  "visibility": "public"
}

# Update collection
PATCH /api/v1/collections/{id}

# Delete collection
DELETE /api/v1/collections/{id}
```

### Links API
```bash
# Add link to collection
POST /api/v1/collections/{id}/links
{
  "url": "https://example.com",
  "title": "Example"
}

# Update link
PATCH /api/v1/links/{id}

# Delete link
DELETE /api/v1/links/{id}
```

## Development

### Project Structure
```
cur8t-web/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   ├── store/            # State management
│   └── types/            # TypeScript types
├── migrations/           # Database migrations
└── public/               # Static assets

agents-api/
├── agents/               # AI agent modules
│   ├── article_extractor/
│   ├── bookmark_importer/
│   └── ...
├── config/               # Configuration
├── core/                 # Core utilities
└── tests/                # Tests

extension-api/
├── app/
│   ├── api/              # API routes
│   └── core/             # Core functionality
└── models/               # Data models

cur8t-extension/
├── src/
│   ├── popup/            # Extension popup
│   ├── background/       # Background service
│   ├── content/          # Content scripts
│   └── lib/              # Utilities
└── public/               # Assets
```

### Running Tests
```bash
# Web app
cd cur8t-web
pnpm test

# AI agents
cd agents-api
pytest

# Extension
cd cur8t-extension
pnpm test
```

### Building for Production
```bash
# Web app
cd cur8t-web
pnpm build

# AI agents
cd agents-api
docker build -t cur8t-agents .

# Extension API
cd extension-api
docker build -t cur8t-extension-api .

# Browser extension
cd cur8t-extension
pnpm build
```

## Deployment

### Docker Compose
```bash
docker-compose up -d
```

### Manual Deployment
1. Deploy web app to Vercel/Netlify
2. Deploy APIs to any cloud provider (AWS, GCP, Azure)
3. Setup PostgreSQL database (Neon recommended)
4. Configure Redis (Upstash recommended)
5. Setup environment variables
6. Run database migrations

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python best practices
- Write tests for new features
- Update documentation
- Use conventional commits
- Ensure all tests pass

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [OpenAI](https://openai.com/)
- Authentication by [Clerk](https://clerk.com/)
- Database by [Neon](https://neon.tech/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ by the Cur8t team
