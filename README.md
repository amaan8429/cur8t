# Cur8t

> **Curate your stuff with Cur8t** - just a stupid side project turned into something that might be useful

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [🎯 What's Cur8t?](#whats-cur8t)
  - [The Problem](#the-problem)
  - [The Solution](#the-solution)
- [🚀 What Can You Do?](#what-can-you-do)
  - [🧠 Smart Organization](#-smart-organization)
  - [🔌 Browser Integration](#-browser-integration)
  - [👥 Sharing & Collaboration](#-sharing--collaboration)
  - [🛠️ Developer Features](#️-developer-features)
  - [📊 Analytics & Insights](#-analytics--insights)
  - [🔧 Advanced Features](#-advanced-features)
- [✨ Collection Features Deep Dive](#-collection-features-deep-dive)
  - [📁 Collection Management](#-collection-management)
  - [🎯 Core Collection Actions](#-core-collection-actions)
  - [⚙️ Collection Actions Menu](#️-collection-actions-menu)
- [🎨 User Interface Features](#-user-interface-features)
  - [🎛️ Dashboard Overview](#️-dashboard-overview)
  - [🔍 Search & Discovery](#-search--discovery)
  - [📱 Mobile Responsive](#-mobile-responsive)
- [🛠️ Technical Features](#️-technical-features)
  - [🔐 Authentication & Security](#-authentication--security)
  - [⚡ Performance Optimizations](#-performance-optimizations)
  - [🔄 Real-time Features](#-real-time-features)
- [🏗️ Architecture](#️-architecture)
  - [🎨 Frontend (Next.js)](#-frontend-nextjs)
  - [🤖 Backend (FastAPI)](#-backend-fastapi)
  - [🗄️ Database](#️-database)
  - [🔌 APIs](#-apis)
- [📊 Database Schema](#database-schema)
- [🔄 How It Works](#how-it-works)
  - [The Stack](#the-stack)
  - [The Architecture](#the-architecture)
  - [Project Structure](#project-structure)
    - [🎨 cur8t-web (Next.js Frontend)](#-cur8t-web-nextjs-frontend)
    - [🤖 agents-api (FastAPI AI Agents)](#-agents-api-fastapi-ai-agents)
    - [🔌 extension-api (FastAPI Extension Backend)](#-extension-api-fastapi-extension-backend)
    - [🔧 Browser Extension (React + TypeScript)](#-browser-extension-react--typescript)
  - [Data Flow](#data-flow)
- [🚀 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [🔧 Installation](#-installation)
  - [⚙️ Configuration](#️-configuration)
  - [🌐 Environment Variables](#-environment-variables)
- [🛠️ Development](#️-development)
  - [📁 Project Structure](#-project-structure)
  - [🔧 Development Setup](#-development-setup)
  - [🧪 Testing](#-testing)
  - [📦 Deployment](#-deployment)
- [🔌 API Documentation](#-api-documentation)
  - [🔑 Authentication](#-authentication)
  - [📚 Collections API](#-collections-api)
  - [🔗 Links API](#-links-api)
  - [👤 Users API](#-users-api)
- [🤖 AI Agents](#-ai-agents)
  - [📰 Article Extractor](#-article-extractor)
  - [📚 Bookmark Importer](#-bookmark-importer)
  - [🎯 Collection Generator](#-collection-generator)
  - [📤 Smart Export](#-smart-export)
  - [⏰ Watch Later Organizer](#-watch-later-organizer)
  - [📺 YouTube Extractor](#-youtube-extractor)
- [🔧 Browser Extension](#-browser-extension)
  - [📱 Features](#-features)
  - [🛠️ Installation](#️-installation)
  - [⚙️ Configuration](#️-configuration-1)
- [📊 Analytics & Monitoring](#-analytics--monitoring)
  - [📈 Usage Analytics](#-usage-analytics)
  - [🔍 Error Tracking](#-error-tracking)
  - [⚡ Performance Monitoring](#-performance-monitoring)
- [🔒 Security](#-security)
  - [🔐 Authentication](#-authentication-1)
  - [🛡️ Rate Limiting](#️-rate-limiting)
  - [🔒 Data Protection](#-data-protection)
- [📦 Deployment](#-deployment)
  - [🐳 Docker](#-docker)
  - [☁️ Cloud Deployment](#️-cloud-deployment)
  - [🔧 Environment Setup](#-environment-setup)
- [🤝 Contributing](#-contributing)
  - [📋 Development Guidelines](#-development-guidelines)
  - [🐛 Bug Reports](#-bug-reports)
  - [💡 Feature Requests](#-feature-requests)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## What's Cur8t?

Think of Cur8t as your digital librarian that actually knows what you're into. It's a bookmark manager that doesn't just save links - it organizes them intelligently, learns your habits, and makes sharing collections actually fun.

### The Problem

- Bookmarks scattered across browsers
- No way to organize by topic or project
- Can't share collections easily
- No smart categorization
- Importing bookmarks is a pain

### The Solution

Cur8t gives you AI-powered organization, seamless browser integration, and a way to actually find your saved stuff when you need it.

## What Can You Do?

### 🧠 Smart Organization

- **AI Categorization**: Drop in a bunch of bookmarks, let AI sort them into logical collections
- **Article Extraction**: Paste any article URL, get all the links extracted into a collection
- **Smart Collections**: AI suggests collections based on your interests and browsing patterns

### 🔌 Browser Integration

- **One-Click Saving**: Browser extension saves any page instantly
- **Smart Suggestions**: Extension suggests the best collection for each bookmark
- **Multi-Browser Support**: Import from Chrome, Firefox, Safari, Edge

### 👥 Sharing & Collaboration

- **Public Collections**: Share your curated lists with the world
- **Protected Collections**: Invite specific people to view your collections
- **Social Profiles**: Connect your social media accounts, showcase your collections

### 🛠️ Developer Features

- **GitHub Sync**: Back up collections to GitHub repositories
- **API Access**: Full API for building custom integrations
- **VS Code Integration**: Manage bookmarks right from your editor
- **CLI Tools**: Command-line access to your collections

### 📊 Analytics & Insights

- **Collection Analytics**: See which collections get the most views
- **Usage Stats**: Track your bookmarking habits
- **Export Options**: JSON, CSV, PDF exports

### 🔧 Advanced Features

- **Rate Limiting**: Built-in protection against spam
- **Real-time Sync**: Changes appear instantly across devices
- **Search & Filter**: Find anything in your collections quickly
- **Custom URLs**: Create pretty URLs for your collections
- **Favorites System**: Mark collections as favorites for quick access

## ✨ Collection Features Deep Dive

### 📁 **Collection Management**

<div align="center">

![Collection Features](https://via.placeholder.com/800x400/6366f1/ffffff?text=Collection+Features+Showcase)

</div>

#### 🎯 **Core Collection Actions**

| Feature                   | Description                                       | Visual                                                                                               |
| ------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **📌 Pin Collections**    | Pin up to 3 collections for quick access          | ![Pin Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Pin+Collections)           |
| **🔍 Search Collections** | Find collections instantly with smart search      | ![Search Collections](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Search+Collections)     |
| **➕ Create Collections** | One-click collection creation with AI suggestions | ![Create Collections](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Create+Collections)     |
| **📂 Organize**           | Drag & drop, sort by date, name, or custom order  | ![Organize Collections](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Organize+Collections) |

#### ⚙️ **Collection Actions Menu**

<div align="center">

**🎛️ Right-click any collection to access:**

</div>

| Action                | Icon | What it does                                     | Visual                                                                                         |
| --------------------- | ---- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Pin/Unpin**         | 📌   | Pin collection to top for quick access           | ![Pin/Unpin](https://via.placeholder.com/300x200/10b981/ffffff?text=Pin+Unpin)                 |
| **Change Visibility** | 🌐   | Public, Private, or Protected with email invites | ![Change Visibility](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Change+Visibility) |
| **Copy Link**         | 🔗   | Get shareable link to collection                 | ![Copy Link](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Copy+Link)                 |
| **Rename**            | ✏️   | Change collection name instantly                 | ![Rename](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Rename)                       |
| **Edit Description**  | 📝   | Add or update collection description             | ![Edit Description](https://via.placeholder.com/300x200/ef4444/ffffff?text=Edit+Description)   |
| **Delete**            | 🗑️   | Remove collection with confirmation              | ![Delete](https://via.placeholder.com/300x200/dc2626/ffffff?text=Delete)                       |

#### 🎨 **Collection Customization**

<div align="center">

**🎨 Customize your collections:**

</div>

![Collection Customization](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=Collection+Customization)

- **📝 Title & Description**: Add rich descriptions with emojis
- **🎨 Visual Indicators**: Open/closed folder icons, pinned badges
- **🔍 Smart Tooltips**: Hover to see full description
- **📱 Responsive Design**: Works perfectly on mobile and desktop

#### 🔗 **Sharing & Collaboration**

<div align="center">

**🌐 Three visibility levels:**

</div>

| Visibility    | Icon | Description                     | Visual                                                                         |
| ------------- | ---- | ------------------------------- | ------------------------------------------------------------------------------ |
| **Public**    | 🌍   | Anyone can view and discover    | ![Public](https://via.placeholder.com/300x200/10b981/ffffff?text=Public)       |
| **Private**   | 🔒   | Only you can see                | ![Private](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Private)     |
| **Protected** | 👥   | Invite specific people by email | ![Protected](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Protected) |

#### 📊 **Collection Analytics**

<div align="center">

**📈 Track your collections:**

</div>

![Collection Analytics](https://via.placeholder.com/800x300/f59e0b/ffffff?text=Collection+Analytics)

- **👀 View Count**: See how many people visit your collections
- **📅 Last Updated**: Track when you last modified
- **🔗 Link Count**: Know how many links are in each collection
- **⭐ Engagement**: Monitor which collections are most popular

#### 📤 **Export & Backup**

<div align="center">

**💾 Export in multiple formats:**

</div>

| Format   | Icon | Use Case                             | Visual                                                                             |
| -------- | ---- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| **JSON** | 📄   | Developer-friendly, full data export | ![JSON Export](https://via.placeholder.com/300x200/10b981/ffffff?text=JSON+Export) |
| **CSV**  | 📊   | Spreadsheet analysis                 | ![CSV Export](https://via.placeholder.com/300x200/3b82f6/ffffff?text=CSV+Export)   |
| **PDF**  | 📑   | Printable documentation              | ![PDF Export](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=PDF+Export)   |

#### 🔄 **Advanced Actions**

<div align="center">

**⚡ Quick actions from the main menu:**

</div>

| Action                | Icon | Description                           | Visual                                                                                         |
| --------------------- | ---- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Customize Page**    | ⚙️   | Edit title, description, and metadata | ![Customize Page](https://via.placeholder.com/300x200/10b981/ffffff?text=Customize+Page)       |
| **Change Visibility** | 🌟   | Update who can see your collection    | ![Change Visibility](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Change+Visibility) |
| **Copy Link**         | 🔗   | Get shareable URL                     | ![Copy Link](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Copy+Link)                 |
| **Duplicate**         | 📋   | Create exact copy with all links      | ![Duplicate](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Duplicate)                 |
| **View Analytics**    | 📊   | See detailed usage statistics         | ![View Analytics](https://via.placeholder.com/300x200/ef4444/ffffff?text=View+Analytics)       |
| **Export**            | ⬇️   | Download in your preferred format     | ![Export](https://via.placeholder.com/300x200/dc2626/ffffff?text=Export)                       |

### 🎯 **Smart Features**

<div align="center">

**🤖 AI-Powered Organization:**

</div>

![AI Features](https://via.placeholder.com/800x300/6366f1/ffffff?text=AI+Features)

- **🧠 Auto-Categorization**: AI sorts bookmarks into logical collections
- **📝 Smart Descriptions**: AI generates descriptions for your collections
- **🔍 Intelligent Search**: Find collections by content, not just names
- **📊 Usage Insights**: AI suggests which collections you use most

### 🔧 **Developer-Friendly**

<div align="center">

**💻 Built for developers:**

</div>

![Developer Features](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=Developer+Features)

- **🔌 API Access**: Full REST API for custom integrations
- **📦 GitHub Sync**: Back up collections to GitHub repositories
- **🛠️ CLI Tools**: Command-line access to all features
- **🔧 Webhooks**: Get notified of collection changes

This is just the collection management features! Each collection is a powerful hub for organizing, sharing, and discovering web content.

## ⚙️ Settings & Integrations Hub

### 🎛️ **Complete Settings Dashboard**

<div align="center">

![Settings Dashboard](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Settings+Dashboard)

</div>

#### 📋 **Six Settings Tabs**

| Tab                | Icon | Features                           | Visual                                                                                               |
| ------------------ | ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **👤 Profile**     | 👤   | Username, email, avatar, bio       | ![Profile Settings](https://via.placeholder.com/300x200/10b981/ffffff?text=Profile+Settings)         |
| **📚 Collections** | 📚   | Top collections, pinned favorites  | ![Collections Settings](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Collections+Settings) |
| **⚙️ General**     | ⚙️   | Theme, notifications, preferences  | ![General Settings](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=General+Settings)         |
| **🔑 API Keys**    | 🔑   | Generate, manage, revoke API keys  | ![API Keys](https://via.placeholder.com/300x200/f59e0b/ffffff?text=API+Keys)                         |
| **🌐 Social**      | 🌐   | Social media links, public profile | ![Social Settings](https://via.placeholder.com/300x200/ef4444/ffffff?text=Social+Settings)           |
| **⭐ Favorites**   | ⭐   | Saved collections, quick access    | ![Favorites](https://via.placeholder.com/300x200/dc2626/ffffff?text=Favorites)                       |

### 👤 **Profile Settings**

<div align="center">

**👤 Complete profile customization:**

</div>

![Profile Customization](https://via.placeholder.com/800x300/10b981/ffffff?text=Profile+Customization)

| Feature            | Icon | Description                     | Visual                                                                                   |
| ------------------ | ---- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| **Username**       | 🏷️   | Custom username with validation | ![Username](https://via.placeholder.com/300x200/10b981/ffffff?text=Username)             |
| **Avatar**         | 📷   | Upload and crop profile picture | ![Avatar](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Avatar)                 |
| **Bio**            | 📝   | Rich text description           | ![Bio](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Bio)                       |
| **Email**          | 📧   | Primary email management        | ![Email](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Email)                   |
| **Public Profile** | 🌍   | Showcase your collections       | ![Public Profile](https://via.placeholder.com/300x200/ef4444/ffffff?text=Public+Profile) |

### 📚 **Collections Settings**

<div align="center">

**📚 Manage your top collections:**

</div>

![Collections Management](https://via.placeholder.com/800x300/3b82f6/ffffff?text=Collections+Management)

| Feature             | Icon | Description                         | Visual                                                                                     |
| ------------------- | ---- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| **Top Collections** | ⭐   | Pin up to 5 collections to profile  | ![Top Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Top+Collections) |
| **Drag & Drop**     | 🖱️   | Reorder collections visually        | ![Drag Drop](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Drag+Drop)             |
| **Quick Access**    | ⚡   | Fast access to favorite collections | ![Quick Access](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Quick+Access)       |
| **Public Showcase** | 🌍   | Display on your public profile      | ![Public Showcase](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Public+Showcase) |

### ⚙️ **General Settings**

<div align="center">

**⚙️ App preferences and themes:**

</div>

![General Settings](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=General+Settings)

| Setting           | Icon | Options                   | Visual                                                                                 |
| ----------------- | ---- | ------------------------- | -------------------------------------------------------------------------------------- |
| **Theme**         | 🌙   | Light, Dark, System       | ![Theme](https://via.placeholder.com/300x200/10b981/ffffff?text=Theme)                 |
| **Notifications** | 🔔   | Email, push, in-app       | ![Notifications](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Notifications) |
| **Language**      | 🌍   | Multiple language support | ![Language](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Language)           |
| **Accessibility** | ♿   | High contrast, font size  | ![Accessibility](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Accessibility) |

### 🔑 **API Keys Management**

<div align="center">

**🔑 Developer-friendly API access:**

</div>

![API Keys Management](https://via.placeholder.com/800x300/f59e0b/ffffff?text=API+Keys+Management)

| Feature            | Icon | Description                 | Visual                                                                                   |
| ------------------ | ---- | --------------------------- | ---------------------------------------------------------------------------------------- |
| **Generate Keys**  | ➕   | Create up to 3 API keys     | ![Generate Keys](https://via.placeholder.com/300x200/10b981/ffffff?text=Generate+Keys)   |
| **Key Names**      | 🏷️   | Label keys for organization | ![Key Names](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Key+Names)           |
| **Copy Keys**      | 📋   | One-click key copying       | ![Copy Keys](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Copy+Keys)           |
| **Revoke Keys**    | 🗑️   | Instant key deactivation    | ![Revoke Keys](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Revoke+Keys)       |
| **Usage Tracking** | 📊   | Monitor API usage           | ![Usage Tracking](https://via.placeholder.com/300x200/ef4444/ffffff?text=Usage+Tracking) |

### 🌐 **Social Media Integration**

<div align="center">

**🌐 Connect your social presence:**

</div>

![Social Media Integration](https://via.placeholder.com/800x300/ef4444/ffffff?text=Social+Media+Integration)

| Platform             | Icon | Features                          | Visual                                                                                       |
| -------------------- | ---- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| **Twitter/X**        | 🐦   | Username validation, auto-linking | ![Twitter](https://via.placeholder.com/300x200/10b981/ffffff?text=Twitter)                   |
| **GitHub**           | 🐙   | Profile sync, repository linking  | ![GitHub](https://via.placeholder.com/300x200/3b82f6/ffffff?text=GitHub)                     |
| **LinkedIn**         | 💼   | Professional network integration  | ![LinkedIn](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=LinkedIn)                 |
| **Instagram**        | 📸   | Photo sharing platform            | ![Instagram](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Instagram)               |
| **Personal Website** | 🌐   | Custom website URL                | ![Personal Website](https://via.placeholder.com/300x200/ef4444/ffffff?text=Personal+Website) |

### ⭐ **Favorites System**

<div align="center">

**⭐ Save and organize favorites:**

</div>

![Favorites System](https://via.placeholder.com/800x300/dc2626/ffffff?text=Favorites+System)

| Feature              | Icon | Description                   | Visual                                                                                       |
| -------------------- | ---- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| **Save Collections** | 💾   | Bookmark favorite collections | ![Save Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Save+Collections) |
| **Quick Access**     | ⚡   | Instant access to saved items | ![Quick Access](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Quick+Access)         |
| **Organize**         | 📁   | Categorize favorites          | ![Organize](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Organize)                 |
| **Sync**             | 🔄   | Sync across devices           | ![Sync](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Sync)                         |

## 🔗 **GitHub Integration**

### 🐙 **Complete GitHub Sync**

<div align="center">

![GitHub Integration](https://via.placeholder.com/800x400/24292e/ffffff?text=GitHub+Integration)

</div>

#### 🔐 **OAuth Connection**

| Feature               | Icon | Description                       | Visual                                                                                         |
| --------------------- | ---- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Secure OAuth**      | 🔐   | GitHub OAuth 2.0 authentication   | ![Secure OAuth](https://via.placeholder.com/300x200/10b981/ffffff?text=Secure+OAuth)           |
| **Repository Access** | 📁   | Full repository read/write access | ![Repository Access](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Repository+Access) |
| **Auto-Sync**         | 🔄   | Automatic 24-hour sync            | ![Auto Sync](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Auto+Sync)                 |
| **Two-Way Sync**      | ↔️   | Bidirectional data sync           | ![Two Way Sync](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Two+Way+Sync)           |

#### 📊 **Sync Features**

<div align="center">

**📊 Advanced synchronization:**

</div>

![Sync Features](https://via.placeholder.com/800x300/6366f1/ffffff?text=Sync+Features)

| Feature                 | Icon | Description                  | Visual                                                                                             |
| ----------------------- | ---- | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| **Auto-Sync**           | ⏰   | Every 24 hours automatically | ![Auto Sync](https://via.placeholder.com/300x200/10b981/ffffff?text=Auto+Sync)                     |
| **Manual Sync**         | 🔄   | On-demand synchronization    | ![Manual Sync](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Manual+Sync)                 |
| **Conflict Resolution** | ⚖️   | Smart merge strategies       | ![Conflict Resolution](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Conflict+Resolution) |
| **Backup**              | 💾   | Complete data backup         | ![Backup](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Backup)                           |

#### 📈 **Sync Analytics**

<div align="center">

**📈 Track your sync activity:**

</div>

![Sync Analytics](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=Sync+Analytics)

| Metric             | Icon | Description                | Visual                                                                                   |
| ------------------ | ---- | -------------------------- | ---------------------------------------------------------------------------------------- |
| **Last Sync**      | 📅   | When last synchronized     | ![Last Sync](https://via.placeholder.com/300x200/10b981/ffffff?text=Last+Sync)           |
| **Sync Status**    | ✅   | Success/failure indicators | ![Sync Status](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Sync+Status)       |
| **Repository URL** | 🔗   | Direct link to GitHub repo | ![Repository URL](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Repository+URL) |
| **Sync History**   | 📊   | Complete sync log          | ![Sync History](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Sync+History)     |

#### 🛠️ **Developer Features**

<div align="center">

**🛠️ Built for developers:**

</div>

![Developer Features](https://via.placeholder.com/800x300/f59e0b/ffffff?text=Developer+Features)

| Feature                 | Icon | Description                     | Visual                                                                                             |
| ----------------------- | ---- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Repository Creation** | ➕   | Auto-create GitHub repositories | ![Repository Creation](https://via.placeholder.com/300x200/10b981/ffffff?text=Repository+Creation) |
| **Branch Management**   | 🌿   | Multiple branch support         | ![Branch Management](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Branch+Management)     |
| **Webhook Integration** | 🔗   | Real-time sync triggers         | ![Webhook Integration](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Webhook+Integration) |
| **API Access**          | 🔑   | Full GitHub API integration     | ![API Access](https://via.placeholder.com/300x200/f59e0b/ffffff?text=API+Access)                   |

### 🔄 **Sync Workflow**

<div align="center">

**🔄 How GitHub sync works:**

</div>

![Sync Workflow](https://via.placeholder.com/800x300/ef4444/ffffff?text=Sync+Workflow)

1. **🔐 Connect** → OAuth authentication with GitHub
2. **📁 Create Repo** → Auto-create backup repository
3. **📤 Export Data** → Convert collections to markdown
4. **🔄 Sync** → Push to GitHub repository
5. **📊 Monitor** → Track sync status and history

### 🎯 **Integration Benefits**

<div align="center">

**🎯 Why GitHub integration matters:**

</div>

![Integration Benefits](https://via.placeholder.com/800x300/dc2626/ffffff?text=Integration+Benefits)

| Benefit             | Icon | Description               | Visual                                                                                     |
| ------------------- | ---- | ------------------------- | ------------------------------------------------------------------------------------------ |
| **Backup**          | 💾   | Complete data backup      | ![Backup](https://via.placeholder.com/300x200/10b981/ffffff?text=Backup)                   |
| **Version Control** | 📝   | Track collection changes  | ![Version Control](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Version+Control) |
| **Collaboration**   | 👥   | Share with team members   | ![Collaboration](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Collaboration)     |
| **Portability**     | 📦   | Export to other platforms | ![Portability](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Portability)         |
| **Security**        | 🔒   | Enterprise-grade security | ![Security](https://via.placeholder.com/300x200/ef4444/ffffff?text=Security)               |

### 🚀 **Advanced Features**

<div align="center">

**🚀 Power user features:**

</div>

![Advanced Features](https://via.placeholder.com/800x300/6366f1/ffffff?text=Advanced+Features)

| Feature                | Icon | Description                   | Visual                                                                                           |
| ---------------------- | ---- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| **Rate Limiting**      | ⏱️   | Smart API rate limit handling | ![Rate Limiting](https://via.placeholder.com/300x200/10b981/ffffff?text=Rate+Limiting)           |
| **Error Recovery**     | 🔄   | Automatic retry on failures   | ![Error Recovery](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Error+Recovery)         |
| **Conflict Detection** | ⚠️   | Detect and resolve conflicts  | ![Conflict Detection](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Conflict+Detection) |
| **Selective Sync**     | 🎯   | Choose what to sync           | ![Selective Sync](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Selective+Sync)         |

This settings and integrations hub gives you complete control over your Cur8t experience, from basic preferences to advanced developer integrations.

## 🌐 **Public Collection Experience**

### 📖 **Collection Viewing & Interaction**

<div align="center">

![Public Collection Experience](https://via.placeholder.com/800x400/6366f1/ffffff?text=Public+Collection+Experience)

</div>

#### 🎯 **Collection Discovery & Sharing**

| Feature                 | Icon | Description                           | Visual                                                                                             |
| ----------------------- | ---- | ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Public URLs**         | 🔗   | Shareable collection links            | ![Public URLs](https://via.placeholder.com/300x200/10b981/ffffff?text=Public+URLs)                 |
| **Author Profiles**     | 👤   | Click to view creator's profile       | ![Author Profiles](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Author+Profiles)         |
| **Collection Metadata** | 📊   | Links count, likes, last updated      | ![Collection Metadata](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Collection+Metadata) |
| **Visibility Badges**   | 🏷️   | Public, Private, Protected indicators | ![Visibility Badges](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Visibility+Badges)     |

#### ❤️ **Social Interactions**

<div align="center">

**💝 Engage with collections:**

</div>

![Social Interactions](https://via.placeholder.com/800x300/ef4444/ffffff?text=Social+Interactions)

| Action               | Icon | Description                         | Visual                                                                                       |
| -------------------- | ---- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| **Like Collections** | ❤️   | Show appreciation for great content | ![Like Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Like+Collections) |
| **Save Collections** | 💾   | Bookmark for later reference        | ![Save Collections](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Save+Collections) |
| **Copy Links**       | 📋   | One-click link copying              | ![Copy Links](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Copy+Links)             |
| **Duplicate**        | 📋   | Create your own copy                | ![Duplicate](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Duplicate)               |

#### 🔐 **Authentication & Access Control**

<div align="center">

**🔐 Smart access management:**

</div>

![Access Control](https://via.placeholder.com/800x300/dc2626/ffffff?text=Access+Control)

| Feature             | Icon | Description                              | Visual                                                                                     |
| ------------------- | ---- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Guest Access**    | 👥   | Browse public collections freely         | ![Guest Access](https://via.placeholder.com/300x200/10b981/ffffff?text=Guest+Access)       |
| **Sign-in Prompts** | 🔐   | Seamless authentication dialogs          | ![Sign-in Prompts](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Sign-in+Prompts) |
| **Owner Actions**   | ⚙️   | Special management for collection owners | ![Owner Actions](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Owner+Actions)     |
| **Rate Limiting**   | ⏱️   | Smart API protection                     | ![Rate Limiting](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Rate+Limiting)     |

### 👤 **Public Profile System**

#### 🏠 **Profile Pages**

<div align="center">

**👤 Showcase your collections:**

</div>

![Profile Pages](https://via.placeholder.com/800x300/10b981/ffffff?text=Profile+Pages)

| Feature                | Icon | Description                           | Visual                                                                                           |
| ---------------------- | ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Username URLs**      | 🏷️   | Custom profile URLs                   | ![Username URLs](https://via.placeholder.com/300x200/10b981/ffffff?text=Username+URLs)           |
| **Profile Sidebar**    | 📊   | User stats and information            | ![Profile Sidebar](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Profile+Sidebar)       |
| **Pinned Collections** | 📌   | Highlight your best work              | ![Pinned Collections](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Pinned+Collections) |
| **Collection Sorting** | 📊   | Sort by recent, popular, alphabetical | ![Collection Sorting](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Collection+Sorting) |

#### 📈 **Profile Analytics**

<div align="center">

**📊 Track your impact:**

</div>

![Profile Analytics](https://via.placeholder.com/800x300/3b82f6/ffffff?text=Profile+Analytics)

| Metric                | Icon | Description                        | Visual                                                                                         |
| --------------------- | ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Total Collections** | 📚   | Number of collections created      | ![Total Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Total+Collections) |
| **Total Links**       | 🔗   | All links across collections       | ![Total Links](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Total+Links)             |
| **Profile Views**     | 👀   | How many people visit your profile | ![Profile Views](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Profile+Views)         |
| **Collection Likes**  | ❤️   | Total likes on your collections    | ![Collection Likes](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Collection+Likes)   |

### 🔍 **Explore & Discovery**

#### 🌟 **Explore Page Features**

<div align="center">

**🔍 Discover amazing content:**

</div>

![Explore Features](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=Explore+Features)

| Feature                  | Icon | Description                        | Visual                                                                                               |
| ------------------------ | ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Trending Collections** | 🔥   | Most popular collections right now | ![Trending Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Trending+Collections) |
| **Recent Collections**   | ⏰   | Latest additions to the platform   | ![Recent Collections](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Recent+Collections)     |
| **Saved Collections**    | 💾   | Your bookmarked collections        | ![Saved Collections](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Saved+Collections)       |
| **User Stats**           | 📊   | Your personal statistics           | ![User Stats](https://via.placeholder.com/300x200/f59e0b/ffffff?text=User+Stats)                     |

#### 📅 **Events Timeline**

<div align="center">

**📅 Track platform activity:**

</div>

![Events Timeline](https://via.placeholder.com/800x300/ef4444/ffffff?text=Events+Timeline)

| Feature             | Icon | Description                       | Visual                                                                                     |
| ------------------- | ---- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| **New Collections** | 🆕   | Real-time collection updates      | ![New Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=New+Collections) |
| **Activity Feed**   | 📰   | Chronological activity timeline   | ![Activity Feed](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Activity+Feed)     |
| **Tab Navigation**  | 🔄   | Switch between Explore and Events | ![Tab Navigation](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Tab+Navigation)   |
| **Loading States**  | ⏳   | Smooth loading with skeletons     | ![Loading States](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Loading+States)   |

### 🚀 **Onboarding Experience**

#### 👋 **Welcome Flow**

<div align="center">

**🎯 Get started in minutes:**

</div>

![Onboarding Experience](https://via.placeholder.com/800x300/dc2626/ffffff?text=Onboarding+Experience)

| Feature               | Icon | Description                           | Visual                                                                                         |
| --------------------- | ---- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Username Creation** | 🏷️   | Choose your unique username           | ![Username Creation](https://via.placeholder.com/300x200/10b981/ffffff?text=Username+Creation) |
| **Random Generator**  | 🎲   | AI-generated username suggestions     | ![Random Generator](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Random+Generator)   |
| **Validation**        | ✅   | Real-time username availability check | ![Validation](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Validation)               |
| **Rate Limiting**     | ⏱️   | Protection against spam               | ![Rate Limiting](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Rate+Limiting)         |

#### 🎨 **User Experience**

<div align="center">

**✨ Smooth and intuitive:**

</div>

![User Experience](https://via.placeholder.com/800x300/6366f1/ffffff?text=User+Experience)

| Feature               | Icon | Description                    | Visual                                                                                         |
| --------------------- | ---- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Error Handling**    | ⚠️   | Clear error messages           | ![Error Handling](https://via.placeholder.com/300x200/10b981/ffffff?text=Error+Handling)       |
| **Loading States**    | ⏳   | Visual feedback during actions | ![Loading States](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Loading+States)       |
| **Form Validation**   | ✅   | Real-time input validation     | ![Form Validation](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Form+Validation)     |
| **Responsive Design** | 📱   | Works on all devices           | ![Responsive Design](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Responsive+Design) |

### ⭐ **Favorites Management**

#### 💾 **Personal Favorites System**

<div align="center">

**⭐ Your personal bookmark hub:**

</div>

![Favorites Management](https://via.placeholder.com/800x300/10b981/ffffff?text=Favorites+Management)

| Feature              | Icon | Description                       | Visual                                                                                       |
| -------------------- | ---- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| **Add Favorites**    | ➕   | Save any collection to favorites  | ![Add Favorites](https://via.placeholder.com/300x200/10b981/ffffff?text=Add+Favorites)       |
| **Edit Favorites**   | ✏️   | Modify title and URL of favorites | ![Edit Favorites](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Edit+Favorites)     |
| **Delete Favorites** | 🗑️   | Remove items from favorites       | ![Delete Favorites](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Delete+Favorites) |
| **Favorites Limit**  | 📊   | Manage up to 50 favorites         | ![Favorites Limit](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Favorites+Limit)   |

#### 🎯 **Advanced Favorites Features**

<div align="center">

**🎯 Powerful organization:**

</div>

![Advanced Favorites](https://via.placeholder.com/800x300/3b82f6/ffffff?text=Advanced+Favorites)

| Feature             | Icon | Description                       | Visual                                                                                     |
| ------------------- | ---- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| **URL Validation**  | 🔗   | Automatic URL format checking     | ![URL Validation](https://via.placeholder.com/300x200/10b981/ffffff?text=URL+Validation)   |
| **Title Limits**    | 📝   | Smart character limits for titles | ![Title Limits](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Title+Limits)       |
| **Date Formatting** | 📅   | Human-readable date display       | ![Date Formatting](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Date+Formatting) |
| **Empty States**    | 📭   | Helpful empty state messages      | ![Empty States](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Empty+States)       |

### 🛡️ **Security & Performance**

#### 🔒 **Advanced Security Features**

<div align="center">

**🛡️ Enterprise-grade protection:**

</div>

![Security Features](https://via.placeholder.com/800x300/ef4444/ffffff?text=Security+Features)

| Feature                 | Icon | Description                     | Visual                                                                                             |
| ----------------------- | ---- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Rate Limiting**       | ⏱️   | Smart API rate limit protection | ![Rate Limiting](https://via.placeholder.com/300x200/10b981/ffffff?text=Rate+Limiting)             |
| **Error Recovery**      | 🔄   | Automatic retry on failures     | ![Error Recovery](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Error+Recovery)           |
| **Loading Skeletons**   | ⏳   | Smooth loading states           | ![Loading Skeletons](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Loading+Skeletons)     |
| **Toast Notifications** | 🔔   | User-friendly feedback messages | ![Toast Notifications](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Toast+Notifications) |

#### ⚡ **Performance Optimizations**

<div align="center">

**⚡ Lightning-fast experience:**

</div>

![Performance Optimizations](https://via.placeholder.com/800x300/dc2626/ffffff?text=Performance+Optimizations)

| Feature                | Icon | Description                 | Visual                                                                                           |
| ---------------------- | ---- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| **Optimistic Updates** | ⚡   | Instant UI feedback         | ![Optimistic Updates](https://via.placeholder.com/300x200/10b981/ffffff?text=Optimistic+Updates) |
| **Skeleton Loading**   | 💀   | Smooth loading animations   | ![Skeleton Loading](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Skeleton+Loading)     |
| **Error Boundaries**   | 🛡️   | Graceful error handling     | ![Error Boundaries](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Error+Boundaries)     |
| **Responsive Design**  | 📱   | Perfect on all screen sizes | ![Responsive Design](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Responsive+Design)   |

This comprehensive public experience makes Cur8t a vibrant community where users can discover, share, and interact with amazing collections while maintaining full control over their privacy and content.

## 🤖 **AI Agents & Smart Tools**

### 🧠 **Intelligent Automation Hub**

<div align="center">

![AI Agents Hub](https://via.placeholder.com/800x400/6366f1/ffffff?text=AI+Agents+Hub)

</div>

#### 🔥 **Active AI Agents**

<div align="center">

**⚡ Currently available and ready to use:**

</div>

![Active Agents](https://via.placeholder.com/800x300/10b981/ffffff?text=Active+Agents)

| Agent                      | Icon | Description                        | Visual                                                                                         |
| -------------------------- | ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Article Link Extractor** | 📄   | Extract all links from any article | ![Article Extractor](https://via.placeholder.com/300x200/10b981/ffffff?text=Article+Extractor) |
| **Bookmark File Importer** | 📤   | Import bookmarks from browsers     | ![Bookmark Importer](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Bookmark+Importer) |

#### 🎯 **Article Link Extractor**

<div align="center">

**📄 Smart content analysis:**

</div>

![Article Extractor Features](https://via.placeholder.com/800x300/3b82f6/ffffff?text=Article+Extractor+Features)

| Feature              | Icon | Description                              | Visual                                                                                       |
| -------------------- | ---- | ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Smart Detection**  | 🔍   | Automatically find all links in articles | ![Smart Detection](https://via.placeholder.com/300x200/10b981/ffffff?text=Smart+Detection)   |
| **Auto Collections** | 📁   | Create organized collections instantly   | ![Auto Collections](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Auto+Collections) |
| **Content Analysis** | 📊   | Analyze article content and structure    | ![Content Analysis](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Content+Analysis) |

#### 📤 **Bookmark File Importer**

<div align="center">

**📤 Import from any browser:**

</div>

![Bookmark Importer Features](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=Bookmark+Importer+Features)

| Feature               | Icon | Description                         | Visual                                                                                         |
| --------------------- | ---- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Multiple Browsers** | 🌐   | Support for Chrome, Firefox, Safari | ![Multiple Browsers](https://via.placeholder.com/300x200/10b981/ffffff?text=Multiple+Browsers) |
| **AI Categorization** | 🤖   | Smart sorting into collections      | ![AI Categorization](https://via.placeholder.com/300x200/3b82f6/ffffff?text=AI+Categorization) |
| **Smart Sorting**     | 📊   | Intelligent organization algorithms | ![Smart Sorting](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Smart+Sorting)         |

### 🚀 **Coming Soon Agents**

<div align="center">

**🔮 Future AI capabilities:**

</div>

![Coming Soon Agents](https://via.placeholder.com/800x300/f59e0b/ffffff?text=Coming+Soon+Agents)

#### 📥 **Smart Export Guide**

| Feature               | Icon | Description                  | Visual                                                                                         |
| --------------------- | ---- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| **Custom Formatting** | 🎨   | Personalized export styles   | ![Custom Formatting](https://via.placeholder.com/300x200/10b981/ffffff?text=Custom+Formatting) |
| **Templates**         | 📋   | Pre-built export templates   | ![Templates](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Templates)                 |
| **Multiple Formats**  | 📄   | Export to various file types | ![Multiple Formats](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Multiple+Formats)   |

#### ✨ **Collection Generator**

| Feature                 | Icon | Description                      | Visual                                                                                             |
| ----------------------- | ---- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Topic-based**         | 🏷️   | Generate collections by topic    | ![Topic-based](https://via.placeholder.com/300x200/10b981/ffffff?text=Topic-based)                 |
| **Interest Matching**   | 🎯   | Match your personal interests    | ![Interest Matching](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Interest+Matching)     |
| **Auto Categorization** | 🤖   | Automatic content categorization | ![Auto Categorization](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Auto+Categorization) |

#### 🎥 **YouTube Link Extractor**

| Feature                 | Icon | Description                           | Visual                                                                                             |
| ----------------------- | ---- | ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Description Parsing** | 📝   | Extract links from video descriptions | ![Description Parsing](https://via.placeholder.com/300x200/10b981/ffffff?text=Description+Parsing) |
| **Comment Scanning**    | 💬   | Find links in video comments          | ![Comment Scanning](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Comment+Scanning)       |
| **Timestamps**          | ⏰   | Link to specific video timestamps     | ![Timestamps](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Timestamps)                   |

#### ▶️ **Watch Later Organizer**

| Feature              | Icon | Description                         | Visual                                                                                       |
| -------------------- | ---- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| **Topic Detection**  | 🎯   | Identify video topics automatically | ![Topic Detection](https://via.placeholder.com/300x200/10b981/ffffff?text=Topic+Detection)   |
| **Auto Sorting**     | 📊   | Sort videos into collections        | ![Auto Sorting](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Auto+Sorting)         |
| **Custom Playlists** | 📋   | Create personalized playlists       | ![Custom Playlists](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Custom+Playlists) |

### 🎨 **Agent Interface**

<div align="center">

**🎨 Beautiful and intuitive:**

</div>

![Agent Interface](https://via.placeholder.com/800x300/ef4444/ffffff?text=Agent+Interface)

| Feature               | Icon | Description                      | Visual                                                                                         |
| --------------------- | ---- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Status Badges**     | 🏷️   | Active vs Coming Soon indicators | ![Status Badges](https://via.placeholder.com/300x200/10b981/ffffff?text=Status+Badges)         |
| **Feature Lists**     | 📋   | Detailed feature breakdowns      | ![Feature Lists](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Feature+Lists)         |
| **Try Agent Buttons** | ▶️   | One-click agent activation       | ![Try Agent Buttons](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Try+Agent+Buttons) |
| **Coming Soon**       | 🔮   | Preview of future capabilities   | ![Coming Soon](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Coming+Soon)             |

### 🔧 **Agent Capabilities**

<div align="center">

**🔧 Powerful automation features:**

</div>

![Agent Capabilities](https://via.placeholder.com/800x300/dc2626/ffffff?text=Agent+Capabilities)

| Capability             | Icon | Description                       | Visual                                                                                           |
| ---------------------- | ---- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Dialog Integration** | 💬   | Seamless agent dialogs            | ![Dialog Integration](https://via.placeholder.com/300x200/10b981/ffffff?text=Dialog+Integration) |
| **API Status**         | 📊   | Real-time agent status monitoring | ![API Status](https://via.placeholder.com/300x200/3b82f6/ffffff?text=API+Status)                 |
| **Error Handling**     | ⚠️   | Graceful error recovery           | ![Error Handling](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Error+Handling)         |
| **Loading States**     | ⏳   | Smooth agent execution feedback   | ![Loading States](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Loading+States)         |

### 🎯 **Agent Benefits**

<div align="center">

**🎯 Why AI agents matter:**

</div>

![Agent Benefits](https://via.placeholder.com/800x300/6366f1/ffffff?text=Agent+Benefits)

| Benefit                 | Icon | Description                      | Visual                                                                                             |
| ----------------------- | ---- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Time Saving**         | ⏰   | Automate tedious tasks           | ![Time Saving](https://via.placeholder.com/300x200/10b981/ffffff?text=Time+Saving)                 |
| **Smart Organization**  | 🧠   | AI-powered categorization        | ![Smart Organization](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Smart+Organization)   |
| **Content Discovery**   | 🔍   | Find hidden gems automatically   | ![Content Discovery](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Content+Discovery)     |
| **Workflow Automation** | ⚡   | Streamline your bookmark process | ![Workflow Automation](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Workflow+Automation) |

This AI agents and tools system transforms Cur8t from a simple bookmark manager into an intelligent content organization platform that learns and adapts to your needs.

## 🔌 **Browser Extension**

### 🎯 **Smart Bookmark Collections Extension**

<div align="center">

![Browser Extension](https://via.placeholder.com/800x400/6366f1/ffffff?text=Browser+Extension)

</div>

#### 🧠 **AI-Powered Organization**

<div align="center">

**🤖 Intelligent bookmark management:**

</div>

![AI Organization](https://via.placeholder.com/800x300/10b981/ffffff?text=AI+Organization)

| Feature                  | Icon | Description                        | Visual                                                                                               |
| ------------------------ | ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Smart Categorization** | 🧠   | Automatically organize bookmarks   | ![Smart Categorization](https://via.placeholder.com/300x200/10b981/ffffff?text=Smart+Categorization) |
| **Intelligent Grouping** | 🤖   | AI analyzes content for categories | ![Intelligent Grouping](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Intelligent+Grouping) |
| **Bulk Organization**    | 📦   | Process entire bookmark libraries  | ![Bulk Organization](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Bulk+Organization)       |

#### 📚 **Collection Management**

<div align="center">

**📚 Organize with ease:**

</div>

![Collection Management](https://via.placeholder.com/800x300/3b82f6/ffffff?text=Collection+Management)

| Feature                | Icon | Description                         | Visual                                                                                           |
| ---------------------- | ---- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Create Collections** | 📁   | Organize bookmarks into collections | ![Create Collections](https://via.placeholder.com/300x200/10b981/ffffff?text=Create+Collections) |
| **Visibility Control** | 👁️   | Public/private collection settings  | ![Visibility Control](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Visibility+Control) |
| **Search & Filter**    | 🔍   | Find collections and bookmarks      | ![Search Filter](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Search+Filter)           |
| **Real-time Sync**     | 🔄   | Optimistic UI updates with sync     | ![Real-time Sync](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Real-time+Sync)         |

#### ⭐ **Favorites System**

<div align="center">

**⭐ Quick access to important links:**

</div>

![Favorites System](https://via.placeholder.com/800x300/8b5cf6/ffffff?text=Favorites+System)

| Feature            | Icon | Description                       | Visual                                                                                   |
| ------------------ | ---- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| **Quick Access**   | ⚡   | Save important links to favorites | ![Quick Access](https://via.placeholder.com/300x200/10b981/ffffff?text=Quick+Access)     |
| **Smart Search**   | 🔍   | Find favorites by title or URL    | ![Smart Search](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Smart+Search)     |
| **One-click Save** | 💾   | Add current page to favorites     | ![One-click Save](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=One-click+Save) |

#### 📊 **Bookmark Analytics**

<div align="center">

**📊 Track your bookmark usage:**

</div>

![Bookmark Analytics](https://via.placeholder.com/800x300/f59e0b/ffffff?text=Bookmark+Analytics)

| Feature                  | Icon | Description                     | Visual                                                                                               |
| ------------------------ | ---- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Export Options**       | 📤   | HTML, JSON, TXT formats         | ![Export Options](https://via.placeholder.com/300x200/10b981/ffffff?text=Export+Options)             |
| **Statistics Dashboard** | 📊   | Total bookmarks, folders, stats | ![Statistics Dashboard](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Statistics+Dashboard) |
| **Browser Integration**  | 🌐   | Native bookmark API integration | ![Browser Integration](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Browser+Integration)   |

### 🛠 **Extension Tech Stack**

<div align="center">

**🛠 Modern development stack:**

</div>

![Extension Tech Stack](https://via.placeholder.com/800x300/ef4444/ffffff?text=Extension+Tech+Stack)

#### 🎨 **Frontend Technologies**

| Technology         | Icon | Description                           | Visual                                                                                   |
| ------------------ | ---- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| **React 19**       | ⚛️   | Latest React with concurrent features | ![React 19](https://via.placeholder.com/300x200/10b981/ffffff?text=React+19)             |
| **TypeScript**     | 🔷   | Type-safe development                 | ![TypeScript](https://via.placeholder.com/300x200/3b82f6/ffffff?text=TypeScript)         |
| **Tailwind CSS 4** | 🎨   | Modern utility-first styling          | ![Tailwind CSS 4](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Tailwind+CSS+4) |
| **shadcn/ui**      | 🧩   | Beautiful, accessible components      | ![shadcn/ui](https://via.placeholder.com/300x200/f59e0b/ffffff?text=shadcn+ui)           |

#### 🔧 **Browser Extension**

| Technology                | Icon | Description                      | Visual                                                                                                 |
| ------------------------- | ---- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Manifest V3**           | 📋   | Latest extension standard        | ![Manifest V3](https://via.placeholder.com/300x200/10b981/ffffff?text=Manifest+V3)                     |
| **Chrome APIs**           | 🌐   | Native bookmark & tab management | ![Chrome APIs](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Chrome+APIs)                     |
| **WebExtension Polyfill** | 🔌   | Cross-browser compatibility      | ![WebExtension Polyfill](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=WebExtension+Polyfill) |

#### 🛠 **Development Tools**

| Tool        | Icon | Description                     | Visual                                                                     |
| ----------- | ---- | ------------------------------- | -------------------------------------------------------------------------- |
| **Vite**    | ⚡   | Fast build tool with hot reload | ![Vite](https://via.placeholder.com/300x200/10b981/ffffff?text=Vite)       |
| **CRXJS**   | 📦   | Chrome extension development    | ![CRXJS](https://via.placeholder.com/300x200/3b82f6/ffffff?text=CRXJS)     |
| **ESLint**  | 🔍   | Code quality & consistency      | ![ESLint](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=ESLint)   |
| **Nodemon** | 🔄   | Auto-restart development server | ![Nodemon](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Nodemon) |

### 🎨 **UI/UX Design**

<div align="center">

**🎨 Beautiful and intuitive interface:**

</div>

![UI/UX Design](https://via.placeholder.com/800x300/dc2626/ffffff?text=UI+UX+Design)

#### 🎨 **Design System**

| Feature              | Icon | Description                     | Visual                                                                                       |
| -------------------- | ---- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| **Modern Aesthetic** | ✨   | Clean, minimalist interface     | ![Modern Aesthetic](https://via.placeholder.com/300x200/10b981/ffffff?text=Modern+Aesthetic) |
| **Dark/Light Mode**  | 🌙   | Automatic theme switching       | ![Dark Light Mode](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Dark+Light+Mode)   |
| **Responsive**       | 📱   | Adapts to different popup sizes | ![Responsive](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Responsive)             |
| **Accessible**       | ♿   | WCAG compliant components       | ![Accessible](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Accessible)             |

#### 🎯 **User Experience**

| Feature                 | Icon | Description               | Visual                                                                                             |
| ----------------------- | ---- | ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Optimistic Updates**  | ⚡   | Instant UI feedback       | ![Optimistic Updates](https://via.placeholder.com/300x200/10b981/ffffff?text=Optimistic+Updates)   |
| **Loading States**      | ⏳   | Smooth loading animations | ![Loading States](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Loading+States)           |
| **Error Handling**      | ⚠️   | Graceful error recovery   | ![Error Handling](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Error+Handling)           |
| **Keyboard Navigation** | ⌨️   | Full keyboard support     | ![Keyboard Navigation](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Keyboard+Navigation) |

### 🏗 **Extension Architecture**

<div align="center">

**🏗 Well-organized codebase:**

</div>

![Extension Architecture](https://via.placeholder.com/800x300/6366f1/ffffff?text=Extension+Architecture)

#### 📁 **Core Modules**

| Module               | Icon | Description              | Visual                                                                                       |
| -------------------- | ---- | ------------------------ | -------------------------------------------------------------------------------------------- |
| **API Client**       | 🔌   | API client & data models | ![API Client](https://via.placeholder.com/300x200/10b981/ffffff?text=API+Client)             |
| **Authentication**   | 🔐   | Authentication service   | ![Authentication](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Authentication)     |
| **Cache System**     | 💾   | Offline caching system   | ![Cache System](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Cache+System)         |
| **Bookmark Manager** | 📚   | Browser bookmark manager | ![Bookmark Manager](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Bookmark+Manager) |

#### 🔄 **Data Flow**

<div align="center">

**🔄 Efficient data management:**

</div>

![Data Flow](https://via.placeholder.com/800x300/ef4444/ffffff?text=Data+Flow)

| Flow                  | Icon | Description             | Visual                                                                                         |
| --------------------- | ---- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| **User Action**       | 👆   | User triggers action    | ![User Action](https://via.placeholder.com/300x200/10b981/ffffff?text=User+Action)             |
| **API Call**          | 📡   | Make API request        | ![API Call](https://via.placeholder.com/300x200/3b82f6/ffffff?text=API+Call)                   |
| **Optimistic Update** | ⚡   | Immediate UI feedback   | ![Optimistic Update](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Optimistic+Update) |
| **Background Sync**   | 🔄   | Sync data in background | ![Background Sync](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Background+Sync)     |

### 📱 **Extension Features Deep Dive**

<div align="center">

**📱 Comprehensive feature set:**

</div>

![Extension Features](https://via.placeholder.com/800x300/dc2626/ffffff?text=Extension+Features)

#### 📚 **Collections Tab**

| Feature              | Icon | Description                             | Visual                                                                                       |
| -------------------- | ---- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Smart Search**     | 🔍   | Filter collections by title/description | ![Smart Search](https://via.placeholder.com/300x200/10b981/ffffff?text=Smart+Search)         |
| **Visibility Icons** | 👁️   | Public/private collection indicators    | ![Visibility Icons](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Visibility+Icons) |
| **Quick Save**       | 💾   | One-click bookmark addition             | ![Quick Save](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Quick+Save)             |
| **Collection Stats** | 📊   | Link counts and creation dates          | ![Collection Stats](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Collection+Stats) |

#### ⭐ **Favorites Tab**

| Feature            | Icon | Description                    | Visual                                                                                   |
| ------------------ | ---- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| **Instant Add**    | ➕   | Save current page to favorites | ![Instant Add](https://via.placeholder.com/300x200/10b981/ffffff?text=Instant+Add)       |
| **Copy URLs**      | 📋   | One-click URL copying          | ![Copy URLs](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Copy+URLs)           |
| **External Links** | 🔗   | Open favorites in new tabs     | ![External Links](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=External+Links) |
| **Search**         | 🔍   | Find favorites by title or URL | ![Search](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Search)                 |

#### 📚 **Bookmarks Tab**

| Feature             | Icon | Description                       | Visual                                                                                     |
| ------------------- | ---- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| **AI Organization** | 🤖   | Automatic bookmark categorization | ![AI Organization](https://via.placeholder.com/300x200/10b981/ffffff?text=AI+Organization) |
| **Export Options**  | 📤   | Multiple export formats           | ![Export Options](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Export+Options)   |
| **Statistics**      | 📊   | Detailed bookmark analytics       | ![Statistics](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Statistics)           |
| **Bulk Operations** | 📦   | Process entire bookmark libraries | ![Bulk Operations](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Bulk+Operations) |

### 🔧 **Extension Configuration**

<div align="center">

**🔧 Powerful configuration options:**

</div>

![Extension Configuration](https://via.placeholder.com/800x300/6366f1/ffffff?text=Extension+Configuration)

#### 🔌 **API Integration**

| Feature            | Icon | Description                             | Visual                                                                                   |
| ------------------ | ---- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Base URL**       | 🌐   | `http://localhost:8001/api/v1`          | ![Base URL](https://via.placeholder.com/300x200/10b981/ffffff?text=Base+URL)             |
| **Authentication** | 🔐   | API key-based auth                      | ![Authentication](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Authentication) |
| **Health Checks**  | 💚   | Automatic API monitoring                | ![Health Checks](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Health+Checks)   |
| **Retry Logic**    | 🔄   | Exponential backoff for failed requests | ![Retry Logic](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Retry+Logic)       |

#### 🔒 **Permissions**

<div align="center">

**🔒 Secure and minimal permissions:**

</div>

![Permissions](https://via.placeholder.com/800x300/ef4444/ffffff?text=Permissions)

| Permission     | Icon | Description                    | Visual                                                                           |
| -------------- | ---- | ------------------------------ | -------------------------------------------------------------------------------- |
| **Active Tab** | 📄   | Access current tab information | ![Active Tab](https://via.placeholder.com/300x200/10b981/ffffff?text=Active+Tab) |
| **Tabs**       | 📑   | Manage browser tabs            | ![Tabs](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Tabs)             |
| **Storage**    | 💾   | Local data storage             | ![Storage](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Storage)       |
| **Bookmarks**  | 📚   | Access browser bookmarks       | ![Bookmarks](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Bookmarks)   |

### 🎯 **Extension Benefits**

<div align="center">

**🎯 Why the extension matters:**

</div>

![Extension Benefits](https://via.placeholder.com/800x300/dc2626/ffffff?text=Extension+Benefits)

| Benefit               | Icon | Description                             | Visual                                                                                   |
| --------------------- | ---- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| **🚀 Performance**    | ⚡   | Optimized with React 19 and Vite        | ![Performance](https://via.placeholder.com/300x200/10b981/ffffff?text=Performance)       |
| **🎨 Modern UI**      | 🎨   | Beautiful shadcn/ui components          | ![Modern UI](https://via.placeholder.com/300x200/3b82f6/ffffff?text=Modern+UI)           |
| **🔒 Type Safety**    | 🔷   | Full TypeScript coverage                | ![Type Safety](https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Type+Safety)       |
| **📱 Cross-platform** | 🌐   | Chrome & Firefox support                | ![Cross-platform](https://via.placeholder.com/300x200/f59e0b/ffffff?text=Cross-platform) |
| **⚡ Offline Ready**  | 📴   | Cached data for offline use             | ![Offline Ready](https://via.placeholder.com/300x200/ef4444/ffffff?text=Offline+Ready)   |
| **🔄 Real-time**      | 🔄   | Optimistic updates with background sync | ![Real-time](https://via.placeholder.com/300x200/dc2626/ffffff?text=Real-time)           |

This browser extension transforms your browsing experience by seamlessly integrating AI-powered bookmark organization directly into your browser, making content curation effortless and intelligent.

## Database Schema

<div align="center">

![Database Schema](schema.svg)

</div>

## How It Works

### The Stack

#### 🎨 **Web App (cur8t-web)**

**Core Framework**

- Next.js 15.0.4 - React framework with App Router
- React 19.0.0 - UI library
- TypeScript 5 - Type-safe JavaScript

**API & State Management**

- TanStack Query 5.83.0 - Server state management
- Zustand 5.0.2 - Atomic state management
- React Hook Form 7.54.0 - Form handling
- Zod 3.23.8 - Schema validation
- Axios 1.7.9 - HTTP client

**UI & Styling**

- Tailwind CSS 3.4.1 - Utility-first CSS framework
- Radix UI - Headless UI components (accordion, alert-dialog, avatar, checkbox, collapsible, dialog, dropdown-menu, label, navigation-menu, popover, portal, progress, select, separator, slot, switch, tabs, toast, toggle, toggle-group, tooltip)
- Lucide React 0.468.0 - Icon library
- Framer Motion 11.15.0 - Animation library
- Next Themes 0.4.4 - Theme management
- Motion 12.23.6 - Animation utilities
- React Wrap Balancer 1.1.1 - Text wrapping

**Database & Authentication**

- Drizzle ORM 0.37.0 - Type-safe database ORM
- Neon Database 0.10.4 - Serverless PostgreSQL
- Clerk 6.8.0 - Modern authentication library
- OAuth providers - Social login integration

**External Integrations**

- Octokit 4.1.0 - GitHub API integration
- Upstash Redis 1.35.1 - Caching and rate limiting
- Upstash Rate Limit 2.0.6 - API rate limiting
- Number Flow React 0.5.10 - Number animations

**Development Tools**

- pnpm - Package manager
- ESLint 8.57.1 - Code linting
- Prettier 3.6.2 - Code formatting
- Husky 9.1.7 - Git hooks
- TypeScript 5 - Type checking
- Lint Staged 16.1.4 - Pre-commit linting

**Utilities**

- UUID 11.0.3 - Unique identifier generation
- Class Variance Authority 0.7.1 - Component variants
- CLSX 2.1.1 - Conditional classes
- Tailwind Merge 2.6.0 - Class merging
- CMDK 1.1.1 - Command palette
- Sharp 0.34.1 - Image optimization

#### 🤖 **AI Agents API (agents-api)**

**Core Framework**

- FastAPI 0.104.1 - Modern Python web framework
- Python 3.8+ - Programming language
- Pydantic 2.5.0 - Data validation and settings
- Pydantic Settings 2.1.0 - Settings management

**AI & Machine Learning**

- OpenAI 1.12.0 - GPT-4 integration
- OpenAI API - AI service integration
- httpx 0.27.0 - Async HTTP client

**Data Processing**

- BeautifulSoup 4.12.2 - HTML parsing and extraction
- lxml 4.9.3 - XML/HTML processing
- requests 2.31.0 - HTTP library for external APIs
- aiofiles 23.2.0 - Async file operations

**Web Server**

- Uvicorn 0.24.0 - ASGI server
- Python Multipart 0.0.6 - File upload handling

**Development Tools**

- pytest 7.4.3 - Testing framework
- Python Dotenv 1.0.0 - Environment management

#### 🔌 **Extension API (extension-api)**

**Core Framework**

- FastAPI 0.104.1 - Modern Python web framework
- Python 3.8+ - Programming language
- Pydantic 2.5.0 - Data validation

**Database & ORM**

- asyncpg 0.29.0 - Async PostgreSQL driver
- PostgreSQL - Primary database

**HTTP & Networking**

- httpx 0.25.2 - Async HTTP client
- httptools 0.6.1 - HTTP utilities

**Web Server**

- Uvicorn 0.24.0 - ASGI server

**Development Tools**

- Python Dotenv 1.0.0 - Environment management

#### 🗄️ **Database & Infrastructure**

**Primary Database**

- PostgreSQL - Relational database
- Neon Database 0.10.4 - Serverless PostgreSQL hosting
- Drizzle ORM 0.37.0 - TypeScript database toolkit
- asyncpg 0.29.0 - Python async PostgreSQL driver

**Caching & Sessions**

- Redis (Upstash) 1.35.1 - In-memory data store
- Session management - User session handling
- Rate limiting - API request throttling

**Migrations & Schema**

- Drizzle Kit 0.29.1 - Database migrations
- Schema management - Database structure

**Backup & Monitoring**

- Automated backups - Database protection
- Health checks - Service monitoring
- Performance metrics - System analytics

#### 🔐 **Security & Authentication**

**User Authentication**

- Clerk 6.8.0 - Complete auth solution
- OAuth providers - Social login integration
- Session management - User session handling
- JWT tokens - Secure authentication

**API Security**

- Rate limiting - Request throttling
- Upstash Redis 1.35.1 - Rate limit storage
- Upstash Rate Limit 2.0.6 - Rate limiting service
- CORS policies - Cross-origin security
- Input validation - Data sanitization

**Data Protection**

- Encrypted storage - Data encryption
- Secure endpoints - API protection
- Access control - Permission management
- GDPR compliance - Privacy protection

**OAuth Integrations**

- GitHub OAuth - Repository access
- Octokit 4.1.0 - GitHub API integration
- Social media APIs - Platform integration
- Custom OAuth flows - Specialized authentication

#### 🚀 **Development Tools**

**Package Management**

- pnpm - Fast, disk space efficient package manager
- pip - Python package installer

**Code Quality**

- ESLint 8.57.1 - JavaScript linting
- Prettier 3.6.2 - Code formatting
- TypeScript 5 - Type checking
- ESLint Config Next 15.0.4 - Next.js linting
- ESLint Config Prettier 10.1.8 - Prettier integration

**Testing**

- Jest - JavaScript testing framework
- React Testing Library - Component testing
- pytest 7.4.3 - Python testing framework
- Coverage reporting - Test coverage

**Git Workflow**

- Husky 9.1.7 - Git hooks
- lint-staged 16.1.4 - Pre-commit linting
- Conventional commits - Commit message standards

**CI/CD**

- GitHub Actions - Automated workflows
- Docker - Containerization
- Docker Compose - Multi-service development

#### 📦 **External Integrations**

**AI Services**

- OpenAI API 1.12.0 - GPT-4 integration
- GPT-4 Turbo - Advanced language model
- Custom AI agents - Specialized AI features

**Version Control**

- GitHub API - Repository management
- Octokit 4.1.0 - GitHub API client
- GitHub OAuth - Account integration
- Repository sync - Two-way synchronization

**Social Platforms**

- Twitter API - Social media integration
- LinkedIn API - Professional networking
- Instagram API - Photo sharing platform
- Custom social auth - Platform-specific authentication

**Communication**

- Resend - Transactional email service
- Email templates - Automated messaging
- Notification system - User alerts

**Analytics & Monitoring**

- Custom analytics - Usage tracking
- Performance monitoring - System health
- Error tracking - Bug reporting
- User behavior - Usage analytics

### The Architecture

```
cur8t/
├── cur8t-web/          # 🎨 Main web app (Next.js)
├── agents-api/          # 🤖 AI agents (FastAPI)
├── extension-api/       # 🔌 Browser extension backend
├── bot/                 # 🤖 Discord/Telegram bot
├── cli/                 # 💻 Command line tools
└── flutter/            # 📱 Mobile app (coming)
```

### Project Structure

#### 🎨 **cur8t-web** (Next.js Frontend)

```
cur8t-web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── github/        # GitHub OAuth endpoints
│   │   │   ├── profile/       # User profile API
│   │   │   ├── settings/      # Settings API
│   │   │   ├── user/          # User management API
│   │   │   └── webhooks/      # Webhook handlers
│   │   ├── collection/        # Collection pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── explore/           # Explore/discovery pages
│   │   ├── onboarding/        # User onboarding
│   │   ├── profile/           # User profile pages
│   │   ├── sign-in/           # Authentication pages
│   │   ├── sign-up/           # Registration pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── collection/        # Collection components
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── ContentArea/   # Main content area
│   │   │   ├── NavActions/    # Navigation actions
│   │   │   ├── Overview/      # Dashboard overview
│   │   │   ├── Sidebar/       # App sidebar
│   │   │   └── TopSection/    # Top section components
│   │   ├── explore/           # Explore page components
│   │   ├── help/              # Help components
│   │   ├── homepage/          # Landing page components
│   │   ├── icons/             # Icon components
│   │   ├── integrations/      # Integration components
│   │   ├── landingPage/       # Landing page components
│   │   ├── layout/            # Layout components
│   │   ├── profile/           # Profile components
│   │   ├── providers/         # Context providers
│   │   ├── secondary/         # Secondary pages
│   │   ├── settings/          # Settings components
│   │   └── ui/                # shadcn/ui components
│   ├── actions/               # Server actions
│   │   ├── collection/        # Collection actions
│   │   ├── favorites/         # Favorites actions
│   │   ├── linkActions/       # Link management actions
│   │   ├── platform/          # Platform actions
│   │   ├── sharedEmails/      # Email sharing actions
│   │   └── user/              # User actions
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── api/               # API client utilities
│   │   └── ratelimit/         # Rate limiting utilities
│   ├── store/                 # State management
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── migrations/                # Database migrations
├── public/                    # Static assets
├── scripts/                   # Build scripts
├── drizzle.config.ts          # Database configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

#### 🤖 **agents-api** (FastAPI AI Agents)

```
agents-api/
├── agents/                    # AI agent modules
│   ├── article_extractor/     # Article link extraction
│   │   ├── models.py          # Data models
│   │   ├── routes.py          # API routes
│   │   ├── service.py         # Business logic
│   │   └── tests.py           # Unit tests
│   ├── bookmark_importer/     # Bookmark import agent
│   │   ├── models.py          # Data models
│   │   ├── routes.py          # API routes
│   │   ├── service.py         # Business logic
│   │   ├── tests.py           # Unit tests
│   │   └── README.md          # Documentation
│   ├── collection_generator/  # Collection generation agent
│   ├── smart_export/          # Smart export agent
│   ├── watch_later_organizer/ # YouTube organizer agent
│   └── youtube_extractor/     # YouTube link extraction
├── config/                    # Configuration
│   ├── __init__.py
│   └── settings.py            # App settings
├── core/                      # Core utilities
│   ├── __init__.py
│   ├── models.py              # Base models
│   └── utils.py               # Utility functions
├── tests/                     # Integration tests
│   ├── __init__.py
│   └── test_integration.py    # Integration test suite
├── Dockerfile                 # Production Docker config
├── Dockerfile.dev             # Development Docker config
├── env.example                # Environment variables template
├── main.py                    # FastAPI application entry
├── pyproject.toml             # Python project configuration
├── README.md                  # Project documentation
├── requirements.txt            # Python dependencies
├── run_dev.py                 # Development server script
└── test_api.py                # API testing script
```

#### 🔌 **extension-api** (FastAPI Extension Backend)

```
extension-api/
├── app/                       # Application code
│   ├── api/                   # API endpoints
│   │   └── routes.py          # Route definitions
│   └── core/                  # Core functionality
│       ├── config.py          # Configuration settings
│       ├── database.py        # Database connection
│       └── utils.py           # Utility functions
├── models/                    # Data models
│   ├── __init__.py
│   └── schemas.py             # Pydantic schemas
├── Dockerfile                 # Production Docker config
├── Dockerfile.dev             # Development Docker config
├── env.example                # Environment variables template
├── main.py                    # FastAPI application entry
├── pyproject.toml             # Python project configuration
├── README.md                  # Project documentation
├── requirements.txt            # Python dependencies
├── run_dev.py                 # Development server script
├── API_CHANGES_SUMMARY.md     # API changes documentation
├── API_DOCUMENTATION.md       # API documentation
├── API_KEY_AUTHENTICATION.md  # Authentication guide
├── API_QUICK_REFERENCE.md     # Quick reference guide
└── EXTENSION_STARTER_TEMPLATE.md # Extension template guide
```

#### 🔧 **Browser Extension** (React + TypeScript)

```
cur8t-extension/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── manifest.json             # Extension manifest (Chrome)
│   ├── manifest.dev.json         # Development manifest
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── components.json           # shadcn/ui configuration
│   └── vite.config.*.ts          # Vite build configurations
│
├── 🎨 Public Assets
│   ├── icon-32.png              # Extension icon (32px)
│   ├── icon-128.png             # Extension icon (128px)
│   ├── dev-icon-32.png          # Development icon
│   ├── dev-icon-128.png         # Development icon
│   └── contentStyle.css          # Content script styles
│
├── 📚 Documentation
│   ├── README.md                 # Project overview
│   ├── API_DOCUMENTATION.md      # API reference
│   ├── BOOKMARK_ORGANIZATION_API.md
│   ├── CACHING_SYSTEM.md         # Cache implementation
│   ├── EXTENSION_USAGE.md        # Usage guide
│   └── LICENSE                   # MIT license
│
└── 🚀 Source Code (src/)
    ├── 📱 Pages
    │   ├── popup/                # Main extension popup
    │   │   ├── index.tsx         # Popup entry point
    │   │   ├── Popup.tsx         # Main popup component
    │   │   ├── CollectionsTab.tsx # Collections management
    │   │   ├── FavoritesTab.tsx  # Favorites management
    │   │   ├── BookmarksTab.tsx  # Bookmark organization
    │   │   ├── index.css         # Popup styles
    │   │   └── index.html        # Popup HTML template
    │   │
    │   ├── options/              # Extension options page
    │   │   ├── index.tsx         # Options entry point
    │   │   ├── Options.tsx       # Options component
    │   │   ├── index.css         # Options styles
    │   │   └── index.html        # Options HTML template
    │   │
    │   ├── panel/                # DevTools panel
    │   │   ├── index.tsx         # Panel entry point
    │   │   ├── Panel.tsx         # Panel component
    │   │   ├── index.css         # Panel styles
    │   │   └── index.html        # Panel HTML template
    │   │
    │   ├── newtab/               # New tab page (future)
    │   │
    │   ├── content/              # Content scripts
    │   │   ├── index.tsx         # Content script entry
    │   │   └── style.css         # Content styles
    │   │
    │   ├── background/           # Background service
    │   │   └── index.ts          # Background script
    │   │
    │   └── devtools/             # DevTools integration
    │       ├── index.ts          # DevTools script
    │       └── index.html        # DevTools HTML
    │
    ├── 🧩 Components
    │   └── ui/                   # shadcn/ui components
    │       ├── button.tsx        # Button component
    │       ├── card.tsx          # Card component
    │       ├── badge.tsx         # Badge component
    │       ├── input.tsx         # Input component
    │       ├── label.tsx         # Label component
    │       ├── separator.tsx     # Separator component
    │       ├── sonner.tsx        # Toast notifications
    │       ├── tabs.tsx          # Tabs component
    │       └── theme-toggle.tsx  # Theme toggle
    │
    ├── 🔧 Libraries (lib/)
    │   ├── api.ts                # API client & data models
    │   ├── auth.ts               # Authentication service
    │   ├── bookmarks.ts          # Browser bookmark manager
    │   ├── cache.ts              # Offline caching system
    │   ├── preloader.ts          # Data preloading service
    │   ├── theme.ts              # Theme management
    │   ├── utils.ts              # Utility functions
    │   └── bookmarks.test.ts     # Bookmark tests
    │
    ├── 🎨 Assets
    │   ├── img/
    │   │   └── logo.svg          # Application logo
    │   └── styles/
    │       └── tailwind.css      # Tailwind CSS imports
    │
    ├── 🌐 Localization
    │   └── locales/
    │       └── en/
    │           └── messages.json # English translations
    │
    └── 📝 Type Definitions
        ├── global.d.ts           # Global type definitions
        └── vite-env.d.ts         # Vite environment types
```

### Data Flow

1. **Save a bookmark** → Browser extension → Extension API → Main app
2. **AI processes it** → Agents API → Categorizes → Updates collections
3. **Share it** → Public/private settings → Social features → GitHub sync
