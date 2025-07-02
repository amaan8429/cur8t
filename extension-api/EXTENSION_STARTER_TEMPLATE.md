# Browser Extension Starter Template

This is a sample browser extension structure that integrates with the Cur8t Extension API.

## File Structure

```
my-cur8t-extension/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── background/
│   └── background.js
├── content/
│   └── content.js
├── api/
│   └── cur8t-api.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## manifest.json

```json
{
  "manifest_version": 3,
  "name": "Cur8t Bookmark Extension",
  "version": "1.0.0",
  "description": "Quick bookmark saver for Cur8t collections",

  "permissions": ["activeTab", "storage"],

  "host_permissions": ["http://localhost:8001/*"],

  "background": {
    "service_worker": "background/background.js"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content.js"]
    }
  ],

  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Save to Cur8t",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },

  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

## api/cur8t-api.js

```javascript
class Cur8tAPI {
  constructor(userId) {
    this.userId = userId;
    this.baseURL = "http://localhost:8001/api/v1";
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultHeaders = {
      Authorization: `Bearer ${this.userId}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ detail: "Unknown error" }));
        throw new Error(`API Error: ${error.detail}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Cur8t API Error:", error);
      throw error;
    }
  }

  async getTopCollections() {
    const data = await this.request("/top-collections");
    return data.data;
  }

  async addBookmark(collectionId, url, title = null) {
    const data = await this.request(`/collections/${collectionId}/links`, {
      method: "POST",
      body: JSON.stringify({ url, ...(title && { title }) }),
    });
    return data.data;
  }

  async testConnection() {
    return await this.request("/test-auth");
  }
}

// Make it available globally
window.Cur8tAPI = Cur8tAPI;
```

## popup/popup.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Save to Cur8t</h1>
      </header>

      <main>
        <div id="loading" class="loading">
          <p>Loading collections...</p>
        </div>

        <div id="error" class="error hidden">
          <p id="error-message"></p>
          <button id="retry-button">Retry</button>
        </div>

        <div id="main-content" class="hidden">
          <div class="page-info">
            <p class="page-title" id="page-title"></p>
            <p class="page-url" id="page-url"></p>
          </div>

          <div class="collection-select">
            <label for="collection-dropdown">Save to collection:</label>
            <select id="collection-dropdown">
              <option value="">Select a collection...</option>
            </select>
          </div>

          <div class="title-input">
            <label for="bookmark-title">Title (optional):</label>
            <input
              type="text"
              id="bookmark-title"
              placeholder="Auto-extracted from page"
            />
          </div>

          <div class="actions">
            <button id="save-button" disabled>Save Bookmark</button>
          </div>

          <div id="success" class="success hidden">
            <p>✅ Bookmark saved successfully!</p>
          </div>
        </div>
      </main>
    </div>

    <script src="../api/cur8t-api.js"></script>
    <script src="popup.js"></script>
  </body>
</html>
```

## popup/popup.css

```css
body {
  width: 300px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
}

.container {
  padding: 16px;
}

header h1 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #d73a49;
}

.success {
  color: #28a745;
  text-align: center;
  padding: 10px;
  background: #d4edda;
  border-radius: 4px;
  margin-top: 10px;
}

.hidden {
  display: none;
}

