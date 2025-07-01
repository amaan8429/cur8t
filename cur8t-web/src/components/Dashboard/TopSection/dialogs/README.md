# Agents Integration - Frontend

This directory contains the frontend integration for Cur8t AI Agents. Each agent has its own dialog component that provides a complete user interface for interacting with the agent's functionality.

## 🏗️ Architecture

```
dialogs/
├── README.md                      # This documentation
├── article-extractor-dialog.tsx   # Article Link Extractor UI ✅ ACTIVE
├── api-status-indicator.tsx       # API connection status indicator
└── [future-agent-dialogs].tsx     # Future agent dialogs
```

## 🚀 How It Works

### 1. Dialog-Based Design

- Each agent has its own dialog component
- Dialogs are reusable and can be triggered from anywhere in the app
- Clean, modal-based interface that doesn't disrupt user workflow

### 2. Multi-Step User Experience

- **Step 1**: Input form for agent parameters
- **Step 2**: Results display with interactive functionality
- Seamless navigation between steps

### 3. API Integration

- Clean API abstraction via `@/lib/api/agents.ts`
- Proper error handling and user feedback
- Real-time status updates

## 🤖 Available Agents

### Article Link Extractor ✅ ACTIVE

**Features**:

- ✅ Extract links from any article URL
- ✅ Auto-generate or custom collection names
- ✅ Delete unwanted links
- ✅ Add custom links manually
- ✅ Edit collection name inline
- ✅ Preview and save collection
- ✅ Real-time validation and error handling

**User Flow**:

1. Enter article URL and optional collection name
2. Agent fetches article and extracts all links
3. User reviews extracted links in a beautiful grid
4. User can delete, edit, or add new links
5. User can modify collection name
6. Save final collection

### API Status Indicator 📊 MONITORING

**Features**:

- ✅ Real-time API connection status
- ✅ Detailed API information dialog
- ✅ List of available agents and their status
- ✅ Connection troubleshooting help
- ✅ Manual refresh capability

## 🛠️ Usage

### Basic Implementation

```tsx
import { ArticleExtractorDialog } from "./dialogs/article-extractor-dialog";

function MyComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Extract Article Links</Button>

      <ArticleExtractorDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
```

## 🎨 Design System

### Components Used

- **Dialog**: Main container for agent interfaces
- **Card**: For organizing content sections
- **Badge**: For status indicators and tags
- **Button**: For actions and navigation
- **Input/Label**: For form elements
- **Toast**: For notifications and feedback

## 🔧 API Service

**File**: `@/lib/api/agents.ts`

### Key Features

- Type-safe API calls with TypeScript interfaces
- Centralized error handling with `AgentsApiError`
- Environment-based configuration
- Singleton pattern for consistent usage

## 🌐 Environment Configuration

```env
# .env.local
NEXT_PUBLIC_AGENTS_API_URL=http://localhost:8000
```

## 🎯 Quick Start

1. **Start the Agents API**:

   ```bash
   cd agents-api
   uvicorn main:app --reload
   ```

2. **Check API Status**:

   - Look for green "Connected" badge in Tools & Agents
   - Click the badge for detailed information

3. **Try Article Extractor**:
   - Click "Try Agent" on Article Link Extractor card
   - Enter any article URL
   - Experience the full extraction workflow

Built with ❤️ for seamless AI agent integration!
