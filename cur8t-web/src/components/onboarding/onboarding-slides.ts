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
    id: 'browser-extension',
    title: 'Get the Chrome Extension',
    description:
      'Transform your bookmarks into intelligent collections with AI-powered organization. One-click saving from anywhere.',
    image: '/images/onboarding/cur8t-extension-install.png',
    actionText: 'Add to Chrome',
    onAction: () => {
      window.open(
        'https://chromewebstore.google.com/detail/nmimopllfhdfejjajepepllgdpkglnnj?utm_source=item-share-cb',
        '_blank'
      );
    },
  },
  {
    id: 'organize-bookmarks',
    title: 'AI-Powered Import',
    description:
      'Import your messy bookmarks. Our AI automatically organizes them into smart collections.',
    image:
      '/images/onboarding/extension_organize-and-export-your-bookmarks.png',
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
    id: 'explore',
    title: 'Discover & Share',
    description:
      'Explore amazing collections from the community. Share your knowledge and discover hidden gems.',
    image: '/images/onboarding/explore-page.png',
  },
  {
    id: 'username',
    title: 'Choose Username',
    description:
      'Your public identity. How others will find and recognize your collections.',
    image: '/images/onboarding/profile-of-user.png',
  },
];