.page-info {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.page-title {
  font-weight: bold;
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.3;
}

.page-url {
  margin: 0;
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.collection-select,
.title-input {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

select,
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

select:focus,
input:focus {
  outline: none;
  border-color: #0066cc;
}

.actions {
  margin-top: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #0052a3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

#retry-button {
  background: #dc3545;
  margin-top: 10px;
}

#retry-button:hover {
  background: #c82333;
}
```

## popup/popup.js

```javascript
class PopupManager {
  constructor() {
    this.api = null;
    this.currentTab = null;
    this.collections = [];

    this.initializeElements();
    this.bindEvents();
    this.initialize();
  }

  initializeElements() {
    this.elements = {
      loading: document.getElementById("loading"),
      error: document.getElementById("error"),
      errorMessage: document.getElementById("error-message"),
      retryButton: document.getElementById("retry-button"),
      mainContent: document.getElementById("main-content"),
      pageTitle: document.getElementById("page-title"),
      pageUrl: document.getElementById("page-url"),
      collectionDropdown: document.getElementById("collection-dropdown"),
      bookmarkTitle: document.getElementById("bookmark-title"),
      saveButton: document.getElementById("save-button"),
      success: document.getElementById("success"),
    };
  }

  bindEvents() {
    this.elements.retryButton.addEventListener("click", () =>
      this.initialize()
    );
    this.elements.collectionDropdown.addEventListener("change", () =>
      this.updateSaveButton()
    );
    this.elements.saveButton.addEventListener("click", () =>
      this.saveBookmark()
    );
  }

  async initialize() {
    try {
      this.showSection("loading");

      // Get current tab info
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      this.currentTab = tabs[0];

      // Get user ID from storage (you'll need to implement user auth)
      const { userId } = await chrome.storage.sync.get(["userId"]);
      if (!userId) {
        throw new Error("User not logged in. Please set up authentication.");
      }

      // Initialize API
      this.api = new Cur8tAPI(userId);

      // Test connection and load collections
      await this.api.testConnection();
      this.collections = await this.api.getTopCollections();

      // Update UI
      this.updatePageInfo();
      this.updateCollectionDropdown();
      this.showSection("mainContent");
    } catch (error) {
      this.showError(error.message);
    }
  }

  updatePageInfo() {
    this.elements.pageTitle.textContent = this.currentTab.title;
    this.elements.pageUrl.textContent = this.currentTab.url;
    this.elements.bookmarkTitle.placeholder = this.currentTab.title;
  }

  updateCollectionDropdown() {
    // Clear existing options except the first one
    const dropdown = this.elements.collectionDropdown;
    while (dropdown.children.length > 1) {
      dropdown.removeChild(dropdown.lastChild);
    }

    // Add collections
    this.collections.forEach((collection) => {
      const option = document.createElement("option");
      option.value = collection.id;
      option.textContent = `${collection.title} (${collection.totalLinks} links)`;
      dropdown.appendChild(option);
    });
  }

  updateSaveButton() {
    const hasCollection = this.elements.collectionDropdown.value !== "";
    this.elements.saveButton.disabled = !hasCollection;
  }

  async saveBookmark() {
    try {
      this.elements.saveButton.disabled = true;
      this.elements.saveButton.textContent = "Saving...";

      const collectionId = this.elements.collectionDropdown.value;
      const title = this.elements.bookmarkTitle.value.trim() || null;
      const url = this.currentTab.url;

      await this.api.addBookmark(collectionId, url, title);

      this.elements.success.classList.remove("hidden");
      this.elements.saveButton.textContent = "Saved!";

      // Close popup after 2 seconds
      setTimeout(() => window.close(), 2000);
    } catch (error) {
      this.showError(`Failed to save bookmark: ${error.message}`);
      this.elements.saveButton.disabled = false;
      this.elements.saveButton.textContent = "Save Bookmark";
    }
  }

  showSection(section) {
    Object.keys(this.elements).forEach((key) => {
      if (["loading", "error", "mainContent"].includes(key)) {
        this.elements[key].classList.add("hidden");
      }
    });

    if (section === "loading") {
      this.elements.loading.classList.remove("hidden");
    } else if (section === "error") {
      this.elements.error.classList.remove("hidden");
    } else if (section === "mainContent") {
      this.elements.mainContent.classList.remove("hidden");
    }
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.showSection("error");
  }
}

// Initialize when popup opens
document.addEventListener("DOMContentLoaded", () => {
  new PopupManager();
});
```

## background/background.js

```javascript
// Background script for handling extension lifecycle and API calls

chrome.runtime.onInstalled.addListener(() => {
  console.log("Cur8t Extension installed");

  // Set up context menu (optional)
  chrome.contextMenus.create({
    id: "save-to-cur8t",
    title: "Save to Cur8t",
    contexts: ["page", "link"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-to-cur8t") {
    // Open popup or handle saving directly
    chrome.action.openPopup();
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveBookmark") {
    // Handle bookmark saving logic
    handleBookmarkSave(request.data)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true; // Keep message channel open for async response
  }
});

async function handleBookmarkSave(data) {
  // Get user ID from storage
  const { userId } = await chrome.storage.sync.get(["userId"]);
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Use the API to save bookmark
  const api = new Cur8tAPI(userId);
  return await api.addBookmark(data.collectionId, data.url, data.title);
}
```

## content/content.js

```javascript
// Content script for page interaction (optional)

// Add keyboard shortcut for quick save
document.addEventListener("keydown", (event) => {
  // Ctrl+Shift+S (or Cmd+Shift+S on Mac)
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "S") {
    event.preventDefault();

    // Send message to background script or open popup
    chrome.runtime.sendMessage({
      action: "quickSave",
      data: {
        url: window.location.href,
        title: document.title,
      },
    });
  }
});

// Optional: Add visual feedback when bookmark is saved
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "bookmarkSaved") {
    showSuccessMessage("Bookmark saved to Cur8t!");
  }
});

function showSuccessMessage(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: system-ui;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
```

## Setup Instructions

1. **Create the extension folder** with all the files above
2. **Add icons** (16x16, 48x48, 128x128 PNG files)
3. **Set up user authentication**:
   ```javascript
   // In popup or background script
   chrome.storage.sync.set({ userId: "user_2rpYE73BYUo1CtmFy3hXiV0Z8BC" });
   ```
4. **Load extension in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select your extension folder
5. **Test the extension**:
   - Make sure your FastAPI server is running
   - Click the extension icon
   - Select a collection and save a bookmark

## Next Steps

- Add proper user authentication flow
- Implement error handling and retry logic
- Add more collection management features
- Style the popup to match your brand
- Add keyboard shortcuts and context menus
- Test across different websites and scenarios
