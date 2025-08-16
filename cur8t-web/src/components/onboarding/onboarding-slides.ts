export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  actionText?: string;
  onAction?: () => void;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'welcome',
    title: 'Welcome to Cur8t',
    description:
      'Your personal knowledge hub. Organize everything, discover amazing resources, and share what you learn with the world.',
    image: '/images/onboarding/21.png',
  },
  {
    id: 'collections',
    title: 'Smart Collections',
    description:
      'Group related links, articles, and resources into organized collections. Your knowledge, perfectly structured.',
    image: '/images/onboarding/collection-ui.png',
  },
  {
    id: 'add-links',
    title: 'Add Links Instantly',
    description:
      'Drop any link into your collections. Build your knowledge base one bookmark at a time.',
    image: '/images/onboarding/add-new-link.png',
  },
  {
    id: 'visibility-controls',
    title: 'Privacy Control',
    description:
      'Public or private? You decide. Share knowledge with the world or keep it just for you.',
    image: '/images/onboarding/change-vislblity.png',
  },
  {
    id: 'advanced-sharing',
    title: 'Share Everything',
    description:
      'Generate shareable links for any collection. Control who sees what, when they see it.',
    image: '/images/onboarding/advanced-visiblity-and-copy-link.png',
  },
  {
    id: 'shared-collections',
    title: 'Discover Knowledge',
    description:
      'Explore collections shared by others. Find hidden gems and learn from the community.',
    image: '/images/onboarding/collections-shared-via-link-ui.png',
  },
  {
    id: 'browser-extension',
    title: 'Browser Extension',
    description:
      'Install once, save everywhere. Organize your browsing without leaving the page.',
    image: '/images/onboarding/cur8t-extension-install.png',
  },
  {
    id: 'save-tabs',
    title: 'One-Click Tab Saver',
    description:
      'Save all open tabs instantly. Never lose your research again.',
    image:
      '/images/onboarding/extension_save-all-tabs-in-one-click-to-your-bookmarks-and-collection.png',
  },
  {
    id: 'save-any-tab',
    title: 'Save Any Tab',
    description:
      'Right-click, save to collection. Your browsing becomes your knowledge base.',
    image:
      '/images/onboarding/extension_save-any-tab-your-collection-in-one-clcik.png',
  },
  {
    id: 'organize-bookmarks',
    title: 'Smart Bookmark Import',
    description:
      'Import your messy bookmarks. We organize them automatically into smart collections.',
    image:
      '/images/onboarding/extension_organize-and-export-your-bookmarks.png',
  },
  {
    id: 'bookmark-import',
    title: 'Import & Organize',
    description:
      "Start with what you have. We'll turn your bookmarks into organized knowledge.",
    image:
      '/images/onboarding/import-your-bookamrks-and-we-will-organize-them.png',
  },
  {
    id: 'export-collections',
    title: 'Export & Share',
    description:
      'Take your collections anywhere. Multiple formats, multiple platforms.',
    image: '/images/onboarding/export-your-collection-links.png',
  },
  {
    id: 'article-extractor',
    title: 'AI Article Extractor',
    description:
      'Drop any article link. Our AI extracts the key content and organizes it for you.',
    image: '/images/onboarding/article-link-extracter-tool.png',
  },
  {
    id: 'tools-agents',
    title: 'AI-Powered Tools',
    description:
      'Smart agents that organize, analyze, and enhance your collections automatically.',
    image: '/images/onboarding/tools-and-agents.png',
  },
  {
    id: 'saved-collections',
    title: 'Save from Others',
    description:
      'Found something amazing? Save it to your library. Build knowledge together.',
    image: '/images/onboarding/saved-collections.png',
  },
  {
    id: 'favorites',
    title: 'Your Favorites',
    description:
      'Quick access to what matters most. Your personal knowledge shortcuts.',
    image: '/images/onboarding/favorites.png',
  },
  {
    id: 'access-requests',
    title: 'Control Access',
    description:
      'Who can see your private collections? You approve every request.',
    image:
      '/images/onboarding/notifications-to-accept-reqeust-access-of-collections.png',
  },
  {
    id: 'github-integration',
    title: 'GitHub Sync',
    description:
      'Connect your repos. Keep development resources organized and accessible.',
    image: '/images/onboarding/github-integration-to-sync-collections.png',
  },
  {
    id: 'upcoming-integrations',
    title: 'VSCode & CLI Coming',
    description:
      "More ways to use Cur8t. Soon you'll organize knowledge from your favorite tools.",
    image: '/images/onboarding/upcoming-integrations-of-vscode-and-cli.png',
  },
  {
    id: 'explore',
    title: 'Explore Community',
    description:
      'Discover amazing collections. Learn from others, get inspired, find resources.',
    image: '/images/onboarding/explore-page.png',
  },
  {
    id: 'profile-settings',
    title: 'Customize Profile',
    description:
      'Make it yours. Control how others see your knowledge and collections.',
    image: '/images/onboarding/profile-settings.png',
  },
  {
    id: 'social-settings',
    title: 'Social Integration',
    description:
      'Connect your social accounts. Share collections across platforms seamlessly.',
    image: '/images/onboarding/social-settings.png',
  },
  {
    id: 'api-key-settings',
    title: 'API Access',
    description:
      'Manage your API keys. Secure access for integrations and third-party tools.',
    image: '/images/onboarding/api-key-settings.png',
  },
  {
    id: 'top-collections',
    title: 'Showcase Collections',
    description:
      'Choose what appears on your profile. Highlight your best work.',
    image: '/images/onboarding/top-collections-settings.png',
  },
  {
    id: 'username',
    title: 'Choose Username',
    description:
      'Your public identity. How others will find and recognize your collections.',
    image: '/images/onboarding/profile-of-user.png',
  },
];
